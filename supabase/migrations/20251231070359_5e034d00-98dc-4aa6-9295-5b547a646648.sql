-- Date: 20250630
-- Ticket: Meditation Module Complete
-- Migration: Add missing columns to meditation_sessions

-- Add missing columns to meditation_sessions
ALTER TABLE public.meditation_sessions
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_duration integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS with_guidance boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS with_music boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS mood_delta integer;

-- Create index for user queries
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_created
ON public.meditation_sessions(user_id, created_at DESC);

-- Create index for technique analysis
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_technique
ON public.meditation_sessions(technique);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_meditation_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_meditation_updated ON public.meditation_sessions;
CREATE TRIGGER trg_meditation_updated
BEFORE UPDATE ON public.meditation_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_meditation_updated_at();

-- Auto-calculate mood_delta trigger
CREATE OR REPLACE FUNCTION public.calc_meditation_mood_delta()
RETURNS trigger AS $$
BEGIN
  IF NEW.mood_before IS NOT NULL AND NEW.mood_after IS NOT NULL THEN
    NEW.mood_delta := NEW.mood_after - NEW.mood_before;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_meditation_mood ON public.meditation_sessions;
CREATE TRIGGER trg_meditation_mood
BEFORE INSERT OR UPDATE ON public.meditation_sessions
FOR EACH ROW EXECUTE FUNCTION public.calc_meditation_mood_delta();