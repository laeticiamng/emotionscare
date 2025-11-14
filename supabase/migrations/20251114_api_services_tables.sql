-- migrate:up
-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: API Services Tables (Scans, Music, Coach)
-- Created: 2025-11-14
-- Description: Tables pour les nouveaux services API avec RLS policies
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- SCANS API TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- Table: emotion_scans
create table if not exists public.emotion_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scan_type text not null check (scan_type in ('text', 'voice', 'facial', 'emoji')),
  emotions jsonb not null,
  mood_score numeric(3,1),
  raw_data jsonb,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_emotion_scans_user_id on public.emotion_scans (user_id);
create index if not exists idx_emotion_scans_created_at on public.emotion_scans (created_at desc);
create index if not exists idx_emotion_scans_type on public.emotion_scans (scan_type);
create index if not exists idx_emotion_scans_user_created on public.emotion_scans (user_id, created_at desc);

-- RLS Policies
alter table public.emotion_scans enable row level security;
alter table public.emotion_scans force row level security;

create policy "emotion_scans_owner_access" on public.emotion_scans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger for updated_at
create or replace function public.update_emotion_scans_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger emotion_scans_updated_at
  before update on public.emotion_scans
  for each row execute function public.update_emotion_scans_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- MUSIC API TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- Table: music_sessions
create table if not exists public.music_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer,
  mood_before numeric(2,1),
  mood_after numeric(2,1),
  tracks_played integer default 0,
  emotion_context text,
  satisfaction_score numeric(2,1),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: music_playlists (if not exists)
create table if not exists public.music_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  emotion_tag text,
  is_public boolean default false,
  track_count integer default 0,
  tracks jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: music_generated_tracks
create table if not exists public.music_generated_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist text,
  duration_seconds integer,
  source text check (source in ('suno', 'musicgen', 'spotify', 'library')),
  url text,
  emotion_tags text[] default array[]::text[],
  generation_params jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: music_generations (queue)
create table if not exists public.music_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion text not null,
  intensity integer,
  style text,
  duration_seconds integer default 180,
  prompt text,
  model text default 'suno',
  status text default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  progress integer default 0,
  estimated_time integer,
  result_track_id uuid references public.music_generated_tracks(id),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: music_favorites
create table if not exists public.music_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.music_generated_tracks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, track_id)
);

-- Table: music_play_history
create table if not exists public.music_play_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.music_generated_tracks(id) on delete cascade,
  played_at timestamptz not null default now(),
  duration_played integer default 0,
  completed boolean default false,
  created_at timestamptz not null default now()
);

-- Table: music_preferences
create table if not exists public.music_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  favorite_genres text[] default array[]::text[],
  favorite_emotions text[] default array[]::text[],
  preferred_model text default 'suno',
  auto_queue boolean default false,
  default_duration integer default 180,
  volume_preference integer default 70,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for music tables
create index if not exists idx_music_sessions_user_id on public.music_sessions (user_id);
create index if not exists idx_music_sessions_started_at on public.music_sessions (started_at desc);
create index if not exists idx_music_playlists_user_id on public.music_playlists (user_id);
create index if not exists idx_music_generated_tracks_user_id on public.music_generated_tracks (user_id);
create index if not exists idx_music_generations_user_status on public.music_generations (user_id, status);
create index if not exists idx_music_favorites_user_id on public.music_favorites (user_id);
create index if not exists idx_music_play_history_user_id on public.music_play_history (user_id);

-- RLS Policies for music tables
alter table public.music_sessions enable row level security;
alter table public.music_sessions force row level security;
create policy "music_sessions_owner_access" on public.music_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.music_playlists enable row level security;
alter table public.music_playlists force row level security;
create policy "music_playlists_owner_access" on public.music_playlists
  for all using (auth.uid() = user_id or is_public = true)
  with check (auth.uid() = user_id);

alter table public.music_generated_tracks enable row level security;
alter table public.music_generated_tracks force row level security;
create policy "music_generated_tracks_owner_access" on public.music_generated_tracks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.music_generations enable row level security;
alter table public.music_generations force row level security;
create policy "music_generations_owner_access" on public.music_generations
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.music_favorites enable row level security;
alter table public.music_favorites force row level security;
create policy "music_favorites_owner_access" on public.music_favorites
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.music_play_history enable row level security;
alter table public.music_play_history force row level security;
create policy "music_play_history_owner_access" on public.music_play_history
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.music_preferences enable row level security;
alter table public.music_preferences force row level security;
create policy "music_preferences_owner_access" on public.music_preferences
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- COACH API TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- Table: coach_sessions
create table if not exists public.coach_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer,
  topic text,
  emotions_addressed text[] default array[]::text[],
  message_count integer default 0,
  mood_before numeric(2,1),
  mood_after numeric(2,1),
  satisfaction_score numeric(2,1),
  summary text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: coach_messages
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.coach_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  timestamp timestamptz not null default now(),
  emotion_detected text,
  suggestions text[] default array[]::text[],
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Table: coach_programs
create table if not exists public.coach_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_weeks integer not null,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  topics text[] default array[]::text[],
  sessions_count integer default 0,
  is_premium boolean default false,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: coach_enrollments
create table if not exists public.coach_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.coach_programs(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  completed_sessions integer default 0,
  progress_percentage integer default 0,
  current_week integer default 1,
  is_completed boolean default false,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, program_id)
);

-- Table: coach_insights
create table if not exists public.coach_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text check (type in ('pattern', 'recommendation', 'achievement', 'warning')),
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  is_read boolean default false,
  action_items text[] default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: coach_feedback
create table if not exists public.coach_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.coach_sessions(id) on delete cascade,
  message_id uuid references public.coach_messages(id) on delete cascade,
  rating numeric(2,1) not null,
  comment text,
  feedback_type text check (feedback_type in ('helpful', 'not_helpful', 'inaccurate', 'other')),
  created_at timestamptz not null default now()
);

-- Indexes for coach tables
create index if not exists idx_coach_sessions_user_id on public.coach_sessions (user_id);
create index if not exists idx_coach_sessions_started_at on public.coach_sessions (started_at desc);
create index if not exists idx_coach_messages_session_id on public.coach_messages (session_id);
create index if not exists idx_coach_messages_timestamp on public.coach_messages (timestamp);
create index if not exists idx_coach_enrollments_user_id on public.coach_enrollments (user_id);
create index if not exists idx_coach_insights_user_id on public.coach_insights (user_id);
create index if not exists idx_coach_feedback_user_id on public.coach_feedback (user_id);

-- RLS Policies for coach tables
alter table public.coach_sessions enable row level security;
alter table public.coach_sessions force row level security;
create policy "coach_sessions_owner_access" on public.coach_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.coach_messages enable row level security;
alter table public.coach_messages force row level security;
create policy "coach_messages_access" on public.coach_messages
  for all using (
    exists (
      select 1 from public.coach_sessions cs
      where cs.id = coach_messages.session_id
      and cs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.coach_sessions cs
      where cs.id = coach_messages.session_id
      and cs.user_id = auth.uid()
    )
  );

-- Coach programs are public read, admin write
alter table public.coach_programs enable row level security;
create policy "coach_programs_public_read" on public.coach_programs
  for select using (true);
create policy "coach_programs_admin_write" on public.coach_programs
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

alter table public.coach_enrollments enable row level security;
alter table public.coach_enrollments force row level security;
create policy "coach_enrollments_owner_access" on public.coach_enrollments
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.coach_insights enable row level security;
alter table public.coach_insights force row level security;
create policy "coach_insights_owner_access" on public.coach_insights
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.coach_feedback enable row level security;
alter table public.coach_feedback force row level security;
create policy "coach_feedback_owner_access" on public.coach_feedback
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════════════════

comment on table public.emotion_scans is 'Scans émotionnels (text, voice, facial, emoji)';
comment on table public.music_sessions is 'Sessions de musicothérapie';
comment on table public.music_playlists is 'Playlists musicales utilisateur';
comment on table public.music_generated_tracks is 'Tracks générés par IA (Suno/MusicGen)';
comment on table public.music_generations is 'Queue de génération musicale';
comment on table public.coach_sessions is 'Sessions de coaching IA';
comment on table public.coach_messages is 'Messages de coaching (user <-> assistant)';
comment on table public.coach_programs is 'Programmes de coaching disponibles';
comment on table public.coach_enrollments is 'Inscriptions aux programmes de coaching';
comment on table public.coach_insights is 'Insights et recommandations personnalisés';

-- migrate:down
-- ═══════════════════════════════════════════════════════════════════════════
-- ROLLBACK: Drop all tables and policies
-- ═══════════════════════════════════════════════════════════════════════════

drop table if exists public.coach_feedback cascade;
drop table if exists public.coach_insights cascade;
drop table if exists public.coach_enrollments cascade;
drop table if exists public.coach_programs cascade;
drop table if exists public.coach_messages cascade;
drop table if exists public.coach_sessions cascade;

drop table if exists public.music_preferences cascade;
drop table if exists public.music_play_history cascade;
drop table if exists public.music_favorites cascade;
drop table if exists public.music_generations cascade;
drop table if exists public.music_generated_tracks cascade;
drop table if exists public.music_playlists cascade;
drop table if exists public.music_sessions cascade;

drop table if exists public.emotion_scans cascade;

drop function if exists public.update_emotion_scans_updated_at() cascade;
