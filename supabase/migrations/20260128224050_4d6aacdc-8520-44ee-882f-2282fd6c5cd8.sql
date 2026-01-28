
-- =============================================
-- FIX: pwa_metrics RLS policy pour permettre les insertions anonymes
-- =============================================

-- Supprimer la policy existante
DROP POLICY IF EXISTS "pwa_metrics_insert_all" ON public.pwa_metrics;

-- Recréer avec une condition plus permissive pour les métriques anonymes
CREATE POLICY "pwa_metrics_insert_all" ON public.pwa_metrics
FOR INSERT TO public
WITH CHECK (
  -- Cas 1: Utilisateur anonyme avec user_id NULL
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- Cas 2: Utilisateur authentifié insérant ses propres données
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Cas 3: Utilisateur authentifié insérant sans user_id (metrics système)
  (auth.uid() IS NOT NULL AND user_id IS NULL)
);

-- =============================================
-- Corriger la policy SELECT pour cohérence
-- =============================================
DROP POLICY IF EXISTS "pwa_metrics_anon_select_own" ON public.pwa_metrics;

CREATE POLICY "pwa_metrics_select" ON public.pwa_metrics
FOR SELECT TO public
USING (
  user_id IS NULL 
  OR auth.uid() = user_id
);
