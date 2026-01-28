-- Fix functions that access auth.users - migrate to public.profiles

-- 1. Fix share_filter_template function
CREATE OR REPLACE FUNCTION public.share_filter_template(template_id uuid, user_emails text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  template_owner UUID;
  user_ids TEXT[] := '{}';
  user_email TEXT;
  user_record RECORD;
BEGIN
  -- Check if the current user owns the template
  SELECT user_id INTO template_owner
  FROM public.notification_filter_templates
  WHERE id = template_id;

  IF template_owner != auth.uid() THEN
    RAISE EXCEPTION 'Only the template owner can share it';
  END IF;

  -- Convert emails to user IDs using profiles table
  FOREACH user_email IN ARRAY user_emails
  LOOP
    SELECT id INTO user_record
    FROM public.profiles
    WHERE email = user_email;
    
    IF FOUND THEN
      user_ids := array_append(user_ids, user_record.id::text);
    END IF;
  END LOOP;

  -- Update the template with shared user IDs
  UPDATE public.notification_filter_templates
  SET shared_with_users = user_ids,
      is_shared = true,
      updated_at = now()
  WHERE id = template_id;
END;
$function$;

-- 2. Fix accept_invitation function
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  invitation_record RECORD;
  result jsonb;
BEGIN
  -- Vérifier que l'invitation existe et est valide
  SELECT * INTO invitation_record
  FROM public.invitations
  WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invitation invalide ou expirée'
    );
  END IF;
  
  -- Vérifier que l'utilisateur correspond à l'email de l'invitation via profiles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND email = invitation_record.email
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cette invitation n''est pas pour votre compte'
    );
  END IF;
  
  -- Mettre à jour le profil de l'utilisateur
  UPDATE public.profiles
  SET 
    org_id = invitation_record.org_id,
    team_id = invitation_record.team_id,
    role = invitation_record.role::text
  WHERE id = auth.uid();
  
  -- Marquer l'invitation comme acceptée
  UPDATE public.invitations
  SET 
    status = 'accepted',
    accepted_at = now()
  WHERE token = invitation_token;
  
  result := jsonb_build_object(
    'success', true,
    'org_id', invitation_record.org_id,
    'team_id', invitation_record.team_id,
    'role', invitation_record.role
  );
  
  RETURN result;
END;
$function$;

-- 3. Fix audit_consent_compliance function
CREATE OR REPLACE FUNCTION public.audit_consent_compliance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_total_users bigint;
  v_users_with_consent bigint;
  v_active_consents bigint;
  v_consent_rate numeric;
  v_score numeric;
  v_findings jsonb;
BEGIN
  -- Count users from profiles table instead of auth.users
  SELECT COUNT(DISTINCT id) INTO v_total_users FROM public.profiles;
  
  -- Utilisateurs ayant donné au moins un consentement
  SELECT COUNT(DISTINCT user_id) INTO v_users_with_consent
  FROM public.user_consent_preferences
  WHERE consent_given = true;
  
  -- Consentements actifs
  SELECT COUNT(*) INTO v_active_consents
  FROM public.user_consent_preferences
  WHERE consent_given = true;
  
  -- Calculer le taux
  v_consent_rate := CASE 
    WHEN v_total_users > 0 THEN (v_users_with_consent::numeric / v_total_users::numeric) * 100
    ELSE 0
  END;
  
  -- Calculer le score (100 si > 80%, proportionnel sinon)
  v_score := CASE
    WHEN v_consent_rate >= 80 THEN 100
    WHEN v_consent_rate >= 50 THEN 70 + (v_consent_rate - 50) * 0.6
    ELSE v_consent_rate * 1.4
  END;
  
  v_findings := jsonb_build_array(
    jsonb_build_object(
      'metric', 'Taux de consentement',
      'value', ROUND(v_consent_rate, 2),
      'status', CASE WHEN v_consent_rate >= 80 THEN 'pass' ELSE 'warning' END
    ),
    jsonb_build_object(
      'metric', 'Utilisateurs avec consentement',
      'value', v_users_with_consent,
      'total', v_total_users,
      'status', CASE WHEN v_consent_rate >= 50 THEN 'pass' ELSE 'fail' END
    )
  );
  
  RETURN jsonb_build_object(
    'module', 'consent_compliance',
    'score', ROUND(v_score, 2),
    'findings', v_findings,
    'timestamp', now()
  );
END;
$function$;

-- 4. Update pwa_metrics INSERT policy to be more permissive for anonymous
DROP POLICY IF EXISTS pwa_metrics_insert_policy ON public.pwa_metrics;
CREATE POLICY pwa_metrics_insert_policy ON public.pwa_metrics
FOR INSERT TO public
WITH CHECK (
  -- Allow anonymous insertions (user_id is null) OR authenticated users inserting their own data
  (user_id IS NULL) OR (auth.uid() = user_id)
);

-- 5. Add anon role access explicitly
DROP POLICY IF EXISTS pwa_metrics_anon_insert ON public.pwa_metrics;
CREATE POLICY pwa_metrics_anon_insert ON public.pwa_metrics
FOR INSERT TO anon
WITH CHECK (user_id IS NULL);

-- Grant INSERT to anon role
GRANT INSERT ON public.pwa_metrics TO anon;