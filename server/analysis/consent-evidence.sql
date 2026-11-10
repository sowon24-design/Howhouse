-- Additive migration after release-data.sql. No legacy state is promoted to new evidence.
begin;
-- Preserve the last legacy receipt as legacy data, never as a newly witnessed consent.
create table if not exists public.howhouse_legacy_consent_states (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null,
 preserved_at timestamptz not null default now()
);
create table if not exists public.howhouse_consent_documents (
 document_hash text primary key check(document_hash ~ '^[a-f0-9]{64}$'),
 document_version text not null,
 document_surface text not null check(document_surface in ('onboarding','analysis')),
 unique(document_version,document_surface),
 document_text text not null check(octet_length(document_text)<=100000),
 archived_at timestamptz not null default now(),
 check(encode(sha256(convert_to(document_text,'UTF8')),'hex')=document_hash)
);
create table if not exists public.howhouse_consent_events (
 event_id bigint generated always as identity primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 action text not null check(action in ('accepted','withdrawn')),
 document_version text,
 document_surface text,
 document_hash text references public.howhouse_consent_documents(document_hash),
 processing_accepted boolean not null,
 overseas_accepted boolean not null,
 age_at_least_14 boolean not null,
 recorded_at timestamptz not null default now(),
 check(action<>'accepted' or (document_hash is not null and document_version is not null and processing_accepted and overseas_accepted and age_at_least_14))
);
create index if not exists howhouse_consent_owner_events on public.howhouse_consent_events(owner_id,event_id desc);
insert into public.howhouse_legacy_consent_states(owner_id,state)
 select u.owner_id,jsonb_build_object(
  'consent_version',u.consent_version,'consent_at',u.consent_at,'age_at_least_14',u.age_at_least_14,
  'processing_accepted',u.processing_accepted,'processing_consent_version',u.processing_consent_version,'processing_consent_at',u.processing_consent_at,
  'overseas_accepted',u.overseas_accepted,'overseas_consent_version',u.overseas_consent_version,'overseas_consent_at',u.overseas_consent_at)
 from public.howhouse_release_users u
 where (u.consent_version is not null or u.processing_consent_at is not null or u.overseas_consent_at is not null)
 and not exists(select 1 from public.howhouse_consent_events e where e.owner_id=u.owner_id)
 on conflict(owner_id) do nothing;
alter table public.howhouse_legacy_consent_states enable row level security;
alter table public.howhouse_consent_documents enable row level security;
alter table public.howhouse_consent_events enable row level security;
revoke all on public.howhouse_legacy_consent_states,public.howhouse_consent_documents,public.howhouse_consent_events from public,anon,authenticated,service_role;
grant select on public.howhouse_legacy_consent_states,public.howhouse_consent_documents,public.howhouse_consent_events to service_role;

create or replace function public.howhouse_record_consent(
 p_owner uuid,p_version text,p_age boolean,p_processing boolean,p_overseas boolean,
 p_document_hash text,p_document_text text,p_surface text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; previous_version text; previous_hash text; previous_surface text; event_number bigint; event_time timestamptz;
begin
 if p_owner is null then return jsonb_build_object('ok',false,'code','auth-required'); end if;
 if p_version is not null and (p_age is distinct from true or p_processing is distinct from true or p_overseas is distinct from true) then
  return jsonb_build_object('ok',false,'code','invalid-input');
 end if;
 if p_version is not null and (p_document_text is null or p_document_hash is null or octet_length(p_document_text)>100000 or encode(sha256(convert_to(p_document_text,'UTF8')),'hex') is distinct from p_document_hash) then
  return jsonb_build_object('ok',false,'code','invalid-input');
 end if;
 if p_version is not null and (p_surface is null or p_surface not in ('onboarding','analysis') or p_document_text::jsonb->>'version' is distinct from p_version or p_document_text::jsonb->>'surface' is distinct from p_surface) then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 select consent_version into previous_version from public.howhouse_release_users where owner_id=p_owner for update;
 select document_hash,document_surface into previous_hash,previous_surface from public.howhouse_consent_events where owner_id=p_owner order by event_id desc limit 1;
 result:=public.howhouse_release_data(p_owner,'consent',jsonb_build_object('version',p_version,'ageAtLeast14',p_age,'processingAccepted',p_processing,'overseasAccepted',p_overseas));
 if result->'ok' is distinct from 'true'::jsonb then return result; end if;
 if p_version is not null then
  -- A version is immutable: changing wording requires a new version, not an overwrite.
  insert into public.howhouse_consent_documents(document_hash,document_version,document_text,document_surface)
  values(p_document_hash,p_version,p_document_text,p_surface) on conflict(document_hash) do nothing;
  if not exists(select 1 from public.howhouse_consent_documents where document_hash=p_document_hash and document_version=p_version and document_text=p_document_text and document_surface=p_surface) then
   raise exception 'consent-document-conflict';
  end if;
 end if;
 insert into public.howhouse_consent_events(owner_id,action,document_version,document_hash,document_surface,processing_accepted,overseas_accepted,age_at_least_14)
 values(p_owner,case when p_version is null then 'withdrawn' else 'accepted' end,
  coalesce(p_version,previous_version),case when p_version is null then previous_hash else p_document_hash end,case when p_version is null then previous_surface else p_surface end,
  p_version is not null,p_version is not null,coalesce(p_age,false))
 returning event_id,recorded_at into event_number,event_time;
 return jsonb_build_object('ok',true,'data',jsonb_build_object('accepted',p_version is not null,'eventId',event_number::text,'recordedAt',event_time,'documentHash',case when p_version is null then previous_hash else p_document_hash end));
end;
$$;

create or replace function public.howhouse_consent_evidence_state(p_owner uuid,p_version text,p_document_hashes text[])
returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('accepted',exists(
  select 1 from public.howhouse_release_users u
  join lateral (select * from public.howhouse_consent_events where owner_id=u.owner_id order by event_id desc limit 1) e on true
  where u.owner_id=p_owner and u.consent_version=p_version and u.age_at_least_14
  and u.processing_accepted and u.overseas_accepted
  and u.processing_consent_version=p_version and u.overseas_consent_version=p_version
  and e.action='accepted' and e.document_version=p_version and e.document_hash=any(p_document_hashes)
  and e.processing_accepted and e.overseas_accepted and e.age_at_least_14
 ));
$$;
revoke all on function public.howhouse_record_consent(uuid,text,boolean,boolean,boolean,text,text,text) from public,anon,authenticated;
revoke all on function public.howhouse_consent_evidence_state(uuid,text,text[]) from public,anon,authenticated;
grant execute on function public.howhouse_record_consent(uuid,text,boolean,boolean,boolean,text,text,text) to service_role;
grant execute on function public.howhouse_consent_evidence_state(uuid,text,text[]) to service_role;
commit;
