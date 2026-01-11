-- Créer la table global_leaderboard si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.global_leaderboard (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT 'Player',
  avatar_emoji text DEFAULT '✨',
  total_score integer NOT NULL DEFAULT 0,
  weekly_score integer NOT NULL DEFAULT 0,
  streak_days integer DEFAULT 0,
  level integer DEFAULT 1,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Créer la table flash_glow_sessions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.flash_glow_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  mode text NOT NULL DEFAULT 'calm',
  duration_seconds integer NOT NULL DEFAULT 0,
  completion_rate numeric DEFAULT 1.0,
  heart_rate_start numeric,
  heart_rate_end numeric,
  stress_level_before numeric,
  stress_level_after numeric,
  feedback_rating integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.global_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_glow_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques pour global_leaderboard
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'global_leaderboard' AND policyname = 'Anyone can view leaderboard') THEN
    CREATE POLICY "Anyone can view leaderboard" ON public.global_leaderboard FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'global_leaderboard' AND policyname = 'Users can manage their entry') THEN
    CREATE POLICY "Users can manage their entry" ON public.global_leaderboard FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques pour flash_glow_sessions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'flash_glow_sessions' AND policyname = 'Users can view their own flash glow sessions') THEN
    CREATE POLICY "Users can view their own flash glow sessions" ON public.flash_glow_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'flash_glow_sessions' AND policyname = 'Users can create their own flash glow sessions') THEN
    CREATE POLICY "Users can create their own flash glow sessions" ON public.flash_glow_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_global_leaderboard_score ON public.global_leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_flash_glow_sessions_user ON public.flash_glow_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flash_glow_sessions_date ON public.flash_glow_sessions(created_at DESC);