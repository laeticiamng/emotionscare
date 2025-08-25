-- Tables pour les fonctionnalités complètes d'EmotionsCare

-- Table pour les métriques utilisateur détaillées
CREATE TABLE IF NOT EXISTS public.user_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotional_balance INTEGER DEFAULT 75 CHECK (emotional_balance >= 0 AND emotional_balance <= 100),
  stress_level INTEGER DEFAULT 30 CHECK (stress_level >= 0 AND stress_level <= 100),
  focus_score INTEGER DEFAULT 80 CHECK (focus_score >= 0 AND focus_score <= 100),
  wellness_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  mood_trend TEXT DEFAULT 'stable' CHECK (mood_trend IN ('improving', 'stable', 'declining')),
  last_scan_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour l'activité utilisateur
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('scan', 'music', 'breathwork', 'journal', 'coach', 'vr', 'gamification')),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0, -- en secondes
  score INTEGER CHECK (score >= 0 AND score <= 100),
  emotions_detected JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les sessions de scan émotionnel
CREATE TABLE IF NOT EXISTS public.emotion_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scan_type TEXT DEFAULT 'facial' CHECK (scan_type IN ('facial', 'voice', 'text', 'mixed')),
  emotions_detected JSONB NOT NULL DEFAULT '[]',
  dominant_emotion TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  recommendations JSONB DEFAULT '[]',
  scan_duration INTEGER DEFAULT 0,
  device_type TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les sessions de musicothérapie
CREATE TABLE IF NOT EXISTS public.music_therapy_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  song_id UUID,
  emotion_target TEXT NOT NULL,
  session_duration INTEGER DEFAULT 0,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  mood_before JSONB,
  mood_after JSONB,
  biometric_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les exercices de respiration
CREATE TABLE IF NOT EXISTS public.breathwork_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('calm', 'energize', 'focus', 'sleep', 'anxiety')),
  exercise_name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  cycles_completed INTEGER DEFAULT 0,
  heart_rate_data JSONB DEFAULT '[]',
  stress_reduction_score INTEGER CHECK (stress_reduction_score >= 0 AND stress_reduction_score <= 100),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour le journaling émotionnel
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  emotions_tags JSONB DEFAULT '[]',
  ai_analysis JSONB,
  ai_suggestions TEXT,
  is_private BOOLEAN DEFAULT true,
  weather_data JSONB,
  location_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les conversations avec le coach IA
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id UUID,
  coach_type TEXT DEFAULT 'emotional' CHECK (coach_type IN ('emotional', 'medical', 'wellness', 'career', 'relationships')),
  session_topic TEXT,
  messages JSONB DEFAULT '[]',
  session_summary TEXT,
  action_items JSONB DEFAULT '[]',
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Table pour les expériences VR/AR
CREATE TABLE IF NOT EXISTS public.vr_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('meditation', 'exposure_therapy', 'relaxation', 'adventure', 'educational')),
  scene_name TEXT NOT NULL,
  experience_duration INTEGER DEFAULT 0,
  immersion_level INTEGER CHECK (immersion_level >= 1 AND immersion_level <= 10),
  stress_level_before INTEGER,
  stress_level_after INTEGER,
  presence_score DECIMAL(3,2),
  motion_sickness_reported BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour la gamification et objectifs
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_progress INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'sessions',
  category TEXT CHECK (category IN ('emotional', 'physical', 'social', 'learning')),
  deadline TIMESTAMPTZ,
  reward_points INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les niveaux et points de gamification
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  achievements_unlocked JSONB DEFAULT '[]',
  weekly_challenges_completed INTEGER DEFAULT 0,
  monthly_challenges_completed INTEGER DEFAULT 0,
  favorite_activities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les relations sociales et buddy system
CREATE TABLE IF NOT EXISTS public.social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_user_id UUID NOT NULL,
  connection_type TEXT DEFAULT 'buddy' CHECK (connection_type IN ('buddy', 'mentor', 'mentee', 'study_partner')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  shared_goals JSONB DEFAULT '[]',
  interaction_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_user_id)
);

-- Table pour les notifications push et in-app
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('reminder', 'achievement', 'social', 'update', 'emergency')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  action_url TEXT,
  action_data JSONB,
  read BOOLEAN DEFAULT false,
  sent BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les préférences utilisateur détaillées
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'es', 'de')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  reminder_times JSONB DEFAULT '["09:00", "18:00"]',
  privacy_level TEXT DEFAULT 'moderate' CHECK (privacy_level IN ('private', 'moderate', 'open')),
  data_sharing_consent BOOLEAN DEFAULT false,
  accessibility_options JSONB DEFAULT '{}',
  preferred_activities JSONB DEFAULT '[]',
  wellness_goals JSONB DEFAULT '{}',
  emergency_contacts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_metrics_updated_at BEFORE UPDATE ON user_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathwork_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vr_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies pour user_metrics
CREATE POLICY "Users can manage their own metrics" ON user_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all metrics" ON user_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour user_activities
CREATE POLICY "Users can manage their own activities" ON user_activities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all activities" ON user_activities FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour emotion_scans
CREATE POLICY "Users can manage their own scans" ON emotion_scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all scans" ON emotion_scans FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour music_therapy_sessions
CREATE POLICY "Users can manage their own music sessions" ON music_therapy_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all music sessions" ON music_therapy_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour breathwork_sessions
CREATE POLICY "Users can manage their own breathwork" ON breathwork_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all breathwork" ON breathwork_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour journal_entries
CREATE POLICY "Users can manage their own journal" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all journal entries" ON journal_entries FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour ai_coach_sessions
CREATE POLICY "Users can manage their own coach sessions" ON ai_coach_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all coach sessions" ON ai_coach_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour vr_experiences
CREATE POLICY "Users can manage their own VR experiences" ON vr_experiences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all VR experiences" ON vr_experiences FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour user_goals
CREATE POLICY "Users can manage their own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all goals" ON user_goals FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour user_progress
CREATE POLICY "Users can manage their own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all progress" ON user_progress FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour social_connections
CREATE POLICY "Users can manage their own connections" ON social_connections FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "Service role can manage all connections" ON social_connections FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour user_notifications
CREATE POLICY "Users can manage their own notifications" ON user_notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all notifications" ON user_notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies pour user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all preferences" ON user_preferences FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');