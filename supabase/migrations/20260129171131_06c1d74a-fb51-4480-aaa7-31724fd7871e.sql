-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Durcissement RLS pwa_metrics
-- Nettoie les policies redondantes et corrige les failles
-- ═══════════════════════════════════════════════════════════

-- 1. Supprimer les policies redondantes et trop permissives
DROP POLICY IF EXISTS "pwa_metrics_insert_anon" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_update_own_session" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_select_public" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Allow select on own session" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can read pwa_metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_service_role" ON public.pwa_metrics;

-- 2. Garder uniquement les policies cohérentes:
-- - INSERT: user_id null OU = auth.uid()
-- - SELECT: user_id = auth.uid() OU user_id IS NULL
-- - UPDATE/DELETE: user_id = auth.uid()
-- - Service role: accès complet

-- Les policies conservées:
-- - pwa_metrics_insert_any (INSERT sécurisé)
-- - Users can view own PWA metrics (SELECT)
-- - Users can update own PWA metrics (UPDATE)
-- - Users can delete own PWA metrics (DELETE)
-- - Service role full access (service_role)