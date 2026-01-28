-- Fix pwa_metrics insert policy for anonymous users

-- Drop existing conflicting policies
DROP POLICY IF EXISTS pwa_metrics_insert_policy ON public.pwa_metrics;
DROP POLICY IF EXISTS pwa_metrics_anon_insert ON public.pwa_metrics;

-- Create a single insert policy that properly handles both anon and authenticated
CREATE POLICY pwa_metrics_insert_all ON public.pwa_metrics
FOR INSERT TO public
WITH CHECK (
  -- Anonymous users can only insert with null user_id
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- Authenticated users can insert their own data
  (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
);

-- Grant INSERT to both anon and authenticated
GRANT INSERT ON public.pwa_metrics TO anon;
GRANT INSERT ON public.pwa_metrics TO authenticated;