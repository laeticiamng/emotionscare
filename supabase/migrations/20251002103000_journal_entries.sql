-- migrate:up
-- JOURNAL-01: journal entries table with strict owner RLS
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_journal_entries_created_at on public.journal_entries(created_at desc);
create index if not exists idx_journal_entries_tags on public.journal_entries using gin (tags);

alter table public.journal_entries enable row level security;

drop policy if exists "journal_select_own" on public.journal_entries;
create policy "journal_select_own"
  on public.journal_entries for select
  using (auth.uid() = user_id);

drop policy if exists "journal_all_own" on public.journal_entries;
create policy "journal_all_own"
  on public.journal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- migrate:down
drop table if exists public.journal_entries cascade;
