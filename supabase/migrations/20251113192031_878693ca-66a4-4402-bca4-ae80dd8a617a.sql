-- Tables pour ML et métriques de performance des escalades

-- Table pour stocker les prédictions ML
CREATE TABLE IF NOT EXISTS public.ml_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('alert_forecast', 'pattern_detection', 'escalation_optimization')),
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  prediction_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  actual_outcome JSONB,
  accuracy_score DECIMAL(3,2),
  model_version TEXT DEFAULT 'v1.0',
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour métriques de performance des escalades
CREATE TABLE IF NOT EXISTS public.escalation_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES public.alert_escalation_rules(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_escalations INTEGER DEFAULT 0,
  successful_resolutions INTEGER DEFAULT 0,
  avg_resolution_time_minutes INTEGER,
  false_positives INTEGER DEFAULT 0,
  missed_alerts INTEGER DEFAULT 0,
  escalation_accuracy DECIMAL(5,2),
  recommendation JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rule_id, metric_date)
);

-- Table pour tracking en temps réel des escalades actives
CREATE TABLE IF NOT EXISTS public.active_escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.unified_alerts(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_escalated_at TIMESTAMPTZ,
  assigned_to TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_ml_predictions_type_date ON public.ml_predictions(prediction_type, predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_escalation_metrics_rule_date ON public.escalation_performance_metrics(rule_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_active_escalations_status ON public.active_escalations(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_escalations_alert ON public.active_escalations(alert_id);

-- RLS Policies
ALTER TABLE public.ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_escalations ENABLE ROW LEVEL SECURITY;

-- Admin access for ml_predictions
CREATE POLICY "Admins can view ML predictions"
  ON public.ml_predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert ML predictions"
  ON public.ml_predictions FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admin access for escalation_performance_metrics
CREATE POLICY "Admins can view escalation metrics"
  ON public.escalation_performance_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin access for active_escalations
CREATE POLICY "Admins can manage active escalations"
  ON public.active_escalations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_escalation_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_escalation_metrics_timestamp
  BEFORE UPDATE ON public.escalation_performance_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_escalation_metrics_updated_at();

CREATE TRIGGER update_active_escalations_timestamp
  BEFORE UPDATE ON public.active_escalations
  FOR EACH ROW
  EXECUTE FUNCTION update_escalation_metrics_updated_at();