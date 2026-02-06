
-- Fix: security_event_trigger uses 'INFO' but check constraint only allows CRITICAL/HIGH/MEDIUM/LOW
-- Change to 'LOW' for profile creation events
CREATE OR REPLACE FUNCTION public.security_event_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME IN ('profiles', 'biovida_analyses') THEN
        INSERT INTO public.security_audit_log (
            audit_type, severity, location, finding_type,
            description, action_taken, audited_by, metadata, created_at
        ) VALUES (
            'DATA_ACCESS', 'LOW', TG_TABLE_NAME, TG_OP,
            'New record created in ' || TG_TABLE_NAME,
            'LOGGED', COALESCE(auth.uid()::text, 'system'),
            jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP, 'timestamp', now()),
            now()
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix log_security_audit too - ensure severity is uppercased and valid
CREATE OR REPLACE FUNCTION public.log_security_audit(
    p_event_type text, 
    p_severity text DEFAULT 'LOW'::text, 
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
    valid_severity text;
BEGIN
    -- Ensure severity is valid
    valid_severity := CASE UPPER(p_severity)
        WHEN 'CRITICAL' THEN 'CRITICAL'
        WHEN 'HIGH' THEN 'HIGH'
        WHEN 'MEDIUM' THEN 'MEDIUM'
        ELSE 'LOW'
    END;

    INSERT INTO public.security_audit_log (
        audit_type, severity, location, finding_type,
        description, action_taken, audited_by, metadata, created_at
    ) VALUES (
        p_event_type, valid_severity,
        COALESCE(p_resource_type, 'system'),
        COALESCE(p_resource_type, 'GENERAL'),
        p_event_type || ': ' || COALESCE(p_resource_id, 'N/A'),
        'LOGGED', COALESCE(auth.uid()::text, 'system'),
        jsonb_build_object('details', p_details, 'resource_type', p_resource_type, 'resource_id', p_resource_id, 'timestamp', now()),
        now()
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$function$;
