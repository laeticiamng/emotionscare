-- migrate:up
-- EMOTION-SESSION: sessions émotionnelles enrichies avec IA
create table if not exists public.emotion_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input_text text not null,
  emotion text,
  intensity smallint not null check (intensity >= 1 and intensity <= 10),
  ai_summary text,
  ai_actions text[],
  music_prompt text,
  light_recommendation text,
  created_at timestamptz not null default now()
);

create index if not exists idx_emotion_sessions_user_id on public.emotion_sessions(user_id);
create index if not exists idx_emotion_sessions_created_at on public.emotion_sessions(created_at desc);

alter table public.emotion_sessions enable row level security;

drop policy if exists "emotion_sessions_select_own" on public.emotion_sessions;
create policy "emotion_sessions_select_own"
  on public.emotion_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "emotion_sessions_all_own" on public.emotion_sessions;
create policy "emotion_sessions_all_own"
  on public.emotion_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- migrate:down
drop table if exists public.emotion_sessions cascade;
