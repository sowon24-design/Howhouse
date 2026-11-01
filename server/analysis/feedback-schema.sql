-- PREPARED ONLY. Retention is awaiting team decision. Do not apply/activate yet.
-- Uses existing auth.users and server-only Supabase secret. No model call/input/photo/message storage.
begin;
-- Empty until the team explicitly chooses a period and enables a reviewed cleanup job.
create table if not exists public.howhouse_feedback_policy (
  singleton boolean primary key default true check(singleton),
  retention_days integer not null check(retention_days between 1 and 3650),
  cleanup_enabled boolean not null default false
);
alter table public.howhouse_feedback_policy enable row level security;
revoke all on public.howhouse_feedback_policy from public,anon,authenticated;
grant select on public.howhouse_feedback_policy to service_role;
create table if not exists public.howhouse_feedback_results (
  owner_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  source text not null check (source in ('existing','generated')),
  case_id text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key(owner_id,request_id),
  check ((source='existing' and case_id is not null) or (source='generated' and case_id is null))
);
create table if not exists public.howhouse_feedback_ratings (
  owner_id uuid not null references auth.users(id) on delete cascade,
  target_key text not null,
  rating text check(rating in ('like','dislike')),
  revision bigint not null check(revision between 1 and 9007199254740991),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key(owner_id,target_key)
);
create table if not exists public.howhouse_feedback_opinions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  target_key text not null,
  reason text not null check(reason in ('situation-mismatch','incorrect-method','unsafe-method','too-difficult','missing-information','custom')),
  encrypted_comment jsonb,
  submitted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key(owner_id,operation_id),
  check ((reason='custom' and encrypted_comment is not null) or (reason<>'custom' and encrypted_comment is null))
);
-- Minimal idempotency receipts: no historical rating values or duplicate opinion text.
create table if not exists public.howhouse_feedback_operations (
  owner_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  kind text not null check(kind in ('rating','opinions')),
  payload_hash text not null check(payload_hash ~ '^[a-f0-9]{64}$'),
  receipt jsonb not null,
  expires_at timestamptz not null,
  primary key(owner_id,operation_id)
);
alter table public.howhouse_feedback_results enable row level security;
alter table public.howhouse_feedback_ratings enable row level security;
alter table public.howhouse_feedback_opinions enable row level security;
alter table public.howhouse_feedback_operations enable row level security;
revoke all on public.howhouse_feedback_results, public.howhouse_feedback_ratings,
  public.howhouse_feedback_opinions, public.howhouse_feedback_operations from public, anon, authenticated;
grant select,insert,update,delete on public.howhouse_feedback_results, public.howhouse_feedback_ratings,
  public.howhouse_feedback_opinions, public.howhouse_feedback_operations to service_role;
create index if not exists howhouse_feedback_results_expiry on public.howhouse_feedback_results(expires_at);
create index if not exists howhouse_feedback_ratings_expiry on public.howhouse_feedback_ratings(expires_at);
create index if not exists howhouse_feedback_opinions_expiry on public.howhouse_feedback_opinions(expires_at);
create index if not exists howhouse_feedback_operations_expiry on public.howhouse_feedback_operations(expires_at);

create or replace function public.howhouse_feedback(p_owner uuid, p_kind text, p_payload jsonb, p_hash text, p_days integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_target text := p_payload->>'target';
  v_operation uuid;
  v_request uuid;
  v_revision bigint;
  v_previous public.howhouse_feedback_operations%rowtype;
  v_rating public.howhouse_feedback_ratings%rowtype;
  v_receipt jsonb;
  v_at timestamptz := now();
  v_expiry timestamptz;
begin
  if p_owner is null or p_days is null or p_days<1 or p_days>3650 or p_kind is null or p_kind not in ('result','state','rating','opinions')
    or jsonb_typeof(p_payload) is distinct from 'object' then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
  if not exists(select 1 from public.howhouse_feedback_policy where singleton and retention_days=p_days and cleanup_enabled) then
    return jsonb_build_object('ok',false,'code','feedback-not-configured'); end if;
  v_expiry := v_at + make_interval(days=>p_days);
  if p_kind='result' then
    v_request := (p_payload->>'requestId')::uuid;
    if v_request is null or p_payload->>'source' is null or p_payload->>'source' not in ('existing','generated') then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
    insert into public.howhouse_feedback_results(owner_id,request_id,source,case_id,expires_at)
    values(p_owner,v_request,p_payload->>'source',p_payload->>'caseId',v_expiry)
    on conflict(owner_id,request_id) do nothing;
    if not exists(select 1 from public.howhouse_feedback_results where owner_id=p_owner and request_id=v_request
      and source=p_payload->>'source' and case_id is not distinct from p_payload->>'caseId') then
      return jsonb_build_object('ok',false,'code','idempotency-conflict'); end if;
    return jsonb_build_object('ok',true,'data',jsonb_build_object('registered',true));
  end if;
  if v_target is null or length(v_target)>240 or v_target !~ '^(existing:.+|generated:[0-9a-f-]{36})$' then
    return jsonb_build_object('ok',false,'code','invalid-input'); end if;
  if p_kind<>'state' then
    v_operation := (p_payload->>'operationId')::uuid;
    if v_operation is null or p_hash is null or p_hash !~ '^[a-f0-9]{64}$' then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
    perform pg_advisory_xact_lock(hashtextextended('feedback-op:'||p_owner::text||':'||v_operation::text,0));
    select * into v_previous from public.howhouse_feedback_operations where owner_id=p_owner and operation_id=v_operation and expires_at>v_at;
    if found then
      if v_previous.kind<>p_kind or v_previous.payload_hash<>p_hash then return jsonb_build_object('ok',false,'code','idempotency-conflict'); end if;
      return jsonb_build_object('ok',true,'data',v_previous.receipt||jsonb_build_object('duplicate',true));
    end if;
  end if;
  -- Source must match an actual result delivered to this verified user. No made-up existing ID fallback.
  if v_target like 'generated:%' then
    v_request := substring(v_target from 11)::uuid;
    perform 1 from public.howhouse_feedback_results where owner_id=p_owner and request_id=v_request and source='generated' and expires_at>v_at for update;
    if not found then
      return jsonb_build_object('ok',false,'code','result-unavailable'); end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended('feedback-target:'||p_owner::text||':'||v_target,0));
  select * into v_rating from public.howhouse_feedback_ratings where owner_id=p_owner and target_key=v_target and expires_at>v_at;
  if p_kind='state' then
    return jsonb_build_object('ok',true,'data',jsonb_build_object('rating',v_rating.rating,'revision',coalesce(v_rating.revision,0),'updatedAt',v_rating.updated_at));
  end if;
  if p_kind='rating' then
    v_revision := (p_payload->>'revision')::bigint;
    if v_revision is null or v_revision<1 or v_revision>9007199254740991 or not(p_payload ? 'rating')
      or (p_payload->>'rating' is not null and p_payload->>'rating' not in ('like','dislike')) then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
    if v_revision<=coalesce(v_rating.revision,0) then return jsonb_build_object('ok',false,'code','stale-selection'); end if;
    insert into public.howhouse_feedback_ratings(owner_id,target_key,rating,revision,updated_at,expires_at)
    values(p_owner,v_target,p_payload->>'rating',v_revision,v_at,v_expiry)
    on conflict(owner_id,target_key) do update set rating=excluded.rating,revision=excluded.revision,updated_at=excluded.updated_at,expires_at=excluded.expires_at;
  else
    if p_payload->>'reason' is null or p_payload->>'reason' not in ('situation-mismatch','incorrect-method','unsafe-method','too-difficult','missing-information','custom')
      or (p_payload->>'reason'='custom' and (jsonb_typeof(p_payload->'comment') is distinct from 'object'))
      or (p_payload->>'reason'<>'custom' and p_payload ? 'comment') then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
    insert into public.howhouse_feedback_opinions(owner_id,operation_id,target_key,reason,encrypted_comment,submitted_at,expires_at)
    values(p_owner,v_operation,v_target,p_payload->>'reason',p_payload->'comment',v_at,v_expiry)
    on conflict(owner_id,operation_id) do update set target_key=excluded.target_key,reason=excluded.reason,
      encrypted_comment=excluded.encrypted_comment,submitted_at=excluded.submitted_at,expires_at=excluded.expires_at;
  end if;
  if v_target like 'generated:%' then
    update public.howhouse_feedback_results set expires_at=greatest(expires_at,v_expiry)
    where owner_id=p_owner and request_id=v_request;
  end if;
  v_receipt := jsonb_build_object('operationId',v_operation,'saved',true,'duplicate',false,'submittedAt',v_at);
  if p_kind='rating' then v_receipt:=v_receipt||jsonb_build_object('revision',v_revision); end if;
  insert into public.howhouse_feedback_operations(owner_id,operation_id,kind,payload_hash,receipt,expires_at)
  values(p_owner,v_operation,p_kind,p_hash,v_receipt,v_expiry)
  on conflict(owner_id,operation_id) do update set kind=excluded.kind,payload_hash=excluded.payload_hash,receipt=excluded.receipt,expires_at=excluded.expires_at;
  return jsonb_build_object('ok',true,'data',v_receipt);
exception when invalid_text_representation or numeric_value_out_of_range then
  return jsonb_build_object('ok',false,'code','invalid-input');
end;
$$;
revoke all on function public.howhouse_feedback(uuid,text,jsonb,text,integer) from public,anon,authenticated;
grant execute on function public.howhouse_feedback(uuid,text,jsonb,text,integer) to service_role;

create or replace function public.howhouse_feedback_purge()
returns void language plpgsql security definer set search_path='' as $$
begin
  -- Match the result -> rating -> opinion -> receipt lock order used by writers.
  delete from public.howhouse_feedback_results where expires_at<=now();
  delete from public.howhouse_feedback_ratings where expires_at<=now();
  delete from public.howhouse_feedback_opinions where expires_at<=now();
  delete from public.howhouse_feedback_operations where expires_at<=now();
end;
$$;
revoke all on function public.howhouse_feedback_purge() from public,anon,authenticated;
grant execute on function public.howhouse_feedback_purge() to service_role;
commit;
