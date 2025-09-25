-- Migration pour les tables music_favorites et music_recent
-- music_favorites : stockage des pistes favorites par utilisateur
create table if not exists public.music_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, track_id)
);

-- Index pour optimiser les requêtes
create index if not exists idx_music_favorites_user on public.music_favorites(user_id);
create index if not exists idx_music_favorites_created on public.music_favorites(created_at desc);

-- RLS pour music_favorites
alter table public.music_favorites enable row level security;

drop policy if exists "music_fav_select_own" on public.music_favorites;
create policy "music_fav_select_own"
  on public.music_favorites for select using (auth.uid() = user_id);

drop policy if exists "music_fav_all_own" on public.music_favorites;
create policy "music_fav_all_own"
  on public.music_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- music_recent : stockage de la dernière piste écoutée et position
create table if not exists public.music_recent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  position_sec int not null default 0,
  meta jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Contrainte unique : un seul enregistrement "recent" par utilisateur
create unique index if not exists uniq_music_recent_user on public.music_recent(user_id);

-- RLS pour music_recent
alter table public.music_recent enable row level security;

drop policy if exists "music_recent_select_own" on public.music_recent;
create policy "music_recent_select_own"
  on public.music_recent for select using (auth.uid() = user_id);

drop policy if exists "music_recent_all_own" on public.music_recent;
create policy "music_recent_all_own"
  on public.music_recent for all using (auth.uid() = user_id) with check (auth.uid() = user_id);