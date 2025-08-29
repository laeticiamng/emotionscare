-- EmotionsCare Minimal Schema
-- Tables for metrics, journal, goals, music sessions, push subscriptions, org aggregates, exports

-- Profiles table for user preferences and roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  preferences JSONB DEFAULT '{}',
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Metrics tables (one per module type)
CREATE TABLE IF NOT EXISTS public.metrics_flash_glow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.metrics_vr_breath (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.metrics_vr_galaxy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.metrics_face_filter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.metrics_emotion_scan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.metrics_bubble_beat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID DEFAULT gen_random_uuid(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB DEFAULT '{}'
);

-- Journal table
CREATE TABLE IF NOT EXISTS public.journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
  text TEXT,
  audio_path TEXT,
  sentiment_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Music sessions table
CREATE TABLE IF NOT EXISTS public.music_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  suno_track_ids TEXT[],
  mood_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organization aggregates table
CREATE TABLE IF NOT EXISTS public.org_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  period TEXT NOT NULL,
  team_id UUID,
  label_bins JSONB DEFAULT '{}',
  min_n INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exports table
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_flash_glow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_vr_breath ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_vr_galaxy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_face_filter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_emotion_scan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_bubble_beat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only access their own data
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own flash glow metrics" ON public.metrics_flash_glow
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own vr breath metrics" ON public.metrics_vr_breath
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own vr galaxy metrics" ON public.metrics_vr_galaxy
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own face filter metrics" ON public.metrics_face_filter
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own emotion scan metrics" ON public.metrics_emotion_scan
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bubble beat metrics" ON public.metrics_bubble_beat
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own journal" ON public.journal
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own music sessions" ON public.music_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own exports" ON public.exports
  FOR ALL USING (auth.uid() = user_id);

-- Org aggregates accessible by org members and admins
CREATE POLICY "Org members can view aggregates" ON public.org_aggregates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.organization_id = org_aggregates.org_id OR profiles.role = 'admin')
    )
  );