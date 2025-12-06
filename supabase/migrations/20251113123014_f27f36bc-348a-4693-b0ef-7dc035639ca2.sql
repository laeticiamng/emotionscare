-- Tables pour le système de quêtes quotidiennes et hebdomadaires
CREATE TABLE IF NOT EXISTS public.music_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'special')),
  category TEXT NOT NULL CHECK (category IN ('listening', 'exploration', 'wellness', 'social')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward INTEGER NOT NULL DEFAULT 0,
  max_progress INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.music_quests(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Table pour le leaderboard social
CREATE TABLE IF NOT EXISTS public.music_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_score INTEGER DEFAULT 0,
  weekly_score INTEGER DEFAULT 0,
  monthly_score INTEGER DEFAULT 0,
  rank INTEGER,
  weekly_rank INTEGER,
  monthly_rank INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table pour le partage de badges
CREATE TABLE IF NOT EXISTS public.badge_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.music_achievements(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'facebook', 'linkedin', 'instagram')),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  share_url TEXT
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_music_quests_type ON public.music_quests(quest_type, is_active);
CREATE INDEX IF NOT EXISTS idx_user_quest_progress_user ON public.user_quest_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_music_leaderboard_scores ON public.music_leaderboard(total_score DESC, weekly_score DESC);
CREATE INDEX IF NOT EXISTS idx_badge_shares_user ON public.badge_shares(user_id);

-- RLS Policies
ALTER TABLE public.music_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_shares ENABLE ROW LEVEL SECURITY;

-- Music Quests: Tout le monde peut voir les quêtes actives
CREATE POLICY "Quêtes visibles par tous"
  ON public.music_quests FOR SELECT
  USING (is_active = true);

-- User Quest Progress: Les utilisateurs peuvent voir et mettre à jour leur propre progression
CREATE POLICY "Utilisateurs peuvent voir leur progression"
  ON public.user_quest_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent insérer leur progression"
  ON public.user_quest_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur progression"
  ON public.user_quest_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Leaderboard: Visible par tous
CREATE POLICY "Leaderboard visible par tous"
  ON public.music_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur entrée leaderboard"
  ON public.music_leaderboard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent modifier leur entrée leaderboard"
  ON public.music_leaderboard FOR UPDATE
  USING (auth.uid() = user_id);

-- Badge Shares: Les utilisateurs peuvent voir et créer leurs propres partages
CREATE POLICY "Utilisateurs peuvent voir leurs partages"
  ON public.badge_shares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent créer des partages"
  ON public.badge_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour le leaderboard automatiquement
CREATE OR REPLACE FUNCTION update_leaderboard_scores()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.music_leaderboard (user_id, display_name, total_score, weekly_score, monthly_score)
  VALUES (
    NEW.user_id,
    COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id), 'Utilisateur'),
    NEW.points_reward,
    NEW.points_reward,
    NEW.points_reward
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = music_leaderboard.total_score + NEW.points_reward,
    weekly_score = music_leaderboard.weekly_score + NEW.points_reward,
    monthly_score = music_leaderboard.monthly_score + NEW.points_reward,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour le leaderboard quand une quête est complétée
CREATE TRIGGER on_quest_completed
  AFTER UPDATE OF completed ON public.user_quest_progress
  FOR EACH ROW
  WHEN (NEW.completed = true AND OLD.completed = false)
  EXECUTE FUNCTION update_leaderboard_scores();

-- Fonction pour réinitialiser les scores hebdomadaires (à appeler via cron)
CREATE OR REPLACE FUNCTION reset_weekly_scores()
RETURNS void AS $$
BEGIN
  UPDATE public.music_leaderboard
  SET weekly_score = 0,
      weekly_rank = NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour réinitialiser les scores mensuels (à appeler via cron)
CREATE OR REPLACE FUNCTION reset_monthly_scores()
RETURNS void AS $$
BEGIN
  UPDATE public.music_leaderboard
  SET monthly_score = 0,
      monthly_rank = NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insérer des quêtes par défaut
INSERT INTO public.music_quests (title, description, quest_type, category, difficulty, points_reward, max_progress, end_date) VALUES
  ('Découverte Quotidienne', 'Écoutez 3 morceaux de musique thérapeutique différents', 'daily', 'listening', 'easy', 50, 3, NOW() + INTERVAL '1 day'),
  ('Explorateur Musical', 'Explorez 5 nouveaux genres musicaux cette semaine', 'weekly', 'exploration', 'medium', 200, 5, NOW() + INTERVAL '7 days'),
  ('Bien-être Sonore', 'Complétez 10 sessions d''écoute thérapeutique', 'weekly', 'wellness', 'medium', 300, 10, NOW() + INTERVAL '7 days'),
  ('Mélomane Assidu', 'Écoutez de la musique pendant 30 minutes aujourd''hui', 'daily', 'listening', 'easy', 75, 1, NOW() + INTERVAL '1 day'),
  ('Maître de l''Harmonie', 'Atteignez une session de 60 minutes de musique thérapeutique', 'weekly', 'wellness', 'hard', 500, 1, NOW() + INTERVAL '7 days')
ON CONFLICT DO NOTHING;