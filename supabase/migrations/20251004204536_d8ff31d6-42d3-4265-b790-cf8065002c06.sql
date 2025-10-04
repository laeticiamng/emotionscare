-- Table pour les sessions de respiration VR
CREATE TABLE IF NOT EXISTS public.breathing_vr_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern TEXT NOT NULL CHECK (pattern IN ('box', 'calm', '478', 'energy', 'coherence')),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
  cycles_completed INTEGER DEFAULT 0,
  average_pace NUMERIC,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  mood_before INTEGER CHECK (mood_before >= 0 AND mood_before <= 100),
  mood_after INTEGER CHECK (mood_after >= 0 AND mood_after <= 100),
  notes TEXT,
  vr_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_breathing_vr_sessions_user_id ON public.breathing_vr_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_breathing_vr_sessions_started_at ON public.breathing_vr_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_breathing_vr_sessions_pattern ON public.breathing_vr_sessions(pattern);

-- Enable RLS
ALTER TABLE public.breathing_vr_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view their own breathing VR sessions"
  ON public.breathing_vr_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can create their own breathing VR sessions"
  ON public.breathing_vr_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update their own breathing VR sessions"
  ON public.breathing_vr_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete their own breathing VR sessions"
  ON public.breathing_vr_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can manage all
CREATE POLICY "Service role can manage all breathing VR sessions"
  ON public.breathing_vr_sessions
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_breathing_vr_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_breathing_vr_sessions_updated_at
  BEFORE UPDATE ON public.breathing_vr_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_breathing_vr_sessions_updated_at();