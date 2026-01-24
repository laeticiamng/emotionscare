-- =====================================================
-- CORRECTION RLS PERMISSIF - SÉCURITÉ RGPD (PARTIE 2)
-- Ajouter les politiques SELECT sécurisées
-- =====================================================

-- pwa_metrics: SELECT par le propriétaire
DROP POLICY IF EXISTS "pwa_metrics_owner_select" ON public.pwa_metrics;
CREATE POLICY "pwa_metrics_owner_select" 
ON public.pwa_metrics 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- user_feedback: SELECT par le propriétaire
DROP POLICY IF EXISTS "user_feedback_owner_select" ON public.user_feedback;
CREATE POLICY "user_feedback_owner_select" 
ON public.user_feedback 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- user_settings: SELECT par le propriétaire
DROP POLICY IF EXISTS "user_settings_owner_select" ON public.user_settings;
CREATE POLICY "user_settings_owner_select" 
ON public.user_settings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);