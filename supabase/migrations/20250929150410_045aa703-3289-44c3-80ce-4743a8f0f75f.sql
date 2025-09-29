-- CRITICAL SECURITY FIXES for EmotionsCare Platform (v2)
-- Fix customer data exposure and database security issues

-- 1. Fix RLS policies for abonnement_biovida table (CRITICAL)
-- Drop all existing policies first
DROP POLICY IF EXISTS "Service role can manage biovida subscriptions" ON public.abonnement_biovida;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.abonnement_biovida;
DROP POLICY IF EXISTS "Users can only access their own biovida subscription" ON public.abonnement_biovida;

-- Create secure user-scoped policy
CREATE POLICY "abonnement_biovida_user_access_only"
  ON public.abonnement_biovida
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = abonnement_biovida.email
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = abonnement_biovida.email
    )
  );

-- Service role read-only access (more secure than previous broad access)
CREATE POLICY "abonnement_biovida_service_read_only"
  ON public.abonnement_biovida
  FOR SELECT
  TO service_role
  USING (true);

-- 2. Fix Digital Medicine table RLS (currently has deny-all policy)
-- Drop existing policies
DROP POLICY IF EXISTS "Deny public access Digital Medicine" ON public."Digital Medicine";
DROP POLICY IF EXISTS "Service role full access Digital Medicine" ON public."Digital Medicine";

-- Create user-scoped access for Digital Medicine subscriptions
CREATE POLICY "digital_medicine_user_access_only"
  ON public."Digital Medicine"
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = "Digital Medicine".email
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = "Digital Medicine".email
    )
  );

-- Service role read-only access
CREATE POLICY "digital_medicine_service_read_only"
  ON public."Digital Medicine"
  FOR SELECT
  TO service_role
  USING (true);

-- 3. Enhance security for abonnement_fiches table
-- Drop existing broad policy
DROP POLICY IF EXISTS "Authenticated users can insert subscriptions" ON public.abonnement_fiches;
DROP POLICY IF EXISTS "Only backend can select data" ON public.abonnement_fiches;

-- Create user-scoped policies
CREATE POLICY "abonnement_fiches_user_insert"
  ON public.abonnement_fiches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = abonnement_fiches.email
    )
  );

CREATE POLICY "abonnement_fiches_user_select"
  ON public.abonnement_fiches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = abonnement_fiches.email
    )
  );

-- Service role access for backend operations
CREATE POLICY "abonnement_fiches_service_access"
  ON public.abonnement_fiches
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Create security audit table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text,
  record_id uuid,
  ip_address inet,
  user_agent text,
  severity text CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  finding_type text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create audit log policy
DROP POLICY IF EXISTS "Admin and service role can manage security audit logs" ON public.security_audit_log;
CREATE POLICY "security_audit_admin_service_access"
  ON public.security_audit_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    ) OR 
    (auth.jwt() ->> 'role') = 'service_role'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    ) OR 
    (auth.jwt() ->> 'role') = 'service_role'
  );

-- 5. Create security event logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL,
  p_severity text DEFAULT 'MEDIUM',
  p_finding_type text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    ip_address,
    severity,
    finding_type,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name, 
    p_record_id,
    inet_client_addr(),
    p_severity,
    p_finding_type,
    p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;