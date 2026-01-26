-- Fix RLS policy for pwa_metrics table (preventing INSERT errors in logs)
-- Drop existing overly restrictive policy if exists
DROP POLICY IF EXISTS "Users can insert own metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_insert_policy" ON public.pwa_metrics;

-- Create proper INSERT policy that allows authenticated users to insert their own metrics
CREATE POLICY "pwa_metrics_authenticated_insert" 
ON public.pwa_metrics 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create proper SELECT policy  
DROP POLICY IF EXISTS "Users can view own metrics" ON public.pwa_metrics;
CREATE POLICY "pwa_metrics_authenticated_select"
ON public.pwa_metrics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow service_role full access for backend operations
DROP POLICY IF EXISTS "Service role full access" ON public.pwa_metrics;
CREATE POLICY "pwa_metrics_service_role_all"
ON public.pwa_metrics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);