-- Migration: Sécurisation des fonctions DB (search_path)
-- Fix: Supabase Linter warnings 0011_function_search_path_mutable
-- Date: 2025-10-28

-- Sécuriser toutes les fonctions publiques avec search_path immutable
-- Ceci empêche les injections SQL via search_path manipulation

-- Fonction d'acceptation d'invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
  
  -- Vérifier que l'utilisateur correspond à l'email de l'invitation
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
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
$$;

-- Commentaire sur la sécurité
COMMENT ON FUNCTION public.accept_invitation(text) IS 
'Fonction sécurisée avec search_path immutable pour empêcher les injections SQL';
