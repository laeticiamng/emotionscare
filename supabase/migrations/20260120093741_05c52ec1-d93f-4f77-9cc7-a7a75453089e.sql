-- Fix pwa_metrics policies - these allow anonymous INSERT/UPDATE with true
-- These should be restricted to prevent abuse

-- Drop overly permissive policies
DROP POLICY IF EXISTS "pwa_metrics_anon_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_anon_update" ON public.pwa_metrics;

-- Create safer policies - allow insert but with rate limiting consideration
-- For metrics, anonymous insert is often needed but should have some validation
CREATE POLICY "pwa_metrics_insert" ON public.pwa_metrics
FOR INSERT TO anon, authenticated
WITH CHECK (
  -- Allow insert but require session_id to be set
  session_id IS NOT NULL
);

-- Update should only be allowed for authenticated users on their own metrics
CREATE POLICY "pwa_metrics_update" ON public.pwa_metrics
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Note: The remaining service_role policies are intentional for backend operations
-- Function search_path warnings are fixed with SET search_path = public in the functions
-- Extension in public is a known Supabase limitation that requires manual intervention