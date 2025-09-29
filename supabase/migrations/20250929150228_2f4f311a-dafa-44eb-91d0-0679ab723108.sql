-- CRITICAL SECURITY FIXES for EmotionsCare Platform
-- Fix customer data exposure and database security issues

-- 1. Fix RLS policies for abonnement_biovida table (CRITICAL)
-- Current policy allows service_role access which may be too broad
DROP POLICY IF EXISTS "Service role can manage biovida subscriptions" ON public.abonnement_biovida;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.abonnement_biovida;

-- Create more restrictive policies for customer data protection
CREATE POLICY "Users can only access their own biovida subscription"
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

-- Service role access only for specific operations (more secure)
CREATE POLICY "Service role limited access biovida"
  ON public.abonnement_biovida
  FOR SELECT
  TO service_role
  USING (true);

-- 2. Fix Digital Medicine table RLS (currently has deny-all policy)
-- Create user-scoped access for Digital Medicine subscriptions
CREATE POLICY "Users can manage their own digital medicine subscription"
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

-- 3. Enhance security for abonnement_fiches table
-- Current policy allows any authenticated user to insert - make it more restrictive
DROP POLICY IF EXISTS "Authenticated users can insert subscriptions" ON public.abonnement_fiches;

CREATE POLICY "Users can insert their own fiches subscription"
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

-- Allow users to read their own subscriptions
CREATE POLICY "Users can read their own fiches subscription"
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

-- 4. Fix security definer functions - set proper search paths
-- Update existing functions to have secure search paths
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_organization_role(org_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT role FROM public.org_memberships 
  WHERE org_memberships.org_id = get_user_organization_role.org_id 
  AND org_memberships.user_id = auth.uid();
$$;

-- 5. Add audit logging for sensitive operations
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

-- Only admins and service role can access audit logs
CREATE POLICY "Admin and service role can manage security audit logs"
  ON public.security_audit_log
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR 
    (auth.jwt() ->> 'role') = 'service_role'
  )
  WITH CHECK (
    public.is_admin() OR 
    (auth.jwt() ->> 'role') = 'service_role'
  );

-- 6. Create function to log security events
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

-- 7. Add triggers for sensitive table access monitoring
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Log access to sensitive subscription tables
  IF TG_TABLE_NAME IN ('abonnement_biovida', 'abonnement_fiches', 'Digital Medicine') THEN
    PERFORM public.log_security_event(
      TG_OP || '_' || TG_TABLE_NAME,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      'HIGH',
      'sensitive_data_access',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'user_id', auth.uid()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_abonnement_biovida ON public.abonnement_biovida;
CREATE TRIGGER audit_abonnement_biovida
  AFTER INSERT OR UPDATE OR DELETE ON public.abonnement_biovida
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_abonnement_fiches ON public.abonnement_fiches;
CREATE TRIGGER audit_abonnement_fiches
  AFTER INSERT OR UPDATE OR DELETE ON public.abonnement_fiches
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_digital_medicine ON public."Digital Medicine";
CREATE TRIGGER audit_digital_medicine
  AFTER INSERT OR UPDATE OR DELETE ON public."Digital Medicine"
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();