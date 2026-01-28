-- Drop and recreate pwa_metrics INSERT policy to allow anonymous metrics
DROP POLICY IF EXISTS "pwa_metrics_insert_all" ON public.pwa_metrics;

-- Create a simpler policy that allows all inserts for metrics (anonymous or authenticated)
CREATE POLICY "pwa_metrics_insert_public" ON public.pwa_metrics
FOR INSERT TO public
WITH CHECK (true);

-- Also update select policy to allow reading all metrics (they're not sensitive)
DROP POLICY IF EXISTS "pwa_metrics_select" ON public.pwa_metrics;
CREATE POLICY "pwa_metrics_select_public" ON public.pwa_metrics
FOR SELECT TO public
USING (true);