-- Table emotion_tracks pour stocker les pistes musicales émotionnelles
create table if not exists public.emotion_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text unique,
  title text,
  emotion_label text,
  storage_path text,
  duration_seconds int,
  source text default 'suno',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- RLS policies
alter table public.emotion_tracks enable row level security;

create policy "Users can read own emotion tracks"
  on public.emotion_tracks for select
  using (auth.uid() = user_id);

create policy "Users can insert own emotion tracks"
  on public.emotion_tracks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own emotion tracks"
  on public.emotion_tracks for update
  using (auth.uid() = user_id);

create policy "Users can delete own emotion tracks"
  on public.emotion_tracks for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_emotion_tracks_user on public.emotion_tracks(user_id);
create index if not exists idx_emotion_tracks_task on public.emotion_tracks(task_id);
create index if not exists idx_emotion_tracks_created on public.emotion_tracks(created_at desc);

-- Amélioration de suno_callbacks
create index if not exists idx_suno_cb_created on public.suno_callbacks(created_at desc);

comment on table public.emotion_tracks is 'Stores user emotional music tracks with private storage paths';
comment on column public.emotion_tracks.storage_path is 'Path in parcours-tracks bucket: runs/emotion/{task_id}.mp3';
comment on column public.emotion_tracks.metadata is 'Stores prompt, model, style, and timing information';