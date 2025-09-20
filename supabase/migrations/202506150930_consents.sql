create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null,
  scope jsonb not null default '{}'::jsonb,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now()
);

create unique index if not exists consents_one_active_per_user
  on public.consents (user_id) where revoked_at is null;

alter table public.consents enable row level security;

create policy "consents_self_select" on public.consents
  for select using (auth.uid() = user_id);

create policy "consents_self_insert" on public.consents
  for insert with check (auth.uid() = user_id);

create policy "consents_self_update" on public.consents
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
