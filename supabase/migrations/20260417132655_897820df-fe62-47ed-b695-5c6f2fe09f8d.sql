
-- =========================================================
-- GOUVERNANCE PLATEFORME — Phase 0 (Fondations)
-- =========================================================

-- 1. governance_audits : journal des audits
CREATE TABLE IF NOT EXISTS public.governance_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('routing', 'data_rls', 'observability', 'modules', 'global')),
  title TEXT NOT NULL,
  summary TEXT,
  score NUMERIC(5,2) CHECK (score >= 0 AND score <= 100),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  triggered_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_governance_audits_type ON public.governance_audits(audit_type);
CREATE INDEX IF NOT EXISTS idx_governance_audits_created ON public.governance_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_governance_audits_severity ON public.governance_audits(severity);

ALTER TABLE public.governance_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "governance_audits_admin_all"
  ON public.governance_audits FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "governance_audits_manager_read"
  ON public.governance_audits FOR SELECT
  USING (public.has_role(auth.uid(), 'manager') AND audit_type IN ('global', 'modules'));

-- 2. module_lifecycle : cycle de vie modules
CREATE TABLE IF NOT EXISTS public.module_lifecycle (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'stable' CHECK (status IN ('alpha', 'beta', 'stable', 'deprecated', 'sunset')),
  version TEXT NOT NULL DEFAULT '1.0.0',
  owner TEXT,
  description TEXT,
  rollout_percentage SMALLINT NOT NULL DEFAULT 100 CHECK (rollout_percentage BETWEEN 0 AND 100),
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT false,
  last_reviewed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_module_lifecycle_status ON public.module_lifecycle(status);
CREATE INDEX IF NOT EXISTS idx_module_lifecycle_killswitch ON public.module_lifecycle(kill_switch_enabled) WHERE kill_switch_enabled = true;

ALTER TABLE public.module_lifecycle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "module_lifecycle_admin_all"
  ON public.module_lifecycle FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "module_lifecycle_manager_read"
  ON public.module_lifecycle FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "module_lifecycle_authenticated_read_active"
  ON public.module_lifecycle FOR SELECT
  USING (auth.uid() IS NOT NULL AND kill_switch_enabled = false AND status NOT IN ('deprecated', 'sunset'));

-- 3. route_audit_log : historique routes
CREATE TABLE IF NOT EXISTS public.route_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_path TEXT NOT NULL,
  route_name TEXT,
  action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'deprecated', 'redirected', 'segment_changed', 'guard_changed', 'restored')),
  previous_state JSONB,
  new_state JSONB,
  reason TEXT,
  performed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_route_audit_path ON public.route_audit_log(route_path);
CREATE INDEX IF NOT EXISTS idx_route_audit_created ON public.route_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_route_audit_action ON public.route_audit_log(action);

ALTER TABLE public.route_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "route_audit_log_admin_all"
  ON public.route_audit_log FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. slo_metrics : indicateurs SLO par module
CREATE TABLE IF NOT EXISTS public.slo_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_key TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('uptime', 'latency_p50', 'latency_p95', 'latency_p99', 'error_rate', 'throughput', 'availability')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'percent',
  target NUMERIC,
  status TEXT CHECK (status IN ('healthy', 'degraded', 'critical')),
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slo_metrics_module ON public.slo_metrics(module_key);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_recorded ON public.slo_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_module_window ON public.slo_metrics(module_key, window_end DESC);

ALTER TABLE public.slo_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slo_metrics_admin_all"
  ON public.slo_metrics FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "slo_metrics_manager_read"
  ON public.slo_metrics FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

-- Triggers updated_at
CREATE TRIGGER trg_governance_audits_updated_at
  BEFORE UPDATE ON public.governance_audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_module_lifecycle_updated_at
  BEFORE UPDATE ON public.module_lifecycle
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
