-- Migration: Create mood_presets table for Mood Mixer presets management
-- Provides CRUD-ready structure with RLS policies

create table if not exists public.mood_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text,
  name text not null,
  description text,
  icon text,
  gradient text,
  tags text[] not null default array[]::text[],
  softness smallint not null default 50 check (softness between 0 and 100),
  clarity smallint not null default 50 check (clarity between 0 and 100),
  blend jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists mood_presets_user_slug_unique
  on public.mood_presets (coalesce(user_id::text, 'global'), slug)
  where slug is not null;

create index if not exists idx_mood_presets_user_created_at
  on public.mood_presets (user_id, created_at desc);

alter table public.mood_presets enable row level security;

create policy "Users can read mood presets"
  on public.mood_presets
  for select
  using (user_id is null or auth.uid() = user_id);

create policy "Users can insert their mood presets"
  on public.mood_presets
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their mood presets"
  on public.mood_presets
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their mood presets"
  on public.mood_presets
  for delete
  using (auth.uid() = user_id);

create trigger set_mood_presets_updated_at
  before update on public.mood_presets
  for each row
  execute function public.update_updated_at_column();
