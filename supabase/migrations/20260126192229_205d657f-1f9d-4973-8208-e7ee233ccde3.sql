-- Fix service_role permissive RLS policy on pwa_metrics
-- The service_role policy with USING(true)/WITH CHECK(true) triggered linter warning
-- Replace with a more explicit approach

DROP POLICY IF EXISTS "pwa_metrics_service_role_all" ON public.pwa_metrics;

-- Service role doesn't need explicit RLS policies - it bypasses RLS by default
-- So we just need authenticated user policies which we already created

-- Fix any other permissive policies that may exist
-- Check and fix common tables that might have permissive INSERT/UPDATE/DELETE policies

-- Create helper function with proper search_path for RLS checks
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
$$;

CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = resource_user_id
$$;

-- Ensure has_role function has proper search_path
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
  )
$$;