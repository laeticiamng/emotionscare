-- migrate:up
create extension if not exists "pgcrypto";

create table if not exists public.emotion_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  mood_score int,
  created_at timestamptz not null default now()
);

create index if not exists idx_emotion_scans_user_id on public.emotion_scans(user_id);
create index if not exists idx_emotion_scans_created_at on public.emotion_scans(created_at desc);

alter table public.emotion_scans enable row level security;

drop policy if exists "emotion_scans_select_own" on public.emotion_scans;
create policy "emotion_scans_select_own"
  on public.emotion_scans for select using (auth.uid() = user_id);

drop policy if exists "emotion_scans_ins_upd_del_own" on public.emotion_scans;
create policy "emotion_scans_ins_upd_del_own"
  on public.emotion_scans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.mood_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sliders jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_mood_presets_user_id on public.mood_presets(user_id);
create index if not exists idx_mood_presets_created_at on public.mood_presets(created_at desc);

alter table public.mood_presets enable row level security;

drop policy if exists "mood_presets_select_own" on public.mood_presets;
create policy "mood_presets_select_own"
  on public.mood_presets for select using (auth.uid() = user_id);

drop policy if exists "mood_presets_ins_upd_del_own" on public.mood_presets;
create policy "mood_presets_ins_upd_del_own"
  on public.mood_presets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  duration_sec int default 0,
  mood_delta int,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_created_at on public.sessions(created_at desc);
create index if not exists idx_sessions_type on public.sessions(type);

alter table public.sessions enable row level security;

drop policy if exists "sessions_select_own" on public.sessions;
create policy "sessions_select_own"
  on public.sessions for select using (auth.uid() = user_id);

drop policy if exists "sessions_ins_upd_del_own" on public.sessions;
create policy "sessions_ins_upd_del_own"
  on public.sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- migrate:down
drop table if exists public.sessions cascade;
drop table if exists public.mood_presets cascade;
drop table if exists public.emotion_scans cascade;
