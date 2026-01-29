-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Nettoyage final RLS pwa_metrics
-- Supprime les policies redondantes pour éviter la confusion
-- ═══════════════════════════════════════════════════════════

-- 1. Supprimer TOUTES les policies existantes pour repartir propre
DROP POLICY IF EXISTS "Service role full access on PWA metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Service role full access to pwa_metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Users can view their own PWA metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Users can view own PWA metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Users can update own PWA metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Users can delete own PWA metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_select" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_update" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_authenticated_delete" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_authenticated_update" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_select_own" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_select_service" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_insert_any" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_service_role_all" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_secure_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_secure_select" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_secure_update" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_secure_delete" ON public.pwa_metrics;

-- 2. Recréer des policies propres et non redondantes

-- Policy pour INSERT (anonymous ou authenticated)
CREATE POLICY "pwa_metrics_secure_insert"
ON public.pwa_metrics
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL) 
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Policy pour SELECT (owner only + anonymous records)
CREATE POLICY "pwa_metrics_secure_select"
ON public.pwa_metrics
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR user_id IS NULL
);

-- Policy pour UPDATE (owner only)
CREATE POLICY "pwa_metrics_secure_update"
ON public.pwa_metrics
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy pour DELETE (owner only)
CREATE POLICY "pwa_metrics_secure_delete"
ON public.pwa_metrics
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 3. Policy service_role (accès complet pour analytics backend)
CREATE POLICY "pwa_metrics_service_role_all"
ON public.pwa_metrics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);