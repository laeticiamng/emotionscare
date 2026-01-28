-- Drop and recreate validate_campaign_consents with correct return type
DROP FUNCTION IF EXISTS public.validate_campaign_consents(uuid);

CREATE OR REPLACE FUNCTION public.validate_campaign_consents(p_campaign_id uuid)
RETURNS TABLE(user_id uuid, user_email text, has_consent boolean, consent_scope text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.email as user_email,
    CASE WHEN co.id IS NOT NULL AND co.revoked_at IS NULL THEN TRUE ELSE FALSE END as has_consent,
    co.scope as consent_scope
  FROM public.profiles p
  LEFT JOIN public.clinical_optins co ON p.id = co.user_id AND co.revoked_at IS NULL
  WHERE p.email IS NOT NULL;
END;
$function$;