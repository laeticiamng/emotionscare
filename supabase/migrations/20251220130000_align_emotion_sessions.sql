-- migrate:up
-- Align emotion_sessions schema with CTO spec
alter table public.emotion_sessions
  rename column input_text to raw_input;

alter table public.emotion_sessions
  drop column if exists ai_summary,
  drop column if exists ai_actions,
  drop column if exists music_prompt,
  drop column if exists light_recommendation,
  drop column if exists emotion;

alter table public.emotion_sessions
  add column if not exists input_type text not null default 'text' check (input_type in ('text', 'voice', 'choice', 'scan')),
  add column if not exists voice_file_url text,
  add column if not exists detected_emotions jsonb not null default '[]',
  add column if not exists primary_emotion text,
  add column if not exists valence decimal(3,2) check (valence between -1 and 1),
  add column if not exists arousal decimal(3,2) check (arousal between 0 and 1),
  add column if not exists context_tags text[] default '{}',
  add column if not exists location text,
  add column if not exists time_of_day text,
  add column if not exists ai_model_version text,
  add column if not exists processing_time_ms integer;

alter table public.emotion_sessions
  alter column intensity drop not null,
  alter column intensity type decimal(3,2)
  using (case when intensity is null then null else (intensity::decimal / 10) end);

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.emotion_sessions'::regclass
      and contype = 'c'
      and conname like '%intensity%'
  loop
    execute format('alter table public.emotion_sessions drop constraint %I', constraint_name);
  end loop;
end $$;

-- intensity is normalized from frontend 1–10 scale to 0.1–1.0
alter table public.emotion_sessions
  add constraint emotion_sessions_intensity_check
  check (intensity is null or (intensity between 0.1 and 1));

create index if not exists idx_emotion_sessions_user_date
  on public.emotion_sessions(user_id, created_at desc);

-- emotion_plans table per CTO spec
create table if not exists public.emotion_plans (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.emotion_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('immediate', 'daily', 'weekly')),
  recommendations jsonb not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped')),
  completion_rate decimal(3,2) default 0,
  user_feedback integer check (user_feedback between 1 and 5),
  feedback_note text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.emotion_plans enable row level security;

drop policy if exists "emotion_plans_select_own" on public.emotion_plans;
create policy "emotion_plans_select_own"
  on public.emotion_plans for select
  using (auth.uid() = user_id);

drop policy if exists "emotion_plans_all_own" on public.emotion_plans;
create policy "emotion_plans_all_own"
  on public.emotion_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional compatibility: expose music_queue view for spec naming
-- NOTE: After applying this migration, regenerate Supabase TypeScript types to include `suno_request_id`:
--   supabase gen types typescript --project-id <project-id> > src/integrations/supabase/types.ts
alter table public.music_generation_queue
  add column if not exists suno_request_id text;

create or replace view public.music_queue as
  select
    id,
    user_id,
    suno_request_id,
    status,
    created_at,
    completed_at
  from public.music_generation_queue;

-- migrate:down
-- No automated downgrade for schema alignment
