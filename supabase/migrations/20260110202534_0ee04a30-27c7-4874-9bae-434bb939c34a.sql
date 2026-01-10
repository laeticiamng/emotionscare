-- ================================================================
-- CRÉATION DES TABLES MANQUANTES POUR PERSISTANCE COMPLÈTE
-- ================================================================

-- 1. Table boss_grit_quests (pour useBossGritPersistence)
CREATE TABLE IF NOT EXISTS public.boss_grit_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_title TEXT NOT NULL,
  quest_description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  xp_earned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  elapsed_seconds INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_boss_grit_quests_user_id ON public.boss_grit_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_grit_quests_created_at ON public.boss_grit_quests(created_at DESC);

-- RLS
ALTER TABLE public.boss_grit_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own boss grit quests"
  ON public.boss_grit_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boss grit quests"
  ON public.boss_grit_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boss grit quests"
  ON public.boss_grit_quests FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. Table mood_mixer_sessions (pour useMoodMixerPersistence)
CREATE TABLE IF NOT EXISTS public.mood_mixer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preset_id TEXT,
  preset_name TEXT,
  components JSONB NOT NULL DEFAULT '{}',
  duration_seconds INTEGER DEFAULT 0,
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_mood_mixer_sessions_user_id ON public.mood_mixer_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_mixer_sessions_created_at ON public.mood_mixer_sessions(created_at DESC);

-- RLS
ALTER TABLE public.mood_mixer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood mixer sessions"
  ON public.mood_mixer_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood mixer sessions"
  ON public.mood_mixer_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Table bubble_beat_sessions (pour BubbleBeatPage)
CREATE TABLE IF NOT EXISTS public.bubble_beat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_mode TEXT NOT NULL DEFAULT 'relax',
  score INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  average_heart_rate NUMERIC(5,2),
  target_heart_rate INTEGER,
  difficulty INTEGER DEFAULT 3,
  biometrics JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_bubble_beat_sessions_user_id ON public.bubble_beat_sessions(user_id);

-- RLS
ALTER TABLE public.bubble_beat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bubble beat sessions"
  ON public.bubble_beat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bubble beat sessions"
  ON public.bubble_beat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Table user_badges (système de badges)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  badge_rarity TEXT DEFAULT 'common',
  xp_earned INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Table leaderboard_entries (classement global)
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  weekly_xp INTEGER DEFAULT 0,
  monthly_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  rank INTEGER,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Index pour classement
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_xp ON public.leaderboard_entries(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_xp ON public.leaderboard_entries(weekly_xp DESC);

-- RLS - Lecture publique pour le leaderboard
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard_entries FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own leaderboard entry"
  ON public.leaderboard_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leaderboard entry"
  ON public.leaderboard_entries FOR UPDATE
  USING (auth.uid() = user_id);