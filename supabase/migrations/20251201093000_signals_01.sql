-- Migration: SIGNALS-01 - Clinical orchestration signals table
-- Ensures the clinical_signals table exists with the expected structure
-- and owner-based row level security policies.

-- Create table if it does not yet exist
CREATE TABLE IF NOT EXISTS public.clinical_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_instrument TEXT NOT NULL,
  domain TEXT NOT NULL,
  level INTEGER NOT NULL,
  module_context TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backfill defaults and adjust existing schema if the table was created previously
ALTER TABLE public.clinical_signals
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ALTER COLUMN metadata SET DEFAULT '{}'::jsonb,
  ALTER COLUMN metadata SET NOT NULL,
  ALTER COLUMN module_context SET NOT NULL,
  ALTER COLUMN level SET NOT NULL,
  ALTER COLUMN domain SET NOT NULL,
  ALTER COLUMN source_instrument SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN expires_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

-- Remove legacy columns no longer used
ALTER TABLE public.clinical_signals
  DROP COLUMN IF EXISTS window_type;

-- Ensure row level security is enabled
ALTER TABLE public.clinical_signals ENABLE ROW LEVEL SECURITY;

-- Recreate policies to guarantee owner-level access control
DROP POLICY IF EXISTS "signals_select_own" ON public.clinical_signals;
DROP POLICY IF EXISTS "signals_manage_own" ON public.clinical_signals;
DROP POLICY IF EXISTS "signals_service_access" ON public.clinical_signals;

CREATE POLICY "signals_select_own" ON public.clinical_signals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "signals_manage_own" ON public.clinical_signals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "signals_service_access" ON public.clinical_signals
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Helpful indexes for retrieving active signals
CREATE INDEX IF NOT EXISTS idx_clinical_signals_user_expires
  ON public.clinical_signals(user_id, expires_at);

CREATE INDEX IF NOT EXISTS idx_clinical_signals_context
  ON public.clinical_signals(module_context);
