-- Gamification System Tables

-- Table des achievements/badges disponibles
CREATE TABLE IF NOT EXISTS public.music_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'usage', 'streak', 'generation', 'therapy', 'social'
  tier TEXT NOT NULL DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'count', 'streak', 'duration', 'quality'
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des badges débloqués par utilisateur
CREATE TABLE IF NOT EXISTS public.user_music_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.music_achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Table des niveaux utilisateur
CREATE TABLE IF NOT EXISTS public.user_music_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  total_tracks_generated INTEGER NOT NULL DEFAULT 0,
  total_listening_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des récompenses débloquées
CREATE TABLE IF NOT EXISTS public.user_music_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_type TEXT NOT NULL, -- 'feature', 'style', 'premium_generation', 'custom_prompt'
  reward_code TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  times_used INTEGER DEFAULT 0,
  UNIQUE(user_id, reward_code)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_music_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_levels_user ON public.user_music_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user ON public.user_music_rewards(user_id);

-- RLS Policies
ALTER TABLE public.music_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_music_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_music_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_music_rewards ENABLE ROW LEVEL SECURITY;

-- Les achievements sont visibles par tous
CREATE POLICY "Achievements are viewable by everyone"
  ON public.music_achievements FOR SELECT
  USING (true);

-- Les utilisateurs voient leurs propres achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_music_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_music_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.user_music_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs gèrent leur niveau
CREATE POLICY "Users can view own level"
  ON public.user_music_levels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own level"
  ON public.user_music_levels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own level"
  ON public.user_music_levels FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs gèrent leurs récompenses
CREATE POLICY "Users can view own rewards"
  ON public.user_music_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON public.user_music_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_user_level_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_music_levels_updated_at
  BEFORE UPDATE ON public.user_music_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level_timestamp();

-- Insert des achievements par défaut
INSERT INTO public.music_achievements (code, name, description, category, tier, icon, requirement_type, requirement_value, xp_reward) VALUES
  -- Usage achievements
  ('first_session', 'Première Session', 'Complétez votre première session musicale', 'usage', 'bronze', '🎵', 'count', 1, 10),
  ('session_10', 'Amateur de Musique', '10 sessions thérapeutiques complétées', 'usage', 'bronze', '🎼', 'count', 10, 50),
  ('session_50', 'Mélomane Assidu', '50 sessions thérapeutiques complétées', 'usage', 'silver', '🎹', 'count', 50, 150),
  ('session_100', 'Maître Musical', '100 sessions thérapeutiques complétées', 'usage', 'gold', '🎺', 'count', 100, 300),
  
  -- Generation achievements
  ('first_generation', 'Créateur Débutant', 'Générez votre première musique IA', 'generation', 'bronze', '✨', 'count', 1, 15),
  ('generation_25', 'Compositeur Émergent', '25 musiques générées', 'generation', 'silver', '🎨', 'count', 25, 100),
  ('generation_100', 'Virtuose IA', '100 musiques générées', 'generation', 'gold', '🌟', 'count', 100, 400),
  
  -- Streak achievements
  ('streak_7', 'Semaine Constante', '7 jours d''activité consécutifs', 'streak', 'bronze', '🔥', 'streak', 7, 75),
  ('streak_30', 'Mois Dévoué', '30 jours d''activité consécutifs', 'streak', 'silver', '⚡', 'streak', 30, 200),
  ('streak_100', 'Engagement Légendaire', '100 jours d''activité consécutifs', 'streak', 'gold', '👑', 'streak', 100, 500),
  
  -- Therapy achievements
  ('therapy_mood_improve', 'Amélioration Émotionnelle', 'Améliorez votre humeur via la musique', 'therapy', 'silver', '💚', 'count', 1, 100),
  ('listening_60min', 'Auditeur Passionné', '60 minutes d''écoute thérapeutique', 'therapy', 'bronze', '⏱️', 'duration', 60, 50),
  ('listening_10h', 'Explorateur Sonore', '10 heures d''écoute cumulées', 'therapy', 'gold', '🎧', 'duration', 600, 250)
ON CONFLICT (code) DO NOTHING;