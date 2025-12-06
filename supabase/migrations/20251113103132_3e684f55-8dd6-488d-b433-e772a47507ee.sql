-- Tables pour les parcours musicaux guidés "Journey"
CREATE TABLE IF NOT EXISTS public.music_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  emotion_start TEXT NOT NULL,
  emotion_target TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL DEFAULT 5,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.music_journey_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.music_journeys(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.generated_music_tracks(id) ON DELETE SET NULL,
  step_number INTEGER NOT NULL,
  emotion_level TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  played_at TIMESTAMP WITH TIME ZONE,
  emotion_after TEXT,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_journey_tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour music_journeys
CREATE POLICY "Users can view their own journeys" 
ON public.music_journeys FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journeys" 
ON public.music_journeys FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journeys" 
ON public.music_journeys FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journeys" 
ON public.music_journeys FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies pour music_journey_tracks
CREATE POLICY "Users can view tracks from their journeys" 
ON public.music_journey_tracks FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.music_journeys 
    WHERE music_journeys.id = music_journey_tracks.journey_id 
    AND music_journeys.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tracks in their journeys" 
ON public.music_journey_tracks FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.music_journeys 
    WHERE music_journeys.id = journey_id 
    AND music_journeys.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update tracks in their journeys" 
ON public.music_journey_tracks FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.music_journeys 
    WHERE music_journeys.id = journey_id 
    AND music_journeys.user_id = auth.uid()
  )
);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_music_journey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_music_journeys_updated_at
BEFORE UPDATE ON public.music_journeys
FOR EACH ROW
EXECUTE FUNCTION public.update_music_journey_updated_at();

-- Index pour performance
CREATE INDEX idx_music_journeys_user_id ON public.music_journeys(user_id);
CREATE INDEX idx_music_journeys_status ON public.music_journeys(status);
CREATE INDEX idx_music_journey_tracks_journey_id ON public.music_journey_tracks(journey_id);
CREATE INDEX idx_music_journey_tracks_step ON public.music_journey_tracks(step_number);