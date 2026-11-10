-- Release privacy storage. Apply only after owner review. Raw problem text/photos are not stored.
begin;
create table if not exists public.howhouse_release_users (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 delete_hash text unique check(delete_hash is null or length(delete_hash)=64),
 consent_version text, consent_at timestamptz, age_at_least_14 boolean not null default false,
 last_seen timestamptz not null default now()
);
-- Current consent state only, matching the approved account lifetime/deletion policy.
-- Existing combined receipts do not prove separate consent; never backfill acceptance.
alter table public.howhouse_release_users
 add column if not exists processing_accepted boolean not null default false,
 add column if not exists processing_consent_version text,
 add column if not exists processing_consent_at timestamptz,
 add column if not exists overseas_accepted boolean not null default false,
 add column if not exists overseas_consent_version text,
 add column if not exists overseas_consent_at timestamptz;
create table if not exists public.howhouse_deletion_jobs (
 operation_id uuid primary key, proof_hash text not null check(length(proof_hash)=64),
 owner_id uuid, state text not null check(state in ('pending','data-deleted','completed','cancelled')),
 requested_at timestamptz not null default now(), completed_at timestamptz,
 expires_at timestamptz not null default now()+interval '1 day'
);
create table if not exists public.howhouse_feedback_reviews (
 owner_id uuid not null, operation_id uuid not null, status text not null check(status in ('reviewed','needs-change')),
 reviewed_by uuid not null, reviewed_at timestamptz not null default now(),
 primary key(owner_id,operation_id),
 foreign key(owner_id,operation_id) references public.howhouse_feedback_opinions(owner_id,operation_id) on delete cascade
);
alter table public.howhouse_release_users enable row level security;
alter table public.howhouse_deletion_jobs enable row level security;
alter table public.howhouse_feedback_reviews enable row level security;
revoke all on public.howhouse_release_users,public.howhouse_deletion_jobs,public.howhouse_feedback_reviews from public,anon,authenticated;
grant select,insert,update,delete on public.howhouse_release_users,public.howhouse_deletion_jobs,public.howhouse_feedback_reviews to service_role;

create or replace function public.howhouse_release_data(p_owner uuid,p_kind text,p_payload jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare job public.howhouse_deletion_jobs%rowtype; op uuid; expected text;
begin
 if p_kind in ('delete-status','finish-delete','cancel-expiry') then
   op:=(p_payload->>'operationId')::uuid;
   select * into job from public.howhouse_deletion_jobs where operation_id=op and proof_hash=p_payload->>'proof' and (expires_at>now() or state in ('pending','data-deleted')) for update;
   if not found then return jsonb_build_object('ok',false,'code','not-found'); end if;
   if p_kind='cancel-expiry' and job.state='pending' then
     update public.howhouse_deletion_jobs set state='cancelled',owner_id=null,expires_at=now()+interval '1 day' where operation_id=op;
     return jsonb_build_object('ok',true,'data',jsonb_build_object('state','cancelled'));
   end if;
   if p_kind='finish-delete' then
     update public.howhouse_deletion_jobs set state='completed',owner_id=null,completed_at=now(),expires_at=now()+interval '1 day' where operation_id=op;
     return jsonb_build_object('ok',true,'data',jsonb_build_object('state','completed'));
   end if;
   return jsonb_build_object('ok',true,'data',jsonb_build_object('state',job.state,'owner',job.owner_id));
 end if;
 if p_owner is null or not exists(select 1 from auth.users where id=p_owner) then return jsonb_build_object('ok',false,'code','auth-required'); end if;
 if p_kind in ('touch','identity','consent') and exists(select 1 from public.howhouse_deletion_jobs where owner_id=p_owner and state in ('pending','data-deleted')) then return jsonb_build_object('ok',false,'code','auth-required'); end if;
 if p_kind='identity' then
   if coalesce(length(p_payload->>'deleteHash'),0)<>64 then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
   insert into public.howhouse_release_users(owner_id,delete_hash) values(p_owner,p_payload->>'deleteHash')
   on conflict(owner_id) do update set delete_hash=excluded.delete_hash,last_seen=now();
   return jsonb_build_object('ok',true,'data',jsonb_build_object('registered',true));
 elsif p_kind='touch' then
   insert into public.howhouse_release_users(owner_id) values(p_owner) on conflict(owner_id) do update set last_seen=now();
   return jsonb_build_object('ok',true,'data','{}'::jsonb);
 elsif p_kind='consent' then
   if p_payload->>'version' is not null and p_payload->'ageAtLeast14' is distinct from 'true'::jsonb then return jsonb_build_object('ok',false,'code','age-required'); end if;
   if p_payload->>'version' is not null and (p_payload->'processingAccepted' is distinct from 'true'::jsonb or p_payload->'overseasAccepted' is distinct from 'true'::jsonb) then return jsonb_build_object('ok',false,'code','consent-required'); end if;
   update public.howhouse_release_users set
     consent_version=p_payload->>'version',age_at_least_14=coalesce(p_payload->'ageAtLeast14'='true'::jsonb,false),consent_at=now(),last_seen=now(),
     processing_accepted=p_payload->>'version' is not null,
     processing_consent_version=p_payload->>'version',processing_consent_at=now(),
     overseas_accepted=p_payload->>'version' is not null,
     overseas_consent_version=p_payload->>'version',overseas_consent_at=now()
   where owner_id=p_owner;
   if not found then return jsonb_build_object('ok',false,'code','not-registered'); end if;
   return jsonb_build_object('ok',true,'data',jsonb_build_object('accepted',p_payload->>'version' is not null));
 elsif p_kind='consent-state' then
   return jsonb_build_object('ok',true,'data',jsonb_build_object('accepted',exists(select 1 from public.howhouse_release_users where owner_id=p_owner and consent_version=p_payload->>'version' and age_at_least_14=true and processing_accepted=true and overseas_accepted=true and processing_consent_version=p_payload->>'version' and overseas_consent_version=p_payload->>'version')));
 elsif p_kind='begin-delete' then
   if p_payload->>'confirm' is distinct from 'delete-my-data' then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
   op:=(p_payload->>'operationId')::uuid;
   if op is null or coalesce(length(p_payload->>'proof'),0)<>64 then return jsonb_build_object('ok',false,'code','invalid-input'); end if;
   perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
   insert into public.howhouse_deletion_jobs(operation_id,proof_hash,owner_id,state) values(op,p_payload->>'proof',p_owner,'pending') on conflict do nothing;
   select * into job from public.howhouse_deletion_jobs where operation_id=op for update;
   if job.proof_hash is distinct from p_payload->>'proof' or job.owner_id is distinct from p_owner then return jsonb_build_object('ok',false,'code','conflict'); end if;
   delete from public.howhouse_feedback_results where owner_id=p_owner;
   delete from public.howhouse_feedback_ratings where owner_id=p_owner;
   delete from public.howhouse_feedback_opinions where owner_id=p_owner;
   delete from public.howhouse_feedback_operations where owner_id=p_owner;
   delete from public.howhouse_trial_answers where owner_id=p_owner;
   delete from public.howhouse_trial_calls where owner_id=p_owner;
   delete from public.howhouse_release_users where owner_id=p_owner;
   update public.howhouse_deletion_jobs set state='data-deleted' where operation_id=op;
   return jsonb_build_object('ok',true,'data',jsonb_build_object('state','data-deleted','owner',p_owner));
 end if;
 return jsonb_build_object('ok',false,'code','invalid-input');
exception when invalid_text_representation then return jsonb_build_object('ok',false,'code','invalid-input');
end;
$$;
revoke all on function public.howhouse_release_data(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.howhouse_release_data(uuid,text,jsonb) to service_role;

create or replace function public.howhouse_release_cleanup()
returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.howhouse_feedback_purge();
 delete from public.howhouse_trial_answers where expires_at<=now();
 delete from public.howhouse_trial_calls where created_at<now()-interval '30 days';
 delete from public.howhouse_deletion_jobs where expires_at<=now() and state in ('completed','cancelled');
 -- Inactive anonymous accounts are queued; the server verifies Auth and uses Auth Admin deletion.
 insert into public.howhouse_deletion_jobs(operation_id,proof_hash,owner_id,state)
 select gen_random_uuid(),encode(sha256(convert_to(gen_random_uuid()::text||gen_random_uuid()::text,'UTF8')),'hex'),u.id,'pending'
 from auth.users u left join public.howhouse_release_users r on r.owner_id=u.id
 where u.is_anonymous and u.created_at is not null
   and greatest(u.created_at,coalesce(u.last_sign_in_at,u.created_at),coalesce(r.last_seen,u.created_at))<now()-interval '90 days'
   and not exists(select 1 from public.howhouse_deletion_jobs j where j.owner_id=u.id and j.state in ('pending','data-deleted'))
 limit 100;
end;
$$;
revoke all on function public.howhouse_release_cleanup() from public,anon,authenticated;
grant execute on function public.howhouse_release_cleanup() to service_role;
-- Cron scheduling and the authenticated cleanup worker are activated separately, after review.
commit;
