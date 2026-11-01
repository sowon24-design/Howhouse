-- NOT APPLIED. Owner approved one year (365 days) on 2026-11-01. Apply after schema/job review.
-- Supabase Cron must be enabled first. No extension/account/security settings are changed here.
-- Refuse to replace an existing same-name job silently.
begin;
do $$
declare v_days integer := 365; -- Owner-approved feedback retention; separate from the 7-day answer cache.
begin
  if v_days is null or v_days<1 or v_days>3650 then raise exception 'Choose the reviewed feedback retention period first'; end if;
  if exists(select 1 from cron.job where jobname='howhouse-feedback-expiry') then
    raise exception 'Review the existing howhouse-feedback-expiry job before changing it';
  end if;
  perform cron.schedule('howhouse-feedback-expiry','0 * * * *','select public.howhouse_feedback_purge();');
  insert into public.howhouse_feedback_policy(singleton,retention_days,cleanup_enabled) values(true,v_days,true)
  on conflict(singleton) do update set retention_days=excluded.retention_days,cleanup_enabled=true;
end $$;
commit;
