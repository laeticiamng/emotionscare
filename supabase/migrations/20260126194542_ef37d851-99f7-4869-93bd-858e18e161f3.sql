
-- =========================================
-- AUDIT CORRECTION - 2026-01-26 Final Fix
-- =========================================

-- 1. Nettoyer les policies dupliquées sur pwa_metrics
DROP POLICY IF EXISTS "pwa_metrics_insert_own" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_select" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_update" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_update_own" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_authenticated_update" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_authenticated_delete" ON public.pwa_metrics;

-- 2. Add UPDATE policy for authenticated users
CREATE POLICY "pwa_metrics_authenticated_update"
ON public.pwa_metrics
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Create DELETE policy for authenticated users
CREATE POLICY "pwa_metrics_authenticated_delete"
ON public.pwa_metrics
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
