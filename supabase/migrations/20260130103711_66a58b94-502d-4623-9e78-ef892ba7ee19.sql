-- Fix RLS policy for pwa_metrics to allow anonymous and authenticated inserts
-- The current policy has no WITH CHECK clause which causes inserts to fail

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "pwa_metrics_insert_policy" ON public.pwa_metrics;

-- Recreate with proper WITH CHECK clause that allows anonymous and authenticated users
CREATE POLICY "pwa_metrics_insert_policy" 
ON public.pwa_metrics 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Add a comment explaining the policy
COMMENT ON POLICY "pwa_metrics_insert_policy" ON public.pwa_metrics IS 'Allow anonymous and authenticated users to insert PWA metrics for analytics purposes';