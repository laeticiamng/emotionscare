-- =====================================================
-- MIGRATION: Renforcement sécurité EmotionsCare
-- =====================================================

-- 1. Révoquer l'accès API aux vues matérialisées pour éviter exposition de données
REVOKE ALL ON public.dashboard_stats_cache FROM anon, authenticated;
REVOKE ALL ON public.user_weekly_dashboard FROM anon, authenticated;
REVOKE ALL ON public.edn_items_unified FROM anon, authenticated;

-- 2. Sécuriser les fonctions existantes avec search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 3. S'assurer que les triggers utilisent des fonctions sécurisées
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Créer une table de rôles utilisateur si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Fonction sécurisée pour vérifier les rôles (évite récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
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
      AND role = _role
  );
$$;

-- 6. Politiques RLS pour user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Fonction pour obtenir le rôle actuel de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    'user'
  );
$$;

-- 8. Fonction sécurisée pour accéder au dashboard de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(p_user_id uuid)
RETURNS TABLE (
  journal_count bigint,
  meditation_count bigint,
  chat_count bigint,
  last_activity_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    journal_count,
    meditation_count,
    chat_count,
    last_activity_at
  FROM public.dashboard_stats_cache
  WHERE user_id = p_user_id
  LIMIT 1;
$$;