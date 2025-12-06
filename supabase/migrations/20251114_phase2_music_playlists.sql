-- Phase 2: Tables pour système de musique enrichi

-- Table pour l'historique des générations musicales
create table if not exists public.music_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  style text not null,
  prompt text,
  model text not null default 'chirp-v3',
  audio_url text,
  audio_id text,
  duration_seconds integer,
  instrumental boolean default false,
  vocal_gender text,
  style_weight numeric(3,2),
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Table pour les playlists personnalisées
create table if not exists public.music_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default false,
  cover_image_url text,
  tags text[] default array[]::text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table pour les morceaux dans les playlists
create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references public.music_playlists(id) on delete cascade not null,
  music_generation_id uuid references public.music_generations(id) on delete cascade,
  external_track_id text, -- Pour musiques externes
  position integer not null,
  added_at timestamptz default now()
);

-- Table pour les musiques favorites
create table if not exists public.music_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  music_generation_id uuid references public.music_generations(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, music_generation_id)
);

-- Table pour le partage de musiques
create table if not exists public.music_shares (
  id uuid primary key default gen_random_uuid(),
  music_generation_id uuid references public.music_generations(id) on delete cascade not null,
  shared_by uuid references auth.users(id) on delete cascade not null,
  shared_with uuid references auth.users(id) on delete cascade,
  is_public boolean default false,
  share_token text unique,
  message text,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Indexes pour performance
create index if not exists idx_music_generations_user_id on public.music_generations(user_id);
create index if not exists idx_music_generations_status on public.music_generations(status);
create index if not exists idx_music_playlists_user_id on public.music_playlists(user_id);
create index if not exists idx_playlist_tracks_playlist_id on public.playlist_tracks(playlist_id);
create index if not exists idx_music_favorites_user_id on public.music_favorites(user_id);
create index if not exists idx_music_shares_shared_by on public.music_shares(shared_by);
create index if not exists idx_music_shares_shared_with on public.music_shares(shared_with);

-- RLS policies
alter table public.music_generations enable row level security;
alter table public.music_playlists enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.music_favorites enable row level security;
alter table public.music_shares enable row level security;

-- Policies pour music_generations
create policy "Users can view their own music generations"
  on public.music_generations for select
  using (auth.uid() = user_id);

create policy "Users can create their own music generations"
  on public.music_generations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own music generations"
  on public.music_generations for update
  using (auth.uid() = user_id);

-- Policies pour music_playlists
create policy "Users can view their own playlists and public playlists"
  on public.music_playlists for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can create their own playlists"
  on public.music_playlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own playlists"
  on public.music_playlists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own playlists"
  on public.music_playlists for delete
  using (auth.uid() = user_id);

-- Policies pour playlist_tracks
create policy "Users can view tracks in their playlists or public playlists"
  on public.playlist_tracks for select
  using (
    exists (
      select 1 from public.music_playlists
      where id = playlist_id
      and (user_id = auth.uid() or is_public = true)
    )
  );

create policy "Users can add tracks to their own playlists"
  on public.playlist_tracks for insert
  with check (
    exists (
      select 1 from public.music_playlists
      where id = playlist_id and user_id = auth.uid()
    )
  );

create policy "Users can remove tracks from their own playlists"
  on public.playlist_tracks for delete
  using (
    exists (
      select 1 from public.music_playlists
      where id = playlist_id and user_id = auth.uid()
    )
  );

-- Policies pour music_favorites
create policy "Users can view their own favorites"
  on public.music_favorites for select
  using (auth.uid() = user_id);

create policy "Users can add to their own favorites"
  on public.music_favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from their own favorites"
  on public.music_favorites for delete
  using (auth.uid() = user_id);

-- Policies pour music_shares
create policy "Users can view shares they created or received"
  on public.music_shares for select
  using (auth.uid() = shared_by or auth.uid() = shared_with or is_public = true);

create policy "Users can create shares for their own music"
  on public.music_shares for insert
  with check (
    auth.uid() = shared_by and
    exists (
      select 1 from public.music_generations
      where id = music_generation_id and user_id = auth.uid()
    )
  );

create policy "Users can delete their own shares"
  on public.music_shares for delete
  using (auth.uid() = shared_by);
