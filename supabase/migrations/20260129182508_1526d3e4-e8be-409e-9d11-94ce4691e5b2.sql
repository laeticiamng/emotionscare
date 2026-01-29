-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ SECURITY HARDENING: Suppression des policies "USING(true)" dangereuses   ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- 1. Supprimer les anciennes policies permissives dangereuses sur pwa_metrics
DROP POLICY IF EXISTS "Anyone can insert pwa metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can update pwa metrics by session" ON public.pwa_metrics;

-- 2. Fonction utilitaire SECURITY DEFINER pour récupérer le profil (utilise 'name' pas 'full_name')
CREATE OR REPLACE FUNCTION public.get_profile_by_user_id(p_user_id uuid)
RETURNS TABLE(id uuid, name text, avatar_url text, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.avatar_url,
    p.email
  FROM public.profiles p
  WHERE p.id = p_user_id;
$$;

-- 3. Fonction pour vérifier si l'utilisateur est propriétaire
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = resource_user_id;
$$;

-- 4. Fonction pour vérifier si l'utilisateur est authentifié
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- 5. Ajouter des indexes pour optimiser les requêtes RLS fréquentes
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_user_id ON public.pwa_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_session_id ON public.pwa_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 6. Commentaires de documentation
COMMENT ON FUNCTION public.get_profile_by_user_id IS 'Récupère un profil de manière sécurisée sans accéder à auth.users';
COMMENT ON FUNCTION public.is_owner IS 'Vérifie si l''utilisateur courant est propriétaire de la ressource';
COMMENT ON FUNCTION public.is_authenticated IS 'Vérifie si l''utilisateur est authentifié';