-- Créer les tables manquantes pour finaliser toutes les fonctionnalités

-- Table pour les playlists musicales personnalisées
CREATE TABLE IF NOT EXISTS public.music_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mood TEXT,
  tags TEXT[],
  tracks JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les sessions d'IA coaching
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_personality TEXT DEFAULT 'empathetic',
  session_duration INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  emotions_detected JSONB DEFAULT '{}'::jsonb,
  techniques_suggested TEXT[],
  resources_provided JSONB DEFAULT '[]'::jsonb,
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  session_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour la gamification et les activités
CREATE TABLE IF NOT EXISTS public.gamification_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'meditation', 'vr', 'breathwork', 'emotion_scan', 'voice_journal', 'coach_chat'
  activity_name TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  duration INTEGER, -- en secondes
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  difficulty_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  achievements_unlocked TEXT[],
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les préférences utilisateur avancées
CREATE TABLE IF NOT EXISTS public.user_preferences_advanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  privacy_settings JSONB DEFAULT '{}'::jsonb,
  accessibility_settings JSONB DEFAULT '{}'::jsonb,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  ui_customization JSONB DEFAULT '{}'::jsonb,
  wellbeing_goals JSONB DEFAULT '[]'::jsonb,
  preferred_coach_personality TEXT DEFAULT 'empathetic',
  daily_reminders BOOLEAN DEFAULT true,
  data_sharing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies pour music_playlists
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own playlists" ON public.music_playlists;
CREATE POLICY "Users can manage their own playlists" ON public.music_playlists
FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public playlists are viewable by everyone" ON public.music_playlists;
CREATE POLICY "Public playlists are viewable by everyone" ON public.music_playlists
FOR SELECT USING (is_public = true);

-- RLS Policies pour ai_coach_sessions
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own coach sessions" ON public.ai_coach_sessions;
CREATE POLICY "Users can manage their own coach sessions" ON public.ai_coach_sessions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour gamification_activities
ALTER TABLE public.gamification_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own activities" ON public.gamification_activities;
CREATE POLICY "Users can manage their own activities" ON public.gamification_activities
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour user_preferences_advanced
ALTER TABLE public.user_preferences_advanced ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own advanced preferences" ON public.user_preferences_advanced;
CREATE POLICY "Users can manage their own advanced preferences" ON public.user_preferences_advanced
FOR ALL USING (auth.uid() = user_id);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_music_playlists_user_id ON public.music_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_music_playlists_mood ON public.music_playlists(mood);
CREATE INDEX IF NOT EXISTS idx_music_playlists_public ON public.music_playlists(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_ai_coach_sessions_user_id ON public.ai_coach_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_coach_sessions_personality ON public.ai_coach_sessions(coach_personality);
CREATE INDEX IF NOT EXISTS idx_ai_coach_sessions_created ON public.ai_coach_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_gamification_activities_user_id ON public.gamification_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_activities_type ON public.gamification_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_gamification_activities_date ON public.gamification_activities(created_at);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_music_playlists_updated_at ON public.music_playlists;
CREATE TRIGGER update_music_playlists_updated_at
  BEFORE UPDATE ON public.music_playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_coach_sessions_updated_at ON public.ai_coach_sessions;
CREATE TRIGGER update_ai_coach_sessions_updated_at
  BEFORE UPDATE ON public.ai_coach_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_advanced_updated_at ON public.user_preferences_advanced;
CREATE TRIGGER update_user_preferences_advanced_updated_at
  BEFORE UPDATE ON public.user_preferences_advanced
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();