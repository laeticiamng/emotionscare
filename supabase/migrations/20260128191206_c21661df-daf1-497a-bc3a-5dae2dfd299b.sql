-- =====================================================
-- Migration: Fix has_sitemap_access to use profiles instead of auth.users
-- =====================================================

-- Fix the has_sitemap_access function to use public.profiles instead of auth.users
CREATE OR REPLACE FUNCTION public.has_sitemap_access(
  _user_id uuid, 
  _target_user_id uuid, 
  _min_permission text DEFAULT 'viewer'
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.has_sitemap_access(uuid, uuid, text) TO authenticated;

-- =====================================================
-- Fix any remaining permissive RLS policies
-- =====================================================

-- Check and fix overly permissive policies on key tables
-- Fix user_feedback if it has USING (true) for INSERT
DO $$
BEGIN
  -- Drop existing overly permissive policies if they exist
  DROP POLICY IF EXISTS "Allow public insert for user_feedback" ON public.user_feedback;
  DROP POLICY IF EXISTS "user_feedback_insert_policy" ON public.user_feedback;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Create proper user_feedback INSERT policy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_feedback' AND schemaname = 'public') THEN
    CREATE POLICY "user_feedback_insert_own" ON public.user_feedback 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL AND user_id IS NULL));
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;