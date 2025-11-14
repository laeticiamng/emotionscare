-- Migration pour système de badges musicaux

-- Table pour les badges utilisateurs
create table if not exists public.user_music_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now(),
  progress numeric(5,2) default 0, -- Progression vers le badge (0-100)
  is_unlocked boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- Table pour l'historique d'écoute musicale
create table if not exists public.music_listening_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  music_generation_id uuid references public.music_generations(id) on delete set null,
  track_title text not null,
  duration_seconds integer,
  listened_seconds integer,
  completion_percentage numeric(5,2),
  emotion text,
  mood text,
  session_id uuid,
  created_at timestamptz default now()
);

-- Index pour performance
create index if not exists idx_user_music_badges_user_id on public.user_music_badges(user_id);
create index if not exists idx_user_music_badges_badge_id on public.user_music_badges(badge_id);
create index if not exists idx_music_listening_history_user_id on public.music_listening_history(user_id);
create index if not exists idx_music_listening_history_created_at on public.music_listening_history(created_at);

-- RLS policies
alter table public.user_music_badges enable row level security;
alter table public.music_listening_history enable row level security;

-- Policies pour user_music_badges
create policy "Users can view their own badges"
  on public.user_music_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert their own badges"
  on public.user_music_badges for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own badges"
  on public.user_music_badges for update
  using (auth.uid() = user_id);

-- Policies pour music_listening_history
create policy "Users can view their own listening history"
  on public.music_listening_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own listening history"
  on public.music_listening_history for insert
  with check (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
create or replace function update_user_music_badges_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_music_badges_updated_at
  before update on public.user_music_badges
  for each row
  execute function update_user_music_badges_updated_at();

-- Vue pour statistiques d'écoute par utilisateur
create or replace view public.user_music_stats as
select
  user_id,
  count(*) as total_listens,
  sum(listened_seconds) as total_seconds,
  avg(completion_percentage) as avg_completion,
  count(distinct date_trunc('day', created_at)) as days_listened,
  max(created_at) as last_listened_at
from public.music_listening_history
group by user_id;

-- Accès à la vue avec RLS
alter view public.user_music_stats set (security_invoker = true);
