-- Migration: Durcir les RLS policies permissives
-- Tables concernées: pwa_metrics, user_feedback

-- 1. Supprimer les anciennes policies permissives sur pwa_metrics
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Allow public inserts" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_insert_policy" ON public.pwa_metrics;

-- 2. Créer une nouvelle policy sécurisée pour pwa_metrics
-- Permet l'insertion uniquement pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert their own pwa_metrics"
ON public.pwa_metrics
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id IS NULL OR auth.uid() = user_id)
);

-- 3. Policy de lecture - utilisateurs voient leurs propres métriques
CREATE POLICY "Users can read their own pwa_metrics"
ON public.pwa_metrics
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (user_id IS NULL OR auth.uid() = user_id)
);

-- 4. Supprimer les anciennes policies permissives sur user_feedback
DROP POLICY IF EXISTS "Allow anonymous feedback inserts" ON public.user_feedback;
DROP POLICY IF EXISTS "Allow public feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_insert_policy" ON public.user_feedback;

-- 5. Créer une nouvelle policy sécurisée pour user_feedback
CREATE POLICY "Authenticated users can submit feedback"
ON public.user_feedback
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- 6. Policy de lecture - utilisateurs voient leur propre feedback
CREATE POLICY "Users can read their own feedback"
ON public.user_feedback
FOR SELECT
USING (auth.uid() = user_id);

-- 7. Ajouter un commentaire pour documentation
COMMENT ON TABLE public.pwa_metrics IS 'PWA performance metrics - RLS hardened 2026-02-04';
COMMENT ON TABLE public.user_feedback IS 'User feedback submissions - RLS hardened 2026-02-04';