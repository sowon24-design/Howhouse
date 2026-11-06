-- Approved product choice: 5 fresh model attempts per temporary user per Korean calendar day.
-- OpenAI project hard spend limit ($10/month) is configured separately; this SQL is not a dollar meter.
begin;
create table if not exists public.howhouse_analysis_policy (
  singleton boolean primary key default true check (singleton),
  new_calls_enabled boolean not null,
  daily_user_calls integer not null check (daily_user_calls between 1 and 100),
  max_concurrent_calls integer not null check (max_concurrent_calls between 1 and 100)
);
alter table public.howhouse_analysis_policy enable row level security;
revoke all on public.howhouse_analysis_policy from public, anon, authenticated;
grant select, update on public.howhouse_analysis_policy to service_role;
-- Do not overwrite an already configured operational policy on repeated application.
insert into public.howhouse_analysis_policy values (true,true,5,3) on conflict do nothing;
create index if not exists howhouse_trial_calls_owner_created on public.howhouse_trial_calls(owner_id,created_at);
create index if not exists howhouse_trial_calls_reserved_created on public.howhouse_trial_calls(created_at) where state='reserved';

create or replace function public.howhouse_reserve_analysis(p_owner uuid,p_request uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  policy public.howhouse_analysis_policy%rowtype;
  reservation_time timestamptz;
  day_start timestamptz;
begin
  if p_owner is null or p_request is null or not exists(select 1 from auth.users where id=p_owner) then
    return jsonb_build_object('ok',false,'code','invalid-input');
  end if;
  -- One shared transaction lock protects count+insert across all users and server instances.
  perform pg_advisory_xact_lock(hashtextextended('howhouse-analysis-reservation-v1',0));
  reservation_time:=clock_timestamp();
  select * into policy from public.howhouse_analysis_policy where singleton=true for share;
  if not found then return jsonb_build_object('ok',false,'code','policy-unavailable'); end if;
  if not policy.new_calls_enabled then return jsonb_build_object('ok',false,'code','budget-limit'); end if;
  if exists(select 1 from public.howhouse_trial_calls where request_id=p_request) then
    return jsonb_build_object('ok',false,'code','invalid-input');
  end if;
  day_start:=date_trunc('day',reservation_time at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
  if (select count(*) from public.howhouse_trial_calls where owner_id=p_owner and created_at>=day_start and created_at<day_start+interval '1 day')>=policy.daily_user_calls then
    return jsonb_build_object('ok',false,'code','budget-limit');
  end if;
  -- Analysis has a 90s deadline. A 120s lease allows transport overhead and recovers after crashes.
  -- This bounds reservations; aborting a provider request cannot guarantee that billing stops.
  if (select count(*) from public.howhouse_trial_calls where state='reserved' and created_at>reservation_time-interval '120 seconds')>=policy.max_concurrent_calls then
    return jsonb_build_object('ok',false,'code','server-busy');
  end if;
  insert into public.howhouse_trial_calls(request_id,owner_id,state,created_at) values(p_request,p_owner,'reserved',reservation_time);
  return jsonb_build_object('ok',true);
end;
$$;
revoke all on function public.howhouse_reserve_analysis(uuid,uuid) from public,anon,authenticated;
grant execute on function public.howhouse_reserve_analysis(uuid,uuid) to service_role;
commit;
