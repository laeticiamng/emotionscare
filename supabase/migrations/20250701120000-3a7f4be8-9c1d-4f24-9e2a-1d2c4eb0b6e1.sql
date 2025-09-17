-- Migration: Create mood_presets table for Mood Mixer presets management
-- Provides CRUD-ready structure with RLS policies

create table if not exists public.mood_presets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  gradient text,
  joy numeric(4,3) not null default 0.500,
  calm numeric(4,3) not null default 0.500,
  energy numeric(4,3) not null default 0.500,
  focus numeric(4,3) not null default 0.500,
  tags text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mood_presets
  add constraint mood_presets_blend_range
  check (
    joy >= 0 and joy <= 1
    and calm >= 0 and calm <= 1
    and energy >= 0 and energy <= 1
    and focus >= 0 and focus <= 1
  );

alter table public.mood_presets enable row level security;

-- Policies: allow read for any authenticated user, full CRUD for authenticated roles
create policy "Authenticated users can read mood presets"
  on public.mood_presets
  for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can manage mood presets"
  on public.mood_presets
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Trigger to keep updated_at in sync
create trigger set_mood_presets_updated_at
  before update on public.mood_presets
  for each row
  execute function public.update_updated_at_column();
