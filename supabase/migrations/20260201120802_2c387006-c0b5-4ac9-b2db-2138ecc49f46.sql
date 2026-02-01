-- =====================================================
-- MIGRATION: Hardening RLS & Security (Safe Update)
-- Date: 2026-02-01
-- Uses CREATE OR REPLACE to preserve dependencies
-- =====================================================

-- 1. Update security helper functions with proper search_path (no DROP)
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Update has_role with proper search_path (preserves existing signature)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = _role
  )
$$;

-- 2. Fix update_updated_at_column with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Harden pwa_metrics policies
DROP POLICY IF EXISTS "pwa_metrics_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_secure_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_anon_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_owner_select" ON public.pwa_metrics;

CREATE POLICY "pwa_metrics_owner_insert" ON public.pwa_metrics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "pwa_metrics_owner_select" ON public.pwa_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Harden user_feedback policies
DROP POLICY IF EXISTS "user_feedback_insert" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_anon_insert" ON public.user_feedback;
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_authenticated_insert" ON public.user_feedback;
DROP POLICY IF EXISTS "user_feedback_owner_select" ON public.user_feedback;

CREATE POLICY "user_feedback_authenticated_insert" ON public.user_feedback
  FOR INSERT WITH CHECK (public.is_authenticated());

CREATE POLICY "user_feedback_owner_select" ON public.user_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Harden user_settings policies
DROP POLICY IF EXISTS "user_settings_select" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_insert" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_update" ON public.user_settings;
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
DROP POLICY IF EXISTS "user_settings_owner_all" ON public.user_settings;

CREATE POLICY "user_settings_owner_all" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_pwa_metrics_user_id ON public.pwa_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);