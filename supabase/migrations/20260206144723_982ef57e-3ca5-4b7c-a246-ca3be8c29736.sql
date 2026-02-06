
-- FIX CRITIQUE: security_event_trigger insère des colonnes inexistantes dans security_audit_log
-- Colonnes réelles: id, audit_type, severity, location, finding_type, description, 
--                   sensitive_data_hash, action_taken, audited_by, created_at, resolved_at, metadata

-- Option: Recréer la fonction avec les bonnes colonnes
CREATE OR REPLACE FUNCTION public.security_event_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Log security events using actual columns of security_audit_log
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME IN ('profiles', 'biovida_analyses') THEN
        INSERT INTO public.security_audit_log (
            audit_type,
            severity,
            location,
            finding_type,
            description,
            action_taken,
            audited_by,
            metadata,
            created_at
        ) VALUES (
            'DATA_ACCESS',
            'INFO',
            TG_TABLE_NAME,
            TG_OP,
            'New record created in ' || TG_TABLE_NAME,
            'LOGGED',
            COALESCE(auth.uid()::text, 'system'),
            jsonb_build_object(
                'table', TG_TABLE_NAME,
                'operation', TG_OP,
                'timestamp', now()
            ),
            now()
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- FIX: log_security_audit also has wrong columns - fix it too
CREATE OR REPLACE FUNCTION public.log_security_audit(
    p_event_type text, 
    p_severity text DEFAULT 'INFO'::text, 
    p_details jsonb DEFAULT '{}'::jsonb, 
    p_resource_type text DEFAULT NULL::text, 
    p_resource_id text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    audit_id uuid;
BEGIN
    INSERT INTO public.security_audit_log (
        audit_type,
        severity,
        location,
        finding_type,
        description,
        action_taken,
        audited_by,
        metadata,
        created_at
    ) VALUES (
        p_event_type,
        UPPER(p_severity),
        COALESCE(p_resource_type, 'system'),
        COALESCE(p_resource_type, 'GENERAL'),
        p_event_type || ': ' || COALESCE(p_resource_id, 'N/A'),
        'LOGGED',
        COALESCE(auth.uid()::text, 'system'),
        jsonb_build_object(
            'details', p_details,
            'resource_type', p_resource_type,
            'resource_id', p_resource_id,
            'timestamp', now()
        ),
        now()
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$function$;

-- FIX: log_role_changes references NEW.user_id but profiles uses 'id' not 'user_id'
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.role_audit_logs (user_id, old_role, new_role, changed_by, reason)
  VALUES (
    COALESCE(NEW.id, OLD.id),  -- profiles uses 'id', not 'user_id'
    OLD.role::text, 
    NEW.role::text, 
    auth.uid(), 
    'Role change via trigger'
  );
  RETURN NEW;
END;
$function$;
