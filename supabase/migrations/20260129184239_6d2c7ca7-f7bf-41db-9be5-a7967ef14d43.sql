-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ AUDIT FIX: Correction des erreurs RLS pwa_metrics                        ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- 1. Ajouter une policy INSERT pour pwa_metrics (permet aux utilisateurs authentifiés)
DROP POLICY IF EXISTS "Users can insert own pwa metrics" ON public.pwa_metrics;
CREATE POLICY "Users can insert own pwa metrics"
ON public.pwa_metrics
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);

-- 2. Ajouter une policy INSERT pour les utilisateurs anonymes (métriques PWA génériques)
DROP POLICY IF EXISTS "Anonymous can insert anonymous pwa metrics" ON public.pwa_metrics;
CREATE POLICY "Anonymous can insert anonymous pwa metrics"
ON public.pwa_metrics
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
);

-- 3. Policy SELECT pour que les utilisateurs voient leurs propres métriques
DROP POLICY IF EXISTS "Users can view own pwa metrics" ON public.pwa_metrics;
CREATE POLICY "Users can view own pwa metrics"
ON public.pwa_metrics
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

-- 4. Vérifier que RLS est activé
ALTER TABLE public.pwa_metrics ENABLE ROW LEVEL SECURITY;