-- Table d'audit pour tracer les changements de rôles
CREATE TABLE IF NOT EXISTS public.role_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('add', 'remove')),
  role TEXT NOT NULL,
  old_role TEXT,
  new_role TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX idx_role_audit_logs_user_id ON public.role_audit_logs(user_id);
CREATE INDEX idx_role_audit_logs_changed_by ON public.role_audit_logs(changed_by);
CREATE INDEX idx_role_audit_logs_changed_at ON public.role_audit_logs(changed_at DESC);
CREATE INDEX idx_role_audit_logs_action ON public.role_audit_logs(action);

-- RLS policies
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres logs
CREATE POLICY "Users can view their own audit logs"
ON public.role_audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Les admins/managers peuvent voir tous les logs
CREATE POLICY "Admins can view all audit logs"
ON public.role_audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Seuls les admins peuvent insérer des logs (via trigger)
CREATE POLICY "Only admins can insert audit logs"
ON public.role_audit_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Trigger function pour enregistrer automatiquement les changements
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_action TEXT;
  v_old_role TEXT;
  v_new_role TEXT;
BEGIN
  -- Déterminer l'action
  IF TG_OP = 'INSERT' THEN
    v_action := 'add';
    v_old_role := NULL;
    v_new_role := NEW.role;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'remove';
    v_old_role := OLD.role;
    v_new_role := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_old_role := OLD.role;
    v_new_role := NEW.role;
  END IF;

  -- Insérer le log d'audit
  INSERT INTO public.role_audit_logs (
    user_id,
    action,
    role,
    old_role,
    new_role,
    changed_by,
    metadata
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    v_action,
    COALESCE(NEW.role, OLD.role),
    v_old_role,
    v_new_role,
    auth.uid(),
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'timestamp', now()
    )
  );

  -- Retourner selon le type d'opération
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Trigger sur user_roles pour audit automatique
CREATE TRIGGER trigger_audit_role_changes
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_change();

-- Fonction pour récupérer l'historique d'audit d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_role_audit_history(
  _user_id UUID,
  _limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  action TEXT,
  role TEXT,
  old_role TEXT,
  new_role TEXT,
  changed_by_email TEXT,
  changed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ral.id,
    ral.action,
    ral.role,
    ral.old_role,
    ral.new_role,
    u.email as changed_by_email,
    ral.changed_at,
    ral.metadata
  FROM public.role_audit_logs ral
  LEFT JOIN auth.users u ON ral.changed_by = u.id
  WHERE ral.user_id = _user_id
  ORDER BY ral.changed_at DESC
  LIMIT _limit;
END;
$$;

-- Fonction pour récupérer tous les logs d'audit (admin uniquement)
CREATE OR REPLACE FUNCTION public.get_all_role_audit_logs(
  _limit INTEGER DEFAULT 100,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  action TEXT,
  role TEXT,
  old_role TEXT,
  new_role TEXT,
  changed_by_email TEXT,
  changed_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Access denied: admin or moderator role required';
  END IF;

  RETURN QUERY
  SELECT 
    ral.id,
    u1.email as user_email,
    ral.action,
    ral.role,
    ral.old_role,
    ral.new_role,
    u2.email as changed_by_email,
    ral.changed_at
  FROM public.role_audit_logs ral
  LEFT JOIN auth.users u1 ON ral.user_id = u1.id
  LEFT JOIN auth.users u2 ON ral.changed_by = u2.id
  ORDER BY ral.changed_at DESC
  LIMIT _limit
  OFFSET _offset;
END;
$$;