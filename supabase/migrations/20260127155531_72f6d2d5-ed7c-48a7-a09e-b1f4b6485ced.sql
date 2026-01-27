-- Fix pwa_metrics RLS to allow anonymous users to insert metrics
-- The user_id is nullable so we need to handle anonymous sessions

-- Drop existing INSERT policy that requires auth
DROP POLICY IF EXISTS "pwa_metrics_authenticated_insert" ON public.pwa_metrics;

-- Create new INSERT policy that allows both authenticated and anonymous inserts
-- For authenticated users: user_id must match auth.uid() OR be null
-- For anonymous users: user_id must be null
CREATE POLICY "pwa_metrics_insert_policy"
  ON public.pwa_metrics
  FOR INSERT
  WITH CHECK (
    user_id IS NULL 
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

-- Add policy for anonymous SELECT (for analytics dashboards that don't need user data)
CREATE POLICY "pwa_metrics_anon_select_own"
  ON public.pwa_metrics
  FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Drop old select policy if exists and recreate
DROP POLICY IF EXISTS "pwa_metrics_authenticated_select" ON public.pwa_metrics;

-- Create index for performance on session lookups
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_session_id ON public.pwa_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_created_at ON public.pwa_metrics(created_at DESC);