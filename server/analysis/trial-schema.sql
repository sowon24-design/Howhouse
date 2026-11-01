-- Review and execute once in the owner's Supabase project. No OpenAI key belongs here.
-- No call-count quota: non-release app trial chosen by the owner on 2026-11-01.
begin;
create table if not exists public.howhouse_trial_calls (
  request_id uuid primary key,
  owner_id uuid not null references auth.users(id),
  state text not null check (state in ('reserved', 'completed', 'failed', 'cancelled')),
  usage jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.howhouse_trial_answers (
  owner_id uuid not null references auth.users(id),
  input_key text not null check (input_key ~ '^[a-f0-9]{64}$'),
  encrypted_value jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  primary key (owner_id, input_key)
);
alter table public.howhouse_trial_calls enable row level security;
alter table public.howhouse_trial_answers enable row level security;
revoke all on public.howhouse_trial_calls, public.howhouse_trial_answers from public, anon, authenticated;
grant select, insert, update on public.howhouse_trial_calls to service_role;
grant select, insert, update, delete on public.howhouse_trial_answers to service_role;

create or replace function public.howhouse_trial_put_answer(p_owner uuid, p_key text, p_value jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  -- Serialize only this owner's cache trimming, including future multiple server instances.
  perform pg_advisory_xact_lock(hashtextextended(p_owner::text, 0));
  delete from public.howhouse_trial_answers where owner_id = p_owner and expires_at <= now();
  insert into public.howhouse_trial_answers(owner_id, input_key, encrypted_value)
  values (p_owner, p_key, p_value)
  on conflict(owner_id, input_key) do update set encrypted_value = excluded.encrypted_value,
    created_at = now(), expires_at = now() + interval '7 days';
  delete from public.howhouse_trial_answers where owner_id = p_owner and input_key in (
    select input_key from public.howhouse_trial_answers where owner_id = p_owner
    order by created_at desc, input_key offset 100
  );
end;
$$;
revoke all on function public.howhouse_trial_put_answer(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.howhouse_trial_put_answer(uuid, text, jsonb) to service_role;
commit;
