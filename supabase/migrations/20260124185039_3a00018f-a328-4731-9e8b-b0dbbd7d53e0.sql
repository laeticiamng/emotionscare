-- =====================================================
-- CORRECTION RLS PERMISSIF - SÉCURITÉ RGPD (FINAL)
-- Supprimer les anciennes politiques et créer des sécurisées
-- =====================================================

-- 1. pwa_metrics: Supprimer anciennes politiques permissives
DROP POLICY IF EXISTS "pwa_metrics_insert_anon" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_update_own" ON public.pwa_metrics;

-- 2. pwa_metrics: Créer nouvelles politiques sécurisées
CREATE POLICY "pwa_metrics_authenticated_insert" 
ON public.pwa_metrics 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "pwa_metrics_owner_update" 
ON public.pwa_metrics 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. user_feedback: Supprimer ancienne politique permissive
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.user_feedback;

-- 4. user_feedback: Créer politique sécurisée
CREATE POLICY "user_feedback_authenticated_insert" 
ON public.user_feedback 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. user_settings: Supprimer anciennes politiques permissives
DROP POLICY IF EXISTS "user_settings_public_insert" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_public_update" ON public.user_settings;

-- 6. user_settings: Créer nouvelles politiques sécurisées
CREATE POLICY "user_settings_authenticated_insert" 
ON public.user_settings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_settings_owner_update" 
ON public.user_settings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);