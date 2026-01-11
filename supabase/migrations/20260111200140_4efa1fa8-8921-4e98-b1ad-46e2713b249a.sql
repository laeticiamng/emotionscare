-- Tables manquantes (sans INSERT)

-- 1. Table boss_grit_sessions
CREATE TABLE IF NOT EXISTS public.boss_grit_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quest_title TEXT NOT NULL,
  quest_description TEXT,
  difficulty TEXT DEFAULT 'modérée',
  xp_earned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  elapsed_seconds INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_grit_sessions_user_id ON public.boss_grit_sessions(user_id);

ALTER TABLE public.boss_grit_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "boss_grit_select" ON public.boss_grit_sessions FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "boss_grit_insert" ON public.boss_grit_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "boss_grit_update" ON public.boss_grit_sessions FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Table daily_challenge_progress
CREATE TABLE IF NOT EXISTS public.daily_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  xp_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dcp_user ON public.daily_challenge_progress(user_id, challenge_id);

ALTER TABLE public.daily_challenge_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "dcp_select" ON public.daily_challenge_progress FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "dcp_insert" ON public.daily_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "dcp_update" ON public.daily_challenge_progress FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Table user_stats_consolidated
CREATE TABLE IF NOT EXISTS public.user_stats_consolidated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  flash_glow_sessions INTEGER DEFAULT 0,
  bubble_beat_sessions INTEGER DEFAULT 0,
  mood_mixer_sessions INTEGER DEFAULT 0,
  story_synth_sessions INTEGER DEFAULT 0,
  boss_grit_sessions INTEGER DEFAULT 0,
  breathwork_sessions INTEGER DEFAULT 0,
  meditation_sessions INTEGER DEFAULT 0,
  journal_entries INTEGER DEFAULT 0,
  favorite_module TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_stats_consolidated ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "usc_select" ON public.user_stats_consolidated FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "usc_insert" ON public.user_stats_consolidated FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "usc_update" ON public.user_stats_consolidated FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Colonnes manquantes pour global_leaderboard
ALTER TABLE public.global_leaderboard 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badges_count INTEGER DEFAULT 0;