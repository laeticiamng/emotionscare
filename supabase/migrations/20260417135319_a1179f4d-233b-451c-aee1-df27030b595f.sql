CREATE OR REPLACE FUNCTION public.audit_module_lifecycle_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action text;
  v_reason text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'added';
    v_reason := 'Module ajouté au registre lifecycle';
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.route_audit_log (route_path, route_name, action, previous_state, new_state, reason, performed_by)
    VALUES ('/module/' || OLD.module_key, OLD.display_name, 'removed', to_jsonb(OLD), NULL, 'Module retiré du registre lifecycle', auth.uid());
    RETURN OLD;
  ELSE
    IF NEW.kill_switch_enabled IS DISTINCT FROM OLD.kill_switch_enabled THEN
      v_action := CASE WHEN NEW.kill_switch_enabled THEN 'deprecated' ELSE 'restored' END;
      v_reason := 'Kill-switch ' || CASE WHEN NEW.kill_switch_enabled THEN 'activé' ELSE 'désactivé' END;
    ELSIF NEW.rollout_percentage IS DISTINCT FROM OLD.rollout_percentage THEN
      v_action := 'guard_changed';
      v_reason := 'Rollout: ' || OLD.rollout_percentage || '% → ' || NEW.rollout_percentage || '%';
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'segment_changed';
      v_reason := 'Statut: ' || OLD.status || ' → ' || NEW.status;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO public.route_audit_log (route_path, route_name, action, previous_state, new_state, reason, performed_by)
  VALUES (
    '/module/' || NEW.module_key,
    NEW.display_name,
    v_action,
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW),
    v_reason,
    auth.uid()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_module_lifecycle ON public.module_lifecycle;
CREATE TRIGGER trg_audit_module_lifecycle
AFTER INSERT OR UPDATE OR DELETE ON public.module_lifecycle
FOR EACH ROW
EXECUTE FUNCTION public.audit_module_lifecycle_changes();