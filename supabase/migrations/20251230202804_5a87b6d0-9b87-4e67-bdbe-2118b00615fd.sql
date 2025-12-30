-- ============================================================================
-- ENRICHISSEMENT MODULE SCORES - TABLES MANQUANTES
-- ============================================================================

-- Table user_achievements (référencée dans le code mais inexistante)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INTEGER DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  shared BOOLEAN DEFAULT false,
  share_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON public.user_achievements(unlocked_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_achievements_unique ON public.user_achievements(user_id, achievement_id);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON public.user_achievements FOR UPDATE USING (auth.uid() = user_id);

-- Table score_goals (objectifs personnalisés)
CREATE TABLE IF NOT EXISTS public.score_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('emotional', 'wellbeing', 'engagement', 'overall', 'streak', 'sessions')),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  current_value INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_score_goals_user ON public.score_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_score_goals_status ON public.score_goals(status);

ALTER TABLE public.score_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals" ON public.score_goals FOR ALL USING (auth.uid() = user_id);

-- Table score_milestones (notifications de paliers)
CREATE TABLE IF NOT EXISTS public.score_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  milestone_value INTEGER NOT NULL,
  reached_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified BOOLEAN DEFAULT false,
  shared BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_score_milestones_user ON public.score_milestones(user_id);

ALTER TABLE public.score_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own milestones" ON public.score_milestones FOR ALL USING (auth.uid() = user_id);

-- Table score_comparisons (historique des comparaisons)
CREATE TABLE IF NOT EXISTS public.score_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period_a_start TIMESTAMPTZ NOT NULL,
  period_a_end TIMESTAMPTZ NOT NULL,
  period_b_start TIMESTAMPTZ NOT NULL,
  period_b_end TIMESTAMPTZ NOT NULL,
  comparison_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.score_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own comparisons" ON public.score_comparisons FOR ALL USING (auth.uid() = user_id);

-- Ajouter resilience_score à user_scores si manquant
ALTER TABLE public.user_scores 
ADD COLUMN IF NOT EXISTS resilience_score INTEGER DEFAULT 50 CHECK (resilience_score >= 0 AND resilience_score <= 100);

-- Table special_badges pour gamification avancée
CREATE TABLE IF NOT EXISTS public.special_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('score', 'streak', 'module', 'community', 'special')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insérer des badges spéciaux
INSERT INTO public.special_badges (name, description, icon, category, rarity, condition_type, condition_value, xp_reward) VALUES
  ('Débutant Zen', 'Premier score émotionnel > 70', '🧘', 'score', 'common', 'emotional_first_70', 70, 50),
  ('Maître des Émotions', 'Score émotionnel > 90 pendant 4 semaines', '🏆', 'score', 'epic', 'emotional_90_4weeks', 90, 500),
  ('Flamme Éternelle', 'Streak de 30 jours', '🔥', 'streak', 'rare', 'streak_30', 30, 300),
  ('Inferno', 'Streak de 100 jours', '🌋', 'streak', 'legendary', 'streak_100', 100, 1000),
  ('Explorateur', 'Utilisé 5 modules différents', '🧭', 'module', 'common', 'modules_5', 5, 100),
  ('Maître Polyvalent', 'Utilisé tous les modules', '⭐', 'module', 'legendary', 'modules_all', 15, 1500),
  ('Score Parfait', 'Score global de 100', '💯', 'score', 'legendary', 'perfect_100', 100, 2000),
  ('Progression Constante', '8 semaines de progression', '📈', 'score', 'epic', 'progress_8weeks', 8, 400)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.special_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are readable by all" ON public.special_badges FOR SELECT USING (true);

-- Table user_special_badges
CREATE TABLE IF NOT EXISTS public.user_special_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID REFERENCES public.special_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  shared BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_special_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own special badges" ON public.user_special_badges FOR ALL USING (auth.uid() = user_id);

-- Fonction pour auto-calculer les scores hebdomadaires
CREATE OR REPLACE FUNCTION public.auto_calculate_weekly_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_week INTEGER;
  current_year INTEGER;
  avg_mood NUMERIC;
  activity_count INTEGER;
  session_count INTEGER;
  emotional_score INTEGER;
  wellbeing_score INTEGER;
  engagement_score INTEGER;
BEGIN
  -- Calculer semaine et année
  current_week := EXTRACT(WEEK FROM NOW());
  current_year := EXTRACT(YEAR FROM NOW());
  
  -- Score émotionnel (moyenne des emotion_scans de la semaine)
  SELECT COALESCE(AVG(mood_score), 50) INTO avg_mood
  FROM emotion_scans
  WHERE user_id = NEW.user_id
  AND created_at >= date_trunc('week', NOW());
  
  emotional_score := LEAST(100, GREATEST(0, avg_mood::INTEGER));
  
  -- Activités de la semaine
  SELECT COUNT(*) INTO activity_count
  FROM user_activities
  WHERE user_id = NEW.user_id
  AND created_at >= date_trunc('week', NOW());
  
  wellbeing_score := LEAST(100, 50 + activity_count * 5);
  
  -- Sessions de la semaine
  SELECT COUNT(*) INTO session_count
  FROM sessions
  WHERE user_id = NEW.user_id
  AND created_at >= date_trunc('week', NOW());
  
  engagement_score := LEAST(100, session_count * 10 + activity_count * 5);
  
  -- Upsert le score
  INSERT INTO user_scores (user_id, week_number, year, emotional_score, wellbeing_score, engagement_score)
  VALUES (NEW.user_id, current_week, current_year, emotional_score, wellbeing_score, engagement_score)
  ON CONFLICT (user_id, week_number, year) 
  DO UPDATE SET 
    emotional_score = EXCLUDED.emotional_score,
    wellbeing_score = EXCLUDED.wellbeing_score,
    engagement_score = EXCLUDED.engagement_score,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Trigger pour auto-calculer après un emotion_scan
DROP TRIGGER IF EXISTS auto_calc_score_on_emotion_scan ON public.emotion_scans;
CREATE TRIGGER auto_calc_score_on_emotion_scan
  AFTER INSERT ON public.emotion_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_calculate_weekly_score();