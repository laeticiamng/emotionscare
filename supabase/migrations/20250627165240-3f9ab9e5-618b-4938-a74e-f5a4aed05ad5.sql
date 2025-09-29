
-- Table pour stocker les métadonnées des routes et pages
CREATE TABLE IF NOT EXISTS public.route_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  category TEXT NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  components_used JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour stocker les analytics des pages
CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_duration INTEGER, -- en secondes
  interactions_count INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.route_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Policies pour route_metadata (lecture publique, écriture pour admins)
CREATE POLICY "Anyone can view route metadata" ON public.route_metadata
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update route metadata" ON public.route_metadata
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies pour page_analytics
CREATE POLICY "Users can view their own analytics" ON public.page_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON public.page_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insérer les métadonnées des routes existantes
INSERT INTO public.route_metadata (route_path, page_name, category, completion_percentage, features) VALUES
('/scan', 'ScanPage', 'measure_adaptation', 100, '["emotion_detection", "ai_analysis", "voice_processing"]'),
('/music', 'MusicPage', 'measure_adaptation', 100, '["music_therapy", "playlists", "mood_matching"]'),
('/flash-glow', 'FlashGlowPage', 'measure_adaptation', 100, '["instant_boost", "energy_enhancement"]'),
('/boss-level-grit', 'BossLevelGritPage', 'measure_adaptation', 100, '["resilience_training", "challenge_mode"]'),
('/mood-mixer', 'MoodMixerPage', 'measure_adaptation', 100, '["emotion_blending", "personalization"]'),
('/bounce-back-battle', 'BounceBackBattlePage', 'measure_adaptation', 100, '["recovery_training", "gamification"]'),
('/breathwork', 'BreathworkPage', 'measure_adaptation', 100, '["breathing_exercises", "meditation"]'),
('/instant-glow', 'InstantGlowPage', 'measure_adaptation', 100, '["quick_mood_boost", "energy_activation"]'),
('/vr', 'VRPage', 'immersive_experiences', 95, '["virtual_reality", "immersion", "3d_environments"]'),
('/', 'HomePage', 'user_spaces', 100, '["landing", "navigation", "authentication"]'),
('/choose-mode', 'ChooseModePage', 'user_spaces', 100, '["user_type_selection", "onboarding"]'),
('/b2c/login', 'B2CLoginPage', 'user_spaces', 100, '["authentication", "social_login"]'),
('/b2c/register', 'B2CRegisterPage', 'user_spaces', 100, '["registration", "user_onboarding"]'),
('/b2c/dashboard', 'B2CDashboardPage', 'user_spaces', 100, '["dashboard", "analytics", "widgets"]'),
('/preferences', 'PreferencesPage', 'user_spaces', 90, '["settings", "customization"]'),
('/notifications', 'NotificationsPage', 'user_spaces', 100, '["alerts", "communication"]')
ON CONFLICT (route_path) DO UPDATE SET
  completion_percentage = EXCLUDED.completion_percentage,
  features = EXCLUDED.features,
  last_updated = now();
