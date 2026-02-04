-- Migration corrective: DROP existantes avant CREATE
DROP POLICY IF EXISTS "user_feedback_authenticated_insert" ON public.user_feedback;
DROP POLICY IF EXISTS "pwa_metrics_authenticated_insert" ON public.pwa_metrics;

-- Recréer les policies corrigées
CREATE POLICY "pwa_metrics_authenticated_insert"
ON public.pwa_metrics
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (user_id IS NULL)
);

CREATE POLICY "user_feedback_authenticated_insert"
ON public.user_feedback
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_user_id ON public.pwa_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);