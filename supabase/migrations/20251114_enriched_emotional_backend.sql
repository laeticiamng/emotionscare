-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Backend Enrichi pour Modules Émotionnels
-- VERSION: 1.0.0
-- DATE: 2025-11-14
-- DESCRIPTION: Infrastructure complète pour achievements, analytics, patterns et insights
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 1. TABLE: emotional_achievements
-- Description: Stockage des achievements émotionnels pour chaque utilisateur
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emotional_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  achievement_title text NOT NULL,
  achievement_description text,
  category text NOT NULL CHECK (category IN ('scan', 'streak', 'journey', 'mastery', 'social', 'special')),
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  xp_reward int NOT NULL DEFAULT 0,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  progress int NOT NULL DEFAULT 100, -- Progress when unlocked (always 100)
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(user_id, achievement_id)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_emotional_achievements_user_id
  ON public.emotional_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_achievements_category
  ON public.emotional_achievements(category);
CREATE INDEX IF NOT EXISTS idx_emotional_achievements_unlocked_at
  ON public.emotional_achievements(unlocked_at DESC);

-- RLS
ALTER TABLE public.emotional_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.emotional_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.emotional_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.emotional_achievements FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.emotional_achievements IS 'Achievements émotionnels débloqués par les utilisateurs';
COMMENT ON COLUMN public.emotional_achievements.achievement_id IS 'Identifiant unique de l''achievement (ex: first_scan)';
COMMENT ON COLUMN public.emotional_achievements.tier IS 'Niveau de rareté de l''achievement';
COMMENT ON COLUMN public.emotional_achievements.xp_reward IS 'Points d''expérience gagnés en débloquant';

-- ───────────────────────────────────────────────────────────────────────────
-- 2. TABLE: emotional_stats
-- Description: Statistiques émotionnelles agrégées pour chaque utilisateur
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emotional_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Statistiques de scan
  total_scans int NOT NULL DEFAULT 0,
  total_journal_entries int NOT NULL DEFAULT 0,
  emotions_discovered text[] DEFAULT ARRAY[]::text[],
  favorite_emotion text,

  -- Scores et moyennes
  average_mood_score numeric(5,2) DEFAULT 0,
  average_valence numeric(5,2) DEFAULT 0,
  average_arousal numeric(5,2) DEFAULT 0,
  emotional_variability numeric(5,2) DEFAULT 0,

  -- Activité
  days_active int NOT NULL DEFAULT 0,
  first_activity_date date,
  last_activity_date date,

  -- Gamification
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  next_level_xp int NOT NULL DEFAULT 1000,
  total_xp_earned int NOT NULL DEFAULT 0,

  -- Streaks
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_check_in timestamptz,
  total_check_ins int NOT NULL DEFAULT 0,

  -- Sources utilisées
  scan_types_used text[] DEFAULT ARRAY[]::text[],

  -- Métadonnées
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_emotional_stats_user_id
  ON public.emotional_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_stats_level
  ON public.emotional_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_emotional_stats_xp
  ON public.emotional_stats(total_xp_earned DESC);

-- RLS
ALTER TABLE public.emotional_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
  ON public.emotional_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.emotional_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.emotional_stats FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.emotional_stats IS 'Statistiques émotionnelles agrégées par utilisateur';
COMMENT ON COLUMN public.emotional_stats.emotions_discovered IS 'Liste des émotions découvertes par l''utilisateur';
COMMENT ON COLUMN public.emotional_stats.emotional_variability IS 'Écart-type des scores émotionnels (stabilité)';

-- ───────────────────────────────────────────────────────────────────────────
-- 3. TABLE: emotional_patterns
-- Description: Patterns émotionnels détectés automatiquement
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emotional_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identifiants
  pattern_type text NOT NULL CHECK (pattern_type IN ('recurring', 'seasonal', 'contextual', 'triggered')),
  emotion text NOT NULL,

  -- Métriques
  frequency numeric(5,2) NOT NULL DEFAULT 0, -- 0-1 (pourcentage)
  confidence numeric(5,2) NOT NULL DEFAULT 0, -- 0-1
  strength numeric(5,2) NOT NULL DEFAULT 0, -- 0-1 (force du pattern)

  -- Contexte temporel
  time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  day_of_week int CHECK (day_of_week BETWEEN 0 AND 6), -- 0=dimanche, 6=samedi
  month_of_year int CHECK (month_of_year BETWEEN 1 AND 12),

  -- Contexte
  context text,
  description text NOT NULL,

  -- Périodes
  detection_start_date date NOT NULL,
  detection_end_date date NOT NULL,
  last_occurrence timestamptz,
  occurrence_count int NOT NULL DEFAULT 1,

  -- Métadonnées
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_emotional_patterns_user_id
  ON public.emotional_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_patterns_emotion
  ON public.emotional_patterns(emotion);
CREATE INDEX IF NOT EXISTS idx_emotional_patterns_type
  ON public.emotional_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_emotional_patterns_active
  ON public.emotional_patterns(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_emotional_patterns_confidence
  ON public.emotional_patterns(confidence DESC);

-- RLS
ALTER TABLE public.emotional_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own patterns"
  ON public.emotional_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert patterns"
  ON public.emotional_patterns FOR INSERT
  WITH CHECK (true); -- Patterns créés par le système

CREATE POLICY "System can update patterns"
  ON public.emotional_patterns FOR UPDATE
  USING (true);

COMMENT ON TABLE public.emotional_patterns IS 'Patterns émotionnels détectés automatiquement';
COMMENT ON COLUMN public.emotional_patterns.pattern_type IS 'Type de pattern (récurrent, saisonnier, contextuel, déclenché)';
COMMENT ON COLUMN public.emotional_patterns.confidence IS 'Niveau de confiance de la détection (0-1)';

-- ───────────────────────────────────────────────────────────────────────────
-- 4. TABLE: emotional_insights
-- Description: Insights générés par IA pour les utilisateurs
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emotional_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contenu
  title text NOT NULL,
  description text NOT NULL,

  -- Classification
  type text NOT NULL CHECK (type IN ('positive', 'neutral', 'warning', 'tip')),
  category text NOT NULL CHECK (category IN ('trend', 'pattern', 'suggestion', 'achievement')),

  -- Métriques
  confidence numeric(5,2) NOT NULL DEFAULT 0, -- 0-1
  priority int NOT NULL DEFAULT 0 CHECK (priority BETWEEN 0 AND 10),

  -- Actionable
  actionable boolean DEFAULT false,
  action_label text,
  action_type text,
  action_data jsonb,

  -- État
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  read_at timestamptz,
  dismissed_at timestamptz,

  -- Période de validité
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz,

  -- Métadonnées
  metadata jsonb DEFAULT '{}'::jsonb,
  generated_by text DEFAULT 'ai',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_emotional_insights_user_id
  ON public.emotional_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_insights_type
  ON public.emotional_insights(type);
CREATE INDEX IF NOT EXISTS idx_emotional_insights_category
  ON public.emotional_insights(category);
CREATE INDEX IF NOT EXISTS idx_emotional_insights_unread
  ON public.emotional_insights(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_emotional_insights_priority
  ON public.emotional_insights(priority DESC);
CREATE INDEX IF NOT EXISTS idx_emotional_insights_valid
  ON public.emotional_insights(valid_from, valid_until)
  WHERE is_dismissed = false;

-- RLS
ALTER TABLE public.emotional_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights"
  ON public.emotional_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert insights"
  ON public.emotional_insights FOR INSERT
  WITH CHECK (true); -- Insights créés par le système

CREATE POLICY "Users can update their own insights"
  ON public.emotional_insights FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.emotional_insights IS 'Insights émotionnels générés par IA';
COMMENT ON COLUMN public.emotional_insights.actionable IS 'Si l''insight propose une action';
COMMENT ON COLUMN public.emotional_insights.priority IS 'Priorité de l''insight (0-10)';

-- ───────────────────────────────────────────────────────────────────────────
-- 5. TABLE: emotional_trends
-- Description: Tendances émotionnelles calculées
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emotional_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identifiants
  emotion text NOT NULL,
  period_comparison text NOT NULL CHECK (period_comparison IN ('day', 'week', 'month', 'year')),

  -- Métriques
  change_percentage numeric(10,2) NOT NULL, -- Peut être négatif
  direction text NOT NULL CHECK (direction IN ('up', 'down', 'stable')),

  -- Périodes
  period_start date NOT NULL,
  period_end date NOT NULL,

  -- Valeurs
  previous_value numeric(10,2),
  current_value numeric(10,2),

  -- Statistiques
  average_score numeric(10,2),
  max_score numeric(10,2),
  min_score numeric(10,2),
  occurrence_count int NOT NULL DEFAULT 0,

  -- Métadonnées
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(user_id, emotion, period_comparison, period_start)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_emotional_trends_user_id
  ON public.emotional_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_trends_emotion
  ON public.emotional_trends(emotion);
CREATE INDEX IF NOT EXISTS idx_emotional_trends_period
  ON public.emotional_trends(period_start DESC, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_emotional_trends_direction
  ON public.emotional_trends(direction);

-- RLS
ALTER TABLE public.emotional_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trends"
  ON public.emotional_trends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert trends"
  ON public.emotional_trends FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update trends"
  ON public.emotional_trends FOR UPDATE
  USING (true);

COMMENT ON TABLE public.emotional_trends IS 'Tendances émotionnelles calculées automatiquement';
COMMENT ON COLUMN public.emotional_trends.change_percentage IS 'Pourcentage de changement (peut être négatif)';

-- ───────────────────────────────────────────────────────────────────────────
-- 6. FONCTIONS POSTGRESQL
-- ───────────────────────────────────────────────────────────────────────────

-- Fonction: Initialiser les stats d'un utilisateur
CREATE OR REPLACE FUNCTION public.initialize_emotional_stats(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.emotional_stats (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Fonction: Mettre à jour les stats après un scan
CREATE OR REPLACE FUNCTION public.update_emotional_stats_after_scan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_emotion text;
  v_emotions_array text[];
BEGIN
  -- S'assurer que les stats existent
  PERFORM public.initialize_emotional_stats(NEW.user_id);

  -- Extraire l'émotion dominante
  v_emotion := NEW.mood;

  -- Mettre à jour les statistiques
  UPDATE public.emotional_stats
  SET
    total_scans = total_scans + 1,
    emotions_discovered = ARRAY(
      SELECT DISTINCT unnest(emotions_discovered || ARRAY[v_emotion])
    ),
    last_activity_date = CURRENT_DATE,
    first_activity_date = COALESCE(first_activity_date, CURRENT_DATE),
    days_active = (
      SELECT COUNT(DISTINCT DATE(created_at))
      FROM public.emotion_scans
      WHERE user_id = NEW.user_id
    ),
    scan_types_used = ARRAY(
      SELECT DISTINCT unnest(scan_types_used || ARRAY[NEW.scan_type])
    ),
    updated_at = now()
  WHERE user_id = NEW.user_id;

  -- Calculer les moyennes (simplifié)
  UPDATE public.emotional_stats
  SET
    average_mood_score = (
      SELECT AVG(emotional_balance)
      FROM public.emotion_scans
      WHERE user_id = NEW.user_id
        AND emotional_balance IS NOT NULL
    ),
    emotional_variability = (
      SELECT STDDEV(emotional_balance)
      FROM public.emotion_scans
      WHERE user_id = NEW.user_id
        AND emotional_balance IS NOT NULL
    )
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

-- Fonction: Vérifier et débloquer achievements
CREATE OR REPLACE FUNCTION public.check_and_unlock_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats record;
  v_achievement record;
BEGIN
  -- Récupérer les stats de l'utilisateur
  SELECT * INTO v_stats
  FROM public.emotional_stats
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Achievement: Premier scan
  IF v_stats.total_scans >= 1 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'first_scan', 'Premier Pas',
      'Réaliser votre premier scan émotionnel',
      'scan', 'bronze', 100
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: 10 scans
  IF v_stats.total_scans >= 10 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'scan_explorer', 'Explorateur d''Émotions',
      'Réaliser 10 scans émotionnels',
      'scan', 'silver', 500
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: 100 scans
  IF v_stats.total_scans >= 100 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'scan_master', 'Maître du Scan',
      'Réaliser 100 scans émotionnels',
      'scan', 'gold', 2000
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: 500 scans
  IF v_stats.total_scans >= 500 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'scan_legend', 'Légende Émotionnelle',
      'Réaliser 500 scans émotionnels',
      'scan', 'diamond', 10000
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: Streak de 7 jours
  IF v_stats.current_streak >= 7 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'streak_week', 'Constance Hebdomadaire',
      'Maintenir une série de 7 jours consécutifs',
      'streak', 'bronze', 300
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: Streak de 30 jours
  IF v_stats.current_streak >= 30 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'streak_month', 'Engagement Mensuel',
      'Maintenir une série de 30 jours consécutifs',
      'streak', 'gold', 1500
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: 20 émotions découvertes
  IF array_length(v_stats.emotions_discovered, 1) >= 20 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'emotion_diversity', 'Arc-en-ciel Émotionnel',
      'Découvrir 20 émotions différentes',
      'journey', 'silver', 800
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Achievement: Tous les types de scan
  IF array_length(v_stats.scan_types_used, 1) >= 4 THEN
    INSERT INTO public.emotional_achievements (
      user_id, achievement_id, achievement_title, achievement_description,
      category, tier, xp_reward
    ) VALUES (
      p_user_id, 'all_scan_types', 'Multi-Modaliste',
      'Utiliser tous les types de scan',
      'mastery', 'gold', 2500
    ) ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
END;
$$;

-- Fonction: Calculer XP après achievement
CREATE OR REPLACE FUNCTION public.grant_xp_after_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_xp int;
  v_new_level int;
  v_next_level_xp int;
BEGIN
  -- Ajouter l'XP à l'utilisateur
  UPDATE public.emotional_stats
  SET
    xp = xp + NEW.xp_reward,
    total_xp_earned = total_xp_earned + NEW.xp_reward,
    updated_at = now()
  WHERE user_id = NEW.user_id
  RETURNING xp, level, next_level_xp
  INTO v_new_xp, v_new_level, v_next_level_xp;

  -- Vérifier si level up
  WHILE v_new_xp >= v_next_level_xp LOOP
    v_new_level := v_new_level + 1;
    v_new_xp := v_new_xp - v_next_level_xp;
    v_next_level_xp := v_next_level_xp + (v_new_level * 100); -- Progression exponentielle
  END LOOP;

  -- Mettre à jour le niveau
  UPDATE public.emotional_stats
  SET
    level = v_new_level,
    xp = v_new_xp,
    next_level_xp = v_next_level_xp,
    updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────────
-- 7. TRIGGERS
-- ───────────────────────────────────────────────────────────────────────────

-- Trigger: Mettre à jour les stats après un scan
DROP TRIGGER IF EXISTS trigger_update_stats_after_scan ON public.emotion_scans;
CREATE TRIGGER trigger_update_stats_after_scan
  AFTER INSERT ON public.emotion_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_emotional_stats_after_scan();

-- Trigger: Vérifier achievements après update des stats
DROP TRIGGER IF EXISTS trigger_check_achievements_after_stats_update ON public.emotional_stats;
CREATE TRIGGER trigger_check_achievements_after_stats_update
  AFTER UPDATE ON public.emotional_stats
  FOR EACH ROW
  WHEN (OLD.total_scans != NEW.total_scans OR OLD.current_streak != NEW.current_streak)
  EXECUTE FUNCTION public.check_and_unlock_achievements(NEW.user_id);

-- Trigger: Accorder XP après achievement
DROP TRIGGER IF EXISTS trigger_grant_xp_after_achievement ON public.emotional_achievements;
CREATE TRIGGER trigger_grant_xp_after_achievement
  AFTER INSERT ON public.emotional_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_xp_after_achievement();

-- Trigger: updated_at automatique
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_emotional_achievements_updated_at ON public.emotional_achievements;
CREATE TRIGGER trigger_emotional_achievements_updated_at
  BEFORE UPDATE ON public.emotional_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_emotional_stats_updated_at ON public.emotional_stats;
CREATE TRIGGER trigger_emotional_stats_updated_at
  BEFORE UPDATE ON public.emotional_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_emotional_patterns_updated_at ON public.emotional_patterns;
CREATE TRIGGER trigger_emotional_patterns_updated_at
  BEFORE UPDATE ON public.emotional_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_emotional_insights_updated_at ON public.emotional_insights;
CREATE TRIGGER trigger_emotional_insights_updated_at
  BEFORE UPDATE ON public.emotional_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_emotional_trends_updated_at ON public.emotional_trends;
CREATE TRIGGER trigger_emotional_trends_updated_at
  BEFORE UPDATE ON public.emotional_trends
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ───────────────────────────────────────────────────────────────────────────
-- 8. VUES UTILITAIRES
-- ───────────────────────────────────────────────────────────────────────────

-- Vue: Leaderboard des utilisateurs par XP
CREATE OR REPLACE VIEW public.emotional_leaderboard AS
SELECT
  es.user_id,
  es.level,
  es.total_xp_earned,
  es.total_scans,
  es.current_streak,
  es.longest_streak,
  COUNT(DISTINCT ea.id) as total_achievements,
  ROW_NUMBER() OVER (ORDER BY es.total_xp_earned DESC) as rank
FROM public.emotional_stats es
LEFT JOIN public.emotional_achievements ea ON ea.user_id = es.user_id
GROUP BY es.user_id, es.level, es.total_xp_earned, es.total_scans, es.current_streak, es.longest_streak
ORDER BY es.total_xp_earned DESC;

COMMENT ON VIEW public.emotional_leaderboard IS 'Classement des utilisateurs par XP total';

-- Vue: Dashboard résumé pour un utilisateur
CREATE OR REPLACE VIEW public.emotional_dashboard_summary AS
SELECT
  es.user_id,
  es.level,
  es.xp,
  es.next_level_xp,
  es.total_scans,
  es.average_mood_score,
  es.emotional_variability,
  es.current_streak,
  es.longest_streak,
  COUNT(DISTINCT ea.id) as total_achievements_unlocked,
  COUNT(DISTINCT ea.id) FILTER (WHERE ea.tier = 'diamond') as diamond_achievements,
  COUNT(DISTINCT ep.id) as active_patterns,
  COUNT(DISTINCT ei.id) FILTER (WHERE ei.is_read = false) as unread_insights
FROM public.emotional_stats es
LEFT JOIN public.emotional_achievements ea ON ea.user_id = es.user_id
LEFT JOIN public.emotional_patterns ep ON ep.user_id = es.user_id AND ep.is_active = true
LEFT JOIN public.emotional_insights ei ON ei.user_id = es.user_id
GROUP BY es.user_id, es.level, es.xp, es.next_level_xp, es.total_scans,
         es.average_mood_score, es.emotional_variability, es.current_streak, es.longest_streak;

COMMENT ON VIEW public.emotional_dashboard_summary IS 'Résumé du dashboard émotionnel par utilisateur';

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN DE LA MIGRATION
-- ═══════════════════════════════════════════════════════════════════════════
