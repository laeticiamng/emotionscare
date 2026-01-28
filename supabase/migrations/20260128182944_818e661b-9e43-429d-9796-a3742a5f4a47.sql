-- Drop and recreate functions that access auth.users

-- 1. Drop and recreate get_all_role_audit_logs
DROP FUNCTION IF EXISTS public.get_all_role_audit_logs(integer, integer);

CREATE FUNCTION public.get_all_role_audit_logs(
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_email text,
  role text,
  action text,
  performed_by uuid,
  performed_by_email text,
  reason text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ral.id,
    ral.user_id,
    COALESCE(p.email, 'Unknown') as user_email,
    ral.role::text,
    ral.action,
    ral.performed_by,
    COALESCE(pb.email, 'System') as performed_by_email,
    ral.reason,
    ral.created_at
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p ON ral.user_id = p.id
  LEFT JOIN public.profiles pb ON ral.performed_by = pb.id
  ORDER BY ral.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 2. Drop and recreate get_user_role_audit_history
DROP FUNCTION IF EXISTS public.get_user_role_audit_history(uuid, integer);

CREATE FUNCTION public.get_user_role_audit_history(
  p_user_id uuid,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  role text,
  action text,
  performed_by uuid,
  performed_by_email text,
  reason text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ral.id,
    ral.role::text,
    ral.action,
    ral.performed_by,
    COALESCE(p.email, 'System') as performed_by_email,
    ral.reason,
    ral.created_at
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p ON ral.performed_by = p.id
  WHERE ral.user_id = p_user_id
  ORDER BY ral.created_at DESC
  LIMIT p_limit;
END;
$$;

-- 3. Fix has_sitemap_access
CREATE OR REPLACE FUNCTION public.has_sitemap_access(p_user_id uuid, p_sitemap_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_is_owner boolean;
  v_is_shared boolean;
  v_user_email text;
BEGIN
  -- Get user email from profiles
  SELECT email INTO v_user_email
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Check if owner
  SELECT EXISTS (
    SELECT 1 FROM public.sitemaps
    WHERE id = p_sitemap_id AND user_id = p_user_id
  ) INTO v_is_owner;
  
  IF v_is_owner THEN
    RETURN true;
  END IF;
  
  -- Check if shared
  SELECT EXISTS (
    SELECT 1 FROM public.sitemap_shares
    WHERE sitemap_id = p_sitemap_id 
    AND (shared_with_user_id = p_user_id OR shared_with_email = v_user_email)
  ) INTO v_is_shared;
  
  RETURN v_is_shared;
END;
$$;