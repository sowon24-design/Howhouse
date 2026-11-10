-- v5 consent evidence: metadata inspection only. No users, tokens or event rows are read.
-- Execute in the intended project's SQL editor. Do not execute migration SQL in this step.
begin transaction read only;

select current_database() as database_name, now() as checked_at;

with expected(name) as (values
 ('howhouse_release_users'),('howhouse_legacy_consent_states'),
 ('howhouse_consent_documents'),('howhouse_consent_events'))
select e.name, c.oid is not null as exists, c.relrowsecurity as rls_enabled,
 case when c.oid is null then null else has_table_privilege('anon',c.oid,'SELECT') end as anon_can_select,
 case when c.oid is null then null else has_table_privilege('authenticated',c.oid,'SELECT') end as app_can_select,
 case when c.oid is null then null else has_table_privilege('service_role',c.oid,'SELECT') end as server_can_select,
 case when c.oid is null then null else has_table_privilege('service_role',c.oid,'UPDATE') end as server_can_update
from expected e left join pg_namespace n on n.nspname='public'
left join pg_class c on c.relnamespace=n.oid and c.relname=e.name and c.relkind='r'
order by e.name;

with expected(name) as (values
 ('processing_accepted'),('processing_consent_version'),('processing_consent_at'),
 ('overseas_accepted'),('overseas_consent_version'),('overseas_consent_at'))
select e.name, exists(select 1 from information_schema.columns c
 where c.table_schema='public' and c.table_name='howhouse_release_users' and c.column_name=e.name) as exists
from expected e order by e.name;

with expected(signature) as (values
 ('public.howhouse_record_consent(uuid,text,boolean,boolean,boolean,text,text,text)'),
 ('public.howhouse_consent_evidence_state(uuid,text,text[])')),
found as (select signature,to_regprocedure(signature)::oid as oid from expected)
select signature,oid is not null as exists,
 case when oid is null then null else has_function_privilege('anon',oid,'EXECUTE') end as anon_can_execute,
 case when oid is null then null else has_function_privilege('authenticated',oid,'EXECUTE') end as app_can_execute,
 case when oid is null then null else has_function_privilege('service_role',oid,'EXECUTE') end as server_can_execute
from found;

-- Shape alone does not prove the deployed function body matches main.
-- These markers detect the receipt and explicit-choice contracts without returning function source.
select p.proname,
 position('eventId' in pg_get_functiondef(p.oid))>0 as returns_event_id,
 position('processingAccepted' in pg_get_functiondef(p.oid))>0 as forwards_processing_choice,
 position('overseasAccepted' in pg_get_functiondef(p.oid))>0 as forwards_overseas_choice
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='howhouse_record_consent';

commit;
