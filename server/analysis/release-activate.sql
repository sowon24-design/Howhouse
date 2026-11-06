-- Activation is a separate reviewed operation; existing feedback cron is preserved.
begin;
do $$
declare existing record;
begin
 if not exists(select 1 from pg_extension where extname='pg_cron') then raise exception 'pg_cron must be reviewed and enabled first'; end if;
 select * into existing from cron.job where jobname='howhouse-release-cleanup';
 if found then
   if existing.schedule<>'0 * * * *' or existing.command<>'select public.howhouse_release_cleanup();' or not existing.active then
     raise exception 'Existing release cleanup job needs manual review';
   end if;
 else
   perform cron.schedule('howhouse-release-cleanup','0 * * * *','select public.howhouse_release_cleanup();');
 end if;
end;
$$;
commit;
