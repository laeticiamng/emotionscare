-- Phase 2-5 Governance: extensions, manager read access, scheduled jobs

-- Activate extensions if not already
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Allow managers (not just admins) to read governance data
DO $$ BEGIN
  -- governance_audits: manager read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'governance_audits' AND policyname = 'managers_read_governance_audits'
  ) THEN
    CREATE POLICY "managers_read_governance_audits" ON public.governance_audits
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'module_lifecycle' AND policyname = 'managers_read_module_lifecycle'
  ) THEN
    CREATE POLICY "managers_read_module_lifecycle" ON public.module_lifecycle
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'slo_metrics' AND policyname = 'managers_read_slo_metrics'
  ) THEN
    CREATE POLICY "managers_read_slo_metrics" ON public.slo_metrics
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'route_audit_log' AND policyname = 'managers_read_route_audit_log'
  ) THEN
    CREATE POLICY "managers_read_route_audit_log" ON public.route_audit_log
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Realtime subscription for module_lifecycle (kill-switch propagation)
ALTER TABLE public.module_lifecycle REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'module_lifecycle'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.module_lifecycle;
  END IF;
END $$;

-- Trigger for module_lifecycle change traceability into route_audit_log
CREATE OR REPLACE FUNCTION public.log_module_lifecycle_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.route_audit_log (
    route_path,
    route_name,
    action,
    previous_state,
    new_state,
    reason,
    performed_by
  ) VALUES (
    '/module/' || COALESCE(NEW.module_key, OLD.module_key),
    COALESCE(NEW.display_name, OLD.display_name),
    CASE
      WHEN TG_OP = 'INSERT' THEN 'added'
      WHEN TG_OP = 'DELETE' THEN 'removed'
      WHEN OLD.kill_switch_enabled IS DISTINCT FROM NEW.kill_switch_enabled THEN 'guard_changed'
      WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'segment_changed'
      ELSE 'restored'
    END,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE jsonb_build_object('status', OLD.status, 'kill_switch_enabled', OLD.kill_switch_enabled, 'rollout_percentage', OLD.rollout_percentage) END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE jsonb_build_object('status', NEW.status, 'kill_switch_enabled', NEW.kill_switch_enabled, 'rollout_percentage', NEW.rollout_percentage) END,
    'module_lifecycle change',
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS module_lifecycle_audit ON public.module_lifecycle;
CREATE TRIGGER module_lifecycle_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.module_lifecycle
  FOR EACH ROW EXECUTE FUNCTION public.log_module_lifecycle_change();