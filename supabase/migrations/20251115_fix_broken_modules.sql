-- Migration pour réparer les modules cassés
-- Date: 2025-11-15
-- Description: Ajout des tables nécessaires pour achievements et emotion-orchestrator

-- ============================================================================
-- TABLE: user_achievement_progress
-- Description: Suivi de la progression utilisateur vers les achievements
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL,
  progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_value INTEGER NOT NULL DEFAULT 0,
  target_value INTEGER NOT NULL DEFAULT 1,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_user
  ON user_achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_unlocked
  ON user_achievement_progress(user_id, unlocked);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_achievement
  ON user_achievement_progress(achievement_id);

-- RLS policies pour user_achievement_progress
ALTER TABLE user_achievement_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievement progress"
  ON user_achievement_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert achievement progress"
  ON user_achievement_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update achievement progress"
  ON user_achievement_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- TABLE: module_recommendation_feedback
-- Description: Feedback utilisateur sur les recommandations de modules
-- ============================================================================

CREATE TABLE IF NOT EXISTS module_recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id TEXT NOT NULL,
  module_type TEXT NOT NULL,
  was_helpful BOOLEAN,
  was_followed BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_module_feedback_user
  ON module_recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_module_feedback_module
  ON module_recommendation_feedback(module_type);
CREATE INDEX IF NOT EXISTS idx_module_feedback_created
  ON module_recommendation_feedback(created_at);

-- RLS policies pour module_recommendation_feedback
ALTER TABLE module_recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
  ON module_recommendation_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own feedback"
  ON module_recommendation_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- FONCTION: Mettre à jour updated_at automatiquement
-- ============================================================================

CREATE OR REPLACE FUNCTION update_achievement_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_achievement_progress_timestamp
  BEFORE UPDATE ON user_achievement_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_achievement_progress_updated_at();

-- ============================================================================
-- FONCTION: Marquer unlocked_at quand unlocked devient true
-- ============================================================================

CREATE OR REPLACE FUNCTION set_achievement_unlocked_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unlocked = true AND OLD.unlocked = false THEN
    NEW.unlocked_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_unlocked_timestamp
  BEFORE UPDATE ON user_achievement_progress
  FOR EACH ROW
  EXECUTE FUNCTION set_achievement_unlocked_at();

-- ============================================================================
-- COLUMN: Ajouter total_xp à user_profiles si elle n'existe pas
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles'
    AND column_name = 'total_xp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_xp INTEGER DEFAULT 0;
    CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(total_xp);
  END IF;
END $$;

-- ============================================================================
-- COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE user_achievement_progress IS 'Suivi de la progression utilisateur vers les achievements';
COMMENT ON TABLE module_recommendation_feedback IS 'Feedback utilisateur sur les recommandations de modules émotionnels';

COMMENT ON COLUMN user_achievement_progress.progress IS 'Pourcentage de progression (0-100)';
COMMENT ON COLUMN user_achievement_progress.current_value IS 'Valeur actuelle vers l objectif';
COMMENT ON COLUMN user_achievement_progress.target_value IS 'Valeur cible à atteindre';
COMMENT ON COLUMN user_achievement_progress.unlocked IS 'Achievement débloqué';
COMMENT ON COLUMN user_achievement_progress.notified IS 'Utilisateur notifié du déverrouillage';

COMMENT ON COLUMN module_recommendation_feedback.was_helpful IS 'Recommandation jugée utile';
COMMENT ON COLUMN module_recommendation_feedback.was_followed IS 'Recommandation suivie par l utilisateur';
COMMENT ON COLUMN module_recommendation_feedback.rating IS 'Note de 1 à 5';
