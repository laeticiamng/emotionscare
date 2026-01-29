-- ============================================================================
-- SECURITY FIX: Durcissement RLS sur pwa_metrics
-- Corrige les politiques USING (true) identifiées par le linter
-- ============================================================================

-- Supprimer les anciennes politiques permissives
DROP POLICY IF EXISTS "Allow anonymous inserts for PWA tracking" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Allow updates on own session" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can insert PWA metrics" ON public.pwa_metrics;

-- Créer une fonction helper pour vérifier l'identité
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
$$;

-- Créer une fonction helper pour vérifier la propriété
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = resource_user_id OR auth.uid() IS NOT NULL AND resource_user_id IS NULL
$$;

-- Nouvelles politiques RLS sécurisées pour pwa_metrics
-- INSERT: Les utilisateurs authentifiés peuvent insérer avec leur user_id
CREATE POLICY "Authenticated users can insert own PWA metrics"
ON public.pwa_metrics
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- SELECT: Les utilisateurs peuvent voir leurs propres métriques
CREATE POLICY "Users can view own PWA metrics"
ON public.pwa_metrics
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

-- UPDATE: Les utilisateurs peuvent mettre à jour leurs propres métriques
CREATE POLICY "Users can update own PWA metrics"
ON public.pwa_metrics
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- DELETE: Les utilisateurs peuvent supprimer leurs propres métriques
CREATE POLICY "Users can delete own PWA metrics"
ON public.pwa_metrics
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Permettre l'accès service_role pour les opérations système
CREATE POLICY "Service role full access on PWA metrics"
ON public.pwa_metrics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- ADDITIONAL: Renforcer search_path sur les fonctions existantes
-- ============================================================================

-- S'assurer que has_role a le bon search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;