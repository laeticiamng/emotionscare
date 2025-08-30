-- Création des tables pour toutes les fonctionnalités de la plateforme

-- Table pour les sessions d'activités utilisateur
CREATE TABLE IF NOT EXISTS user_activity_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'flash_glow', 'breathwork', 'bubble_beat', etc.
  session_data JSONB NOT NULL DEFAULT '{}',
  duration_seconds INTEGER,
  mood_before TEXT,
  mood_after TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_duration CHECK (duration_seconds >= 0)
);

-- Enable RLS
ALTER TABLE user_activity_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs accèdent seulement à leurs sessions
CREATE POLICY "Users can manage their own activity sessions" 
ON user_activity_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Table pour les préférences utilisateur par activité
CREATE TABLE IF NOT EXISTS user_activity_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_type)
);

-- Enable RLS
ALTER TABLE user_activity_preferences ENABLE ROW LEVEL SECURITY;

-- Politique pour les préférences
CREATE POLICY "Users can manage their own preferences" 
ON user_activity_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Table pour les objectifs et défis
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'wellness', 'mindfulness', 'energy', etc.
  target_value INTEGER,
  current_progress INTEGER DEFAULT 0,
  unit TEXT, -- 'minutes', 'sessions', 'days', etc.
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Politique pour les objectifs
CREATE POLICY "Users can manage their own goals" 
ON user_goals 
FOR ALL 
USING (auth.uid() = user_id);

-- Table pour les récompenses et achievements
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_type TEXT NOT NULL, -- 'achievement', 'daily_bonus', 'streak', etc.
  reward_name TEXT NOT NULL,
  reward_description TEXT,
  points_earned INTEGER DEFAULT 0,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_related TEXT -- quelle activité a déclenché la récompense
);

-- Enable RLS
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Politique pour les récompenses
CREATE POLICY "Users can view their own rewards" 
ON user_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

-- Service role peut créer des récompenses
CREATE POLICY "Service role can create rewards" 
ON user_rewards 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Table pour les statistiques d'usage
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL, -- 'page_view', 'feature_used', 'session_completed', etc.
  event_data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Enable RLS
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Politique pour les analytics (lectures seulement pour l'utilisateur)
CREATE POLICY "Users can view their own analytics" 
ON usage_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

-- Service role peut écrire les analytics
CREATE POLICY "Service role can write analytics" 
ON usage_analytics 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Table pour les recommandations IA personnalisées
CREATE TABLE IF NOT EXISTS personalized_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'activity', 'content', 'goal', etc.
  title TEXT NOT NULL,
  description TEXT,
  target_activity TEXT,
  priority_score INTEGER DEFAULT 50 CHECK (priority_score >= 0 AND priority_score <= 100),
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  reasoning TEXT, -- pourquoi cette recommandation
  expires_at TIMESTAMP WITH TIME ZONE,
  viewed BOOLEAN DEFAULT FALSE,
  acted_upon BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personalized_recommendations ENABLE ROW LEVEL SECURITY;

-- Politique pour les recommandations
CREATE POLICY "Users can view their own recommendations" 
ON personalized_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users peuvent marquer comme vues/utilisées
CREATE POLICY "Users can update their recommendation status" 
ON personalized_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND (viewed IS NOT NULL OR acted_upon IS NOT NULL));

-- Service role peut créer des recommandations
CREATE POLICY "Service role can manage recommendations" 
ON personalized_recommendations 
FOR ALL 
WITH CHECK (auth.role() = 'service_role');

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour user_activity_preferences
CREATE OR REPLACE TRIGGER update_user_activity_preferences_updated_at
    BEFORE UPDATE ON user_activity_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour user_goals
CREATE OR REPLACE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_activity_sessions_user_activity 
ON user_activity_sessions(user_id, activity_type);

CREATE INDEX IF NOT EXISTS idx_user_activity_sessions_created_at 
ON user_activity_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_status 
ON user_goals(user_id, status);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_timestamp 
ON usage_analytics(user_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_personalized_recommendations_user_priority 
ON personalized_recommendations(user_id, priority_score DESC) 
WHERE expires_at > NOW() AND viewed = FALSE;