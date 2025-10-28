-- Migration sécurité finale simplifiée
-- Date: 2025-10-28

-- Sécuriser toutes les fonctions
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT DISTINCT p.proname::text as func_name
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname NOT LIKE 'pg_%'
  LOOP
    BEGIN
      EXECUTE format('ALTER FUNCTION public.%I SET search_path = public, pg_temp', func_record.func_name);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

-- Vue sécurisée profiles
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  CASE WHEN id = auth.uid() THEN email ELSE NULL END as email,
  CASE WHEN id = auth.uid() THEN phone ELSE NULL END as phone,
  name, avatar_url, bio, location, website, created_at
FROM public.profiles;

-- Table d'audit
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only" ON public.security_audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));