-- migrate:up
create table if not exists public.coach_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id text not null,
  summary_text text not null check (char_length(summary_text) <= 280),
  mode text not null check (mode in ('b2c', 'b2b')),
  created_at timestamptz not null default now()
);

create index if not exists idx_coach_logs_user_created_at on public.coach_logs(user_id, created_at desc);
create index if not exists idx_coach_logs_thread on public.coach_logs(thread_id);

alter table public.coach_logs enable row level security;

drop policy if exists "coach_logs_select_own" on public.coach_logs;
create policy "coach_logs_select_own" on public.coach_logs
  for select
  using (auth.uid() = user_id);

drop policy if exists "coach_logs_modify_own" on public.coach_logs;
create policy "coach_logs_modify_own" on public.coach_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- migrate:down
drop table if exists public.coach_logs cascade;
