-- Fix edn_items missing item_number column
ALTER TABLE public.edn_items 
ADD COLUMN IF NOT EXISTS item_number INTEGER;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_edn_items_item_number ON public.edn_items(item_number);

-- Create music_therapy_tracks table for premium content
CREATE TABLE IF NOT EXISTS public.music_therapy_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'EmotionsCare Studio',
  duration_seconds INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('focus', 'relaxation', 'energy', 'healing', 'meditation', 'sleep')),
  frequency TEXT,
  description TEXT,
  audio_url TEXT,
  cover_url TEXT,
  is_premium BOOLEAN DEFAULT true,
  binaural_hz DECIMAL(5,2),
  tags TEXT[],
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS 
ALTER TABLE public.music_therapy_tracks ENABLE ROW LEVEL SECURITY;

-- Public read for all tracks
DROP POLICY IF EXISTS "Anyone can view music therapy tracks" ON public.music_therapy_tracks;
CREATE POLICY "Anyone can view music therapy tracks"
  ON public.music_therapy_tracks FOR SELECT
  USING (true);

-- Create user_therapy_sessions for tracking usage
CREATE TABLE IF NOT EXISTS public.user_therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.music_therapy_tracks(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  completion_rate DECIMAL(5,2),
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users manage their therapy sessions" ON public.user_therapy_sessions;
CREATE POLICY "Users manage their therapy sessions"
  ON public.user_therapy_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_therapy_sessions_user ON public.user_therapy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_therapy_sessions_track ON public.user_therapy_sessions(track_id);

-- Insert sample premium tracks
INSERT INTO public.music_therapy_tracks (title, artist, duration_seconds, category, frequency, description, binaural_hz) VALUES
('Deep Focus Alpha Waves', 'EmotionsCare Studio', 2700, 'focus', '10Hz Alpha', 'Ondes alpha pour concentration profonde et créativité', 10.00),
('Healing Theta Journey', 'EmotionsCare Studio', 3600, 'healing', '6Hz Theta', 'Thérapie par les fréquences pour guérison émotionnelle', 6.00),
('Delta Sleep Sanctuary', 'EmotionsCare Studio', 3600, 'sleep', '2Hz Delta', 'Sommeil profond et récupération cellulaire', 2.00),
('Beta Energy Boost', 'EmotionsCare Studio', 1800, 'energy', '20Hz Beta', 'Boost énergétique et clarté mentale', 20.00),
('Gamma Insight Flash', 'EmotionsCare Studio', 1200, 'focus', '40Hz Gamma', 'État de flux et insights créatifs', 40.00),
('Ocean Meditation', 'EmotionsCare Studio', 1800, 'meditation', '7.83Hz Schumann', 'Méditation guidée avec sons océaniques', 7.83),
('Forest Relaxation', 'EmotionsCare Studio', 2400, 'relaxation', '8Hz Alpha', 'Relaxation profonde avec sons de forêt', 8.00),
('Heart Coherence', 'EmotionsCare Studio', 1500, 'healing', '0.1Hz HRV', 'Cohérence cardiaque et équilibre émotionnel', 0.10)
ON CONFLICT DO NOTHING;