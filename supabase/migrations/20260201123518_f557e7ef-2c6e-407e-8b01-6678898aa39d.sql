-- ============================================================================
-- SECURITY HARDENING: Fix remaining auth.users references
-- ============================================================================

-- 1. Replace has_sitemap_access with profiles reference
CREATE OR REPLACE FUNCTION public.has_sitemap_access(
  _user_id uuid, 
  _target_user_id uuid, 
  _min_permission share_permission DEFAULT 'viewer'::share_permission
)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Owner always has access
  IF _user_id = _target_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has been granted access via shares
  -- Use public.profiles instead of auth.users for email lookup
  RETURN EXISTS (
    SELECT 1
    FROM public.sitemap_shares ss
    LEFT JOIN public.profiles p ON p.id = _user_id
    WHERE ss.owner_id = _target_user_id
      AND (ss.shared_with_user_id = _user_id OR ss.shared_with_email = p.email)
      AND (
        CASE _min_permission
          WHEN 'viewer' THEN ss.permission IN ('viewer', 'editor', 'admin')
          WHEN 'editor' THEN ss.permission IN ('editor', 'admin')
          WHEN 'admin' THEN ss.permission = 'admin'
          ELSE FALSE
        END
      )
  );
END;
$$;

-- 2. Fix get_user_role_history function to avoid auth.users
CREATE OR REPLACE FUNCTION public.get_user_role_history(_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  action text,
  role text,
  old_role text,
  new_role text,
  changed_by uuid,
  changed_by_email text,
  changed_at timestamptz,
  metadata jsonb
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ral.id,
    ral.user_id,
    ral.action,
    ral.role,
    ral.old_role,
    ral.new_role,
    ral.changed_by,
    p.email::text as changed_by_email,
    ral.changed_at,
    ral.metadata
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p ON ral.changed_by = p.id
  WHERE ral.user_id = _user_id
  ORDER BY ral.changed_at DESC
  LIMIT 100;
END;
$$;

-- 3. Fix get_all_role_changes function to avoid auth.users
CREATE OR REPLACE FUNCTION public.get_all_role_changes(_limit integer DEFAULT 100)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  user_email text,
  action text,
  role text,
  old_role text,
  new_role text,
  changed_by uuid,
  changed_by_email text,
  changed_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ral.id,
    ral.user_id,
    p1.email::text as user_email,
    ral.action,
    ral.role,
    ral.old_role,
    ral.new_role,
    ral.changed_by,
    p2.email::text as changed_by_email,
    ral.changed_at
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p1 ON ral.user_id = p1.id
  LEFT JOIN public.profiles p2 ON ral.changed_by = p2.id
  ORDER BY ral.changed_at DESC
  LIMIT _limit;
END;
$$;

-- 4. Add index for performance on profiles.email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 5. Add comment for documentation
COMMENT ON FUNCTION public.has_sitemap_access(uuid, uuid, share_permission) IS 'Checks if a user has access to another users sitemap - uses profiles table instead of auth.users for security compliance';