-- Fix remaining 14 functions that reference auth.users

-- 1. Fix notify_share_created
CREATE OR REPLACE FUNCTION public.notify_share_created()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  owner_email TEXT;
BEGIN
  SELECT email INTO owner_email FROM public.profiles WHERE id = NEW.owner_id;
  IF NEW.shared_with_user_id IS NOT NULL THEN
    INSERT INTO public.share_notifications (user_id, share_id, notification_type, title, message, metadata)
    VALUES (NEW.shared_with_user_id, NEW.id, 'share_created', 'Nouveau partage reçu',
      COALESCE(owner_email, 'Un utilisateur') || ' a partagé des données avec vous',
      jsonb_build_object('owner_id', NEW.owner_id, 'owner_email', owner_email, 'permission', NEW.permission, 'shared_at', NEW.created_at)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. Fix update_leaderboard_scores  
CREATE OR REPLACE FUNCTION public.update_leaderboard_scores()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.music_leaderboard (user_id, display_name, total_score, weekly_score, monthly_score)
  VALUES (NEW.user_id, COALESCE((SELECT name FROM public.profiles WHERE id = NEW.user_id), 'Utilisateur'),
    NEW.points_reward, NEW.points_reward, NEW.points_reward)
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = music_leaderboard.total_score + NEW.points_reward,
    weekly_score = music_leaderboard.weekly_score + NEW.points_reward,
    monthly_score = music_leaderboard.monthly_score + NEW.points_reward,
    last_updated = NOW();
  RETURN NEW;
END;
$function$;

-- 3. Fix log_share_audit
CREATE OR REPLACE FUNCTION public.log_share_audit(p_action text, p_resource_type text, p_resource_id uuid, p_details jsonb DEFAULT NULL)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL THEN
    SELECT email INTO v_user_email FROM public.profiles WHERE id = v_user_id;
  END IF;
  INSERT INTO public.share_audit_logs (user_id, user_email, action, resource_type, resource_id, details)
  VALUES (v_user_id, v_user_email, p_action, p_resource_type, p_resource_id, p_details);
END;
$function$;

-- 4. Fix notify_share_updated
CREATE OR REPLACE FUNCTION public.notify_share_updated()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  owner_email TEXT;
BEGIN
  SELECT email INTO owner_email FROM public.profiles WHERE id = NEW.owner_id;
  IF NEW.shared_with_user_id IS NOT NULL AND (OLD.permission IS DISTINCT FROM NEW.permission OR OLD.expires_at IS DISTINCT FROM NEW.expires_at) THEN
    INSERT INTO public.share_notifications (user_id, share_id, notification_type, title, message, metadata)
    VALUES (NEW.shared_with_user_id, NEW.id, 'share_updated', 'Partage mis à jour',
      COALESCE(owner_email, 'Un utilisateur') || ' a modifié les permissions de partage',
      jsonb_build_object('owner_id', NEW.owner_id, 'owner_email', owner_email, 'old_permission', OLD.permission, 'new_permission', NEW.permission, 'updated_at', NEW.updated_at)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- 5. Fix notify_share_deleted
CREATE OR REPLACE FUNCTION public.notify_share_deleted()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  owner_email TEXT;
BEGIN
  SELECT email INTO owner_email FROM public.profiles WHERE id = OLD.owner_id;
  IF OLD.shared_with_user_id IS NOT NULL THEN
    INSERT INTO public.share_notifications (user_id, share_id, notification_type, title, message, metadata)
    VALUES (OLD.shared_with_user_id, OLD.id, 'share_deleted', 'Partage supprimé',
      COALESCE(owner_email, 'Un utilisateur') || ' a supprimé le partage de données',
      jsonb_build_object('owner_id', OLD.owner_id, 'owner_email', owner_email, 'deleted_at', NOW())
    );
  END IF;
  RETURN OLD;
END;
$function$;

-- 6. Fix notify_template_share
CREATE OR REPLACE FUNCTION public.notify_template_share()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  owner_email TEXT;
  template_name TEXT;
BEGIN
  SELECT email INTO owner_email FROM public.profiles WHERE id = NEW.owner_id;
  SELECT name INTO template_name FROM public.filter_templates WHERE id = NEW.template_id;
  IF NEW.shared_with_user_id IS NOT NULL THEN
    INSERT INTO public.share_notifications (user_id, share_id, notification_type, title, message, metadata)
    VALUES (NEW.shared_with_user_id, NEW.id, 'template_share', 'Modèle de filtre partagé',
      COALESCE(owner_email, 'Un utilisateur') || ' a partagé le modèle "' || COALESCE(template_name, 'Sans nom') || '"',
      jsonb_build_object('owner_id', NEW.owner_id, 'owner_email', owner_email, 'template_id', NEW.template_id, 'template_name', template_name, 'permission', NEW.permission, 'shared_at', NEW.created_at)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- 7. Fix share_filter_template
CREATE OR REPLACE FUNCTION public.share_filter_template(p_template_id uuid, p_shared_with_email text DEFAULT NULL, p_shared_with_user_id uuid DEFAULT NULL, p_permission text DEFAULT 'read')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_share_id UUID;
  v_user_id UUID;
  v_owner_id UUID;
BEGIN
  v_owner_id := auth.uid();
  IF v_owner_id IS NULL THEN RAISE EXCEPTION 'User must be authenticated'; END IF;
  IF p_shared_with_email IS NOT NULL AND p_shared_with_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE email = p_shared_with_email;
  ELSE
    v_user_id := p_shared_with_user_id;
  END IF;
  INSERT INTO public.template_shares (template_id, owner_id, shared_with_user_id, shared_with_email, permission)
  VALUES (p_template_id, v_owner_id, v_user_id, p_shared_with_email, p_permission)
  RETURNING id INTO v_share_id;
  RETURN v_share_id;
END;
$function$;

-- 8. Fix accept_invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_invitation RECORD;
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'User must be authenticated'; END IF;
  SELECT email INTO v_user_email FROM public.profiles WHERE id = v_user_id;
  SELECT * INTO v_invitation FROM public.invitations WHERE id = invitation_id;
  IF v_invitation IS NULL THEN RAISE EXCEPTION 'Invitation not found'; END IF;
  IF v_invitation.status != 'pending' THEN RAISE EXCEPTION 'Invitation already processed'; END IF;
  IF v_invitation.invitee_email != v_user_email AND v_invitation.invitee_id != v_user_id THEN
    RAISE EXCEPTION 'Invitation not for this user';
  END IF;
  UPDATE public.invitations SET status = 'accepted', invitee_id = v_user_id, accepted_at = NOW() WHERE id = invitation_id;
  RETURN TRUE;
END;
$function$;

-- 9. Fix audit_consent_compliance
CREATE OR REPLACE FUNCTION public.audit_consent_compliance(p_user_id uuid DEFAULT NULL)
RETURNS TABLE(user_id uuid, user_email text, consent_scope text, status text, issues text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, co.scope,
    CASE WHEN co.revoked_at IS NOT NULL THEN 'revoked' WHEN co.id IS NULL THEN 'missing' ELSE 'valid' END,
    ARRAY[]::text[]
  FROM public.profiles p
  LEFT JOIN public.clinical_optins co ON p.id = co.user_id
  WHERE (p_user_id IS NULL OR p.id = p_user_id) AND p.email IS NOT NULL;
END;
$function$;

-- 10. Fix get_all_role_audit_logs
CREATE OR REPLACE FUNCTION public.get_all_role_audit_logs()
RETURNS TABLE(id uuid, user_id uuid, user_email text, old_role text, new_role text, changed_by uuid, changed_by_email text, reason text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT ral.id, ral.user_id, p1.email, ral.old_role, ral.new_role, ral.changed_by, p2.email, ral.reason, ral.created_at
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p1 ON ral.user_id = p1.id
  LEFT JOIN public.profiles p2 ON ral.changed_by = p2.id
  ORDER BY ral.created_at DESC;
END;
$function$;

-- 11. Fix get_user_role_audit_history
CREATE OR REPLACE FUNCTION public.get_user_role_audit_history(p_user_id uuid)
RETURNS TABLE(id uuid, old_role text, new_role text, changed_by uuid, changed_by_email text, reason text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT ral.id, ral.old_role, ral.new_role, ral.changed_by, p.email, ral.reason, ral.created_at
  FROM public.role_audit_logs ral
  LEFT JOIN public.profiles p ON ral.changed_by = p.id
  WHERE ral.user_id = p_user_id
  ORDER BY ral.created_at DESC;
END;
$function$;

-- 12. Fix get_secure_user_count  
CREATE OR REPLACE FUNCTION public.get_secure_user_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (SELECT COUNT(*)::integer FROM public.profiles WHERE email IS NOT NULL);
END;
$function$;

-- 13. Fix has_sitemap_access
CREATE OR REPLACE FUNCTION public.has_sitemap_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role TEXT;
BEGIN
  SELECT user_role INTO v_role FROM public.profiles WHERE id = p_user_id;
  IF v_role IN ('admin', 'moderator', 'manager') THEN RETURN TRUE; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role IN ('admin', 'moderator')) THEN RETURN TRUE; END IF;
  RETURN FALSE;
END;
$function$;

-- 14. Fix log_role_changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.role_audit_logs (user_id, old_role, new_role, changed_by, reason)
  VALUES (COALESCE(NEW.user_id, OLD.user_id), OLD.role::text, NEW.role::text, auth.uid(), 'Role change via trigger');
  RETURN NEW;
END;
$function$;