-- Table pour stocker les violations détectées
CREATE TABLE IF NOT EXISTS public.gdpr_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_data_types TEXT[] DEFAULT '{}',
  affected_users_count INTEGER DEFAULT 0,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'resolved', 'false_positive')),
  risk_score DECIMAL(5,2) NOT NULL,
  ml_confidence DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les alertes proactives
CREATE TABLE IF NOT EXISTS public.violation_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  risk_indicators JSONB DEFAULT '{}',
  recommendations TEXT[],
  predicted_impact TEXT,
  confidence_score DECIMAL(5,2),
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les métriques de monitoring
CREATE TABLE IF NOT EXISTS public.monitoring_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_unit TEXT,
  threshold_value DECIMAL(10,2),
  is_anomaly BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.gdpr_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour gdpr_violations
CREATE POLICY "Admins can view all violations"
  ON public.gdpr_violations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

CREATE POLICY "Admins can insert violations"
  ON public.gdpr_violations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

CREATE POLICY "Admins can update violations"
  ON public.gdpr_violations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

-- RLS Policies pour violation_alerts
CREATE POLICY "Admins can view all alerts"
  ON public.violation_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

CREATE POLICY "Admins can insert alerts"
  ON public.violation_alerts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

CREATE POLICY "Admins can update alerts"
  ON public.violation_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

-- RLS Policies pour monitoring_metrics
CREATE POLICY "Admins can view all metrics"
  ON public.monitoring_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

CREATE POLICY "Admins can insert metrics"
  ON public.monitoring_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'b2b_admin')
    )
  );

-- Fonction pour calculer le score de risque global
CREATE OR REPLACE FUNCTION calculate_risk_score()
RETURNS DECIMAL AS $$
DECLARE
  total_score DECIMAL := 0;
  violation_count INTEGER;
  critical_count INTEGER;
  high_count INTEGER;
BEGIN
  -- Compter les violations actives
  SELECT COUNT(*) INTO violation_count
  FROM public.gdpr_violations
  WHERE status IN ('detected', 'investigating')
  AND detected_at > NOW() - INTERVAL '7 days';

  SELECT COUNT(*) INTO critical_count
  FROM public.gdpr_violations
  WHERE status IN ('detected', 'investigating')
  AND severity = 'critical'
  AND detected_at > NOW() - INTERVAL '7 days';

  SELECT COUNT(*) INTO high_count
  FROM public.gdpr_violations
  WHERE status IN ('detected', 'investigating')
  AND severity = 'high'
  AND detected_at > NOW() - INTERVAL '7 days';

  -- Calculer le score (0-100)
  total_score := LEAST(100, (critical_count * 25) + (high_count * 10) + (violation_count * 5));

  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques de violations
CREATE OR REPLACE FUNCTION get_violation_stats(days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_violations BIGINT,
  critical_violations BIGINT,
  high_violations BIGINT,
  resolved_violations BIGINT,
  avg_resolution_time INTERVAL,
  trend_direction TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_violations,
    COUNT(*) FILTER (WHERE severity = 'critical')::BIGINT as critical_violations,
    COUNT(*) FILTER (WHERE severity = 'high')::BIGINT as high_violations,
    COUNT(*) FILTER (WHERE status = 'resolved')::BIGINT as resolved_violations,
    AVG(resolved_at - detected_at) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_time,
    CASE
      WHEN COUNT(*) FILTER (WHERE detected_at > NOW() - INTERVAL '7 days') >
           COUNT(*) FILTER (WHERE detected_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days')
      THEN 'increasing'
      WHEN COUNT(*) FILTER (WHERE detected_at > NOW() - INTERVAL '7 days') <
           COUNT(*) FILTER (WHERE detected_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days')
      THEN 'decreasing'
      ELSE 'stable'
    END as trend_direction
  FROM public.gdpr_violations
  WHERE detected_at > NOW() - (days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer le realtime pour les violations et alertes
ALTER PUBLICATION supabase_realtime ADD TABLE public.gdpr_violations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.violation_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.monitoring_metrics;

-- Index pour améliorer les performances
CREATE INDEX idx_violations_status ON public.gdpr_violations(status, detected_at DESC);
CREATE INDEX idx_violations_severity ON public.gdpr_violations(severity, detected_at DESC);
CREATE INDEX idx_alerts_triggered ON public.violation_alerts(triggered_at DESC) WHERE NOT is_dismissed;
CREATE INDEX idx_metrics_recorded ON public.monitoring_metrics(metric_name, recorded_at DESC);