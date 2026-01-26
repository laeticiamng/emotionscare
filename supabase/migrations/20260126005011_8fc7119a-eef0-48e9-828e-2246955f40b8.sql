-- Suppression des policies trop permissives sur pwa_metrics
DROP POLICY IF EXISTS pwa_metrics_insert_policy ON public.pwa_metrics;
DROP POLICY IF EXISTS pwa_metrics_update_policy ON public.pwa_metrics;

-- Nouvelles policies sécurisées (user_id = auth.uid())
CREATE POLICY "pwa_metrics_insert_own"
ON public.pwa_metrics
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "pwa_metrics_update_own"
ON public.pwa_metrics
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());