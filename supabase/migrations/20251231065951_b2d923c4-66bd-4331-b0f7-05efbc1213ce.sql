-- Date: 20250630
-- Ticket: VR Module Complete - Add missing columns
-- Migration: Complete VR nebula sessions schema

-- Add missing columns to vr_nebula_sessions
ALTER TABLE public.vr_nebula_sessions
ADD COLUMN IF NOT EXISTS scene text DEFAULT 'galaxy',
ADD COLUMN IF NOT EXISTS breathing_pattern text DEFAULT 'coherence',
ADD COLUMN IF NOT EXISTS cycles_completed integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS vr_mode boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vr_nebula_user_created
ON public.vr_nebula_sessions(user_id, created_at DESC);

-- Add RLS policies for user access if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vr_nebula_sessions' AND policyname = 'Users can view own sessions'
  ) THEN
    CREATE POLICY "Users can view own sessions" 
    ON public.vr_nebula_sessions
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vr_nebula_sessions' AND policyname = 'Users can insert own sessions'
  ) THEN
    CREATE POLICY "Users can insert own sessions" 
    ON public.vr_nebula_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vr_nebula_sessions' AND policyname = 'Users can update own sessions'
  ) THEN
    CREATE POLICY "Users can update own sessions" 
    ON public.vr_nebula_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_vr_nebula_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_vr_nebula_updated ON public.vr_nebula_sessions;
CREATE TRIGGER trg_vr_nebula_updated
BEFORE UPDATE ON public.vr_nebula_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_vr_nebula_updated_at();