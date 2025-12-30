-- Create user_scores table for storing weekly score snapshots
CREATE TABLE IF NOT EXISTS public.user_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotional_score INTEGER NOT NULL DEFAULT 50 CHECK (emotional_score >= 0 AND emotional_score <= 100),
  wellbeing_score INTEGER NOT NULL DEFAULT 50 CHECK (wellbeing_score >= 0 AND wellbeing_score <= 100),
  engagement_score INTEGER NOT NULL DEFAULT 50 CHECK (engagement_score >= 0 AND engagement_score <= 100),
  resilience_score INTEGER DEFAULT 50 CHECK (resilience_score >= 0 AND resilience_score <= 100),
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
  year INTEGER NOT NULL CHECK (year >= 2024),
  components JSONB DEFAULT '{}',
  insights JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number, year)
);

-- Create user_vibes table for storing current vibes
CREATE TABLE IF NOT EXISTS public.user_vibes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vibe_type TEXT NOT NULL DEFAULT 'neutral',
  intensity INTEGER NOT NULL DEFAULT 50 CHECK (intensity >= 0 AND intensity <= 100),
  duration_hours NUMERIC DEFAULT 0,
  contributing_factors JSONB DEFAULT '[]',
  recent_activities TEXT[] DEFAULT '{}',
  recommended_modules TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create daily_mood_heatmap for heatmap visualization
CREATE TABLE IF NOT EXISTS public.daily_mood_heatmap (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  hour INTEGER CHECK (hour >= 0 AND hour <= 23),
  mood_score INTEGER CHECK (mood_score >= 0 AND mood_score <= 100),
  activity_count INTEGER DEFAULT 0,
  dominant_emotion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, hour)
);

-- Enable RLS
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_mood_heatmap ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_scores
CREATE POLICY "Users can view their own scores" 
ON public.user_scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" 
ON public.user_scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores" 
ON public.user_scores FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for user_vibes
CREATE POLICY "Users can view their own vibes" 
ON public.user_vibes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vibes" 
ON public.user_vibes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vibes" 
ON public.user_vibes FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for daily_mood_heatmap
CREATE POLICY "Users can view their own heatmap" 
ON public.daily_mood_heatmap FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own heatmap data" 
ON public.daily_mood_heatmap FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own heatmap data" 
ON public.daily_mood_heatmap FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id ON public.user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_week_year ON public.user_scores(year DESC, week_number DESC);
CREATE INDEX IF NOT EXISTS idx_user_vibes_user_id ON public.user_vibes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vibes_created_at ON public.user_vibes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_mood_heatmap_user_date ON public.daily_mood_heatmap(user_id, date DESC);

-- Add update trigger for user_scores
CREATE OR REPLACE FUNCTION public.update_user_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_scores_timestamp
BEFORE UPDATE ON public.user_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_user_scores_updated_at();