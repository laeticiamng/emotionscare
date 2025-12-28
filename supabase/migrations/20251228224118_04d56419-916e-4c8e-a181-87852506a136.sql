-- Table pour le module SEUIL (Threshold)
-- Enregistre les événements de détection de décrochage émotionnel

CREATE TABLE public.seuil_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  threshold_level INTEGER NOT NULL CHECK (threshold_level >= 0 AND threshold_level <= 100),
  zone TEXT NOT NULL CHECK (zone IN ('low', 'intermediate', 'critical', 'closure')),
  action_taken TEXT,
  action_type TEXT CHECK (action_type IN ('3min', '5min_guided', 'change_activity', 'postpone', 'stop_today', 'close_day', NULL)),
  session_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seuil_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies - User can only see their own events
CREATE POLICY "Users can view their own seuil events"
ON public.seuil_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seuil events"
ON public.seuil_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seuil events"
ON public.seuil_events
FOR UPDATE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_seuil_events_user_id ON public.seuil_events(user_id);
CREATE INDEX idx_seuil_events_created_at ON public.seuil_events(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_seuil_events_updated_at
BEFORE UPDATE ON public.seuil_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.seuil_events;