-- Création des tables pour les fonctionnalités avancées d'EmotionsCare

-- Table pour les scans d'émotions
CREATE TABLE IF NOT EXISTS public.emotion_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  recommendations TEXT[],
  scan_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les entrées de journal vocal
CREATE TABLE IF NOT EXISTS public.voice_journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  transcription TEXT NOT NULL,
  ai_insights TEXT,
  emotion TEXT,
  sentiment DECIMAL(3,2),
  keywords TEXT[],
  duration INTEGER DEFAULT 0,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sessions VR
CREATE TABLE IF NOT EXISTS public.vr_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'galaxy', 'meditation', 'therapy'
  environment TEXT NOT NULL, -- 'space', 'nature', 'abstract'
  duration INTEGER NOT NULL DEFAULT 0,
  emotions_before JSONB,
  emotions_after JSONB,
  biometric_data JSONB,
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sessions de respiration
CREATE TABLE IF NOT EXISTS public.breathwork_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  technique_type TEXT NOT NULL, -- '4-7-8', 'box', 'coherence'
  duration INTEGER NOT NULL DEFAULT 0,
  target_bpm INTEGER,
  actual_bpm INTEGER,
  coherence_score DECIMAL(4,2),
  stress_level_before INTEGER CHECK (stress_level_before >= 1 AND stress_level_before <= 10),
  stress_level_after INTEGER CHECK (stress_level_after >= 1 AND stress_level_after <= 10),
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les playlists de musique générées
CREATE TABLE IF NOT EXISTS public.music_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  emotion_context TEXT,
  tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_ai_generated BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sessions de coach IA
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'emotion_support', 'goal_setting', 'crisis', 'general'
  emotion_context TEXT,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  session_summary TEXT,
  recommendations JSONB DEFAULT '[]'::jsonb,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les activités gamifiées
CREATE TABLE IF NOT EXISTS public.gamification_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'scan', 'journal', 'breathwork', 'vr', 'coach'
  points_earned INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  achievement_unlocked TEXT,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les préférences utilisateur avancées
CREATE TABLE IF NOT EXISTS public.user_preferences_advanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_settings JSONB DEFAULT '{}'::jsonb,
  privacy_settings JSONB DEFAULT '{}'::jsonb,
  personalization JSONB DEFAULT '{}'::jsonb,
  accessibility_settings JSONB DEFAULT '{}'::jsonb,
  theme_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.emotion_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathwork_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences_advanced ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour emotion_scans
CREATE POLICY "Users can manage their own emotion scans" ON public.emotion_scans
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour voice_journal_entries
CREATE POLICY "Users can manage their own voice journal entries" ON public.voice_journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour vr_sessions
CREATE POLICY "Users can manage their own VR sessions" ON public.vr_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour breathwork_sessions
CREATE POLICY "Users can manage their own breathwork sessions" ON public.breathwork_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour music_playlists
CREATE POLICY "Users can manage their own music playlists" ON public.music_playlists
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour ai_coach_sessions
CREATE POLICY "Users can manage their own AI coach sessions" ON public.ai_coach_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour gamification_activities
CREATE POLICY "Users can manage their own gamification activities" ON public.gamification_activities
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies pour user_preferences_advanced
CREATE POLICY "Users can manage their own advanced preferences" ON public.user_preferences_advanced
  FOR ALL USING (auth.uid() = user_id);

-- Créer des indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_emotion_scans_user_created ON public.emotion_scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_journal_user_created ON public.voice_journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vr_sessions_user_created ON public.vr_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_breathwork_user_created ON public.breathwork_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_music_playlists_user ON public.music_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_sessions_user ON public.ai_coach_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gamification_user ON public.gamification_activities(user_id, activity_type);

-- Fonction trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers updated_at
CREATE TRIGGER update_emotion_scans_updated_at
  BEFORE UPDATE ON public.emotion_scans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voice_journal_updated_at
  BEFORE UPDATE ON public.voice_journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_playlists_updated_at
  BEFORE UPDATE ON public.music_playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_advanced_updated_at
  BEFORE UPDATE ON public.user_preferences_advanced
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();