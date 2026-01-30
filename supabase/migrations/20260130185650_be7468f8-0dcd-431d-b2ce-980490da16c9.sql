-- Fix pwa_metrics INSERT policy to require authentication OR allow anonymous inserts with user_id IS NULL
DROP POLICY IF EXISTS "pwa_metrics_insert_policy" ON public.pwa_metrics;

-- Allow authenticated users to insert their own metrics
-- Allow anonymous users to insert with user_id = NULL for PWA tracking before login
CREATE POLICY "pwa_metrics_insert_authenticated" 
ON public.pwa_metrics 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pwa_metrics_insert_anonymous" 
ON public.pwa_metrics 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);