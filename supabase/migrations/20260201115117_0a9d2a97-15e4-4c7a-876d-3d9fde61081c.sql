-- ═══════════════════════════════════════════════════════════════
-- RLS Hardening & Security Fixes (Simplified)
-- Addresses: function_search_path_mutable, permissive_rls_policy
-- ═══════════════════════════════════════════════════════════════

-- 1. Fix function search_path for SECURITY DEFINER functions
-- Re-create is_authenticated helper
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
$$;

-- Re-create is_owner helper
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = resource_user_id
$$;

-- Re-create update_updated_at_column with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix permissive RLS policies on sensitive tables

-- Fix user_feedback: require authenticated user
DROP POLICY IF EXISTS "Allow anonymous feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can insert feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.user_feedback;

CREATE POLICY "Authenticated users can insert feedback"
ON public.user_feedback
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Fix pwa_metrics: require authenticated user for insert
DROP POLICY IF EXISTS "Allow anonymous metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Anyone can insert pwa metrics" ON public.pwa_metrics;
DROP POLICY IF EXISTS "Authenticated users can insert pwa metrics" ON public.pwa_metrics;

CREATE POLICY "Authenticated users can insert pwa metrics"
ON public.pwa_metrics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Fix user_settings RLS
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;

CREATE POLICY "Users can update own settings"
ON public.user_settings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);