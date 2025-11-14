-- Migration: Health Integrations (Phase 3 - Excellence)
-- Intégrations avec Google Fit, Apple Health, Withings

-- Table des connexions aux providers de santé
CREATE TABLE IF NOT EXISTS health_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google_fit', 'apple_health', 'withings')),
  is_connected BOOLEAN NOT NULL DEFAULT true,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT NOT NULL DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily')),
  enabled_data_types TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Index pour recherche rapide
CREATE INDEX idx_health_connections_user_id ON health_connections(user_id);
CREATE INDEX idx_health_connections_provider ON health_connections(provider);
CREATE INDEX idx_health_connections_last_sync ON health_connections(last_sync_at);

-- Table des métriques santé
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google_fit', 'apple_health', 'withings')),
  data_type TEXT NOT NULL CHECK (data_type IN ('heart_rate', 'steps', 'sleep', 'activity', 'weight', 'blood_pressure', 'oxygen_saturation', 'stress_level')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_timestamp ON health_metrics(timestamp DESC);
CREATE INDEX idx_health_metrics_data_type ON health_metrics(data_type);
CREATE INDEX idx_health_metrics_provider ON health_metrics(provider);
CREATE INDEX idx_health_metrics_user_data_type_timestamp ON health_metrics(user_id, data_type, timestamp DESC);

-- Table des insights santé générés par IA
CREATE TABLE IF NOT EXISTS health_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trend', 'anomaly', 'recommendation', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'success', 'error')),
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Index pour recherche rapide
CREATE INDEX idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX idx_health_insights_created_at ON health_insights(created_at DESC);
CREATE INDEX idx_health_insights_read_at ON health_insights(read_at) WHERE read_at IS NULL;

-- Table des préférences d'intégration
CREATE TABLE IF NOT EXISTS health_integration_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_sync_enabled BOOLEAN NOT NULL DEFAULT true,
  sync_frequency TEXT NOT NULL DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily')),
  notification_on_sync BOOLEAN NOT NULL DEFAULT false,
  notification_on_insights BOOLEAN NOT NULL DEFAULT true,
  preferred_providers TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  data_retention_days INTEGER NOT NULL DEFAULT 365,
  share_with_coach BOOLEAN NOT NULL DEFAULT false,
  share_with_therapist BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_health_connections_updated_at
  BEFORE UPDATE ON health_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_integration_preferences_updated_at
  BEFORE UPDATE ON health_integration_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE health_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_integration_preferences ENABLE ROW LEVEL SECURITY;

-- Policies pour health_connections
CREATE POLICY "Users can view their own health connections"
  ON health_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health connections"
  ON health_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health connections"
  ON health_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health connections"
  ON health_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour health_metrics
CREATE POLICY "Users can view their own health metrics"
  ON health_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics"
  ON health_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics"
  ON health_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour health_insights
CREATE POLICY "Users can view their own health insights"
  ON health_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own health insights"
  ON health_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health insights"
  ON health_insights FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour health_integration_preferences
CREATE POLICY "Users can view their own integration preferences"
  ON health_integration_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration preferences"
  ON health_integration_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration preferences"
  ON health_integration_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration preferences"
  ON health_integration_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour obtenir des statistiques agrégées
CREATE OR REPLACE FUNCTION get_aggregated_health_data(
  p_user_id UUID,
  p_data_type TEXT,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  average_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  unit TEXT,
  data_points BIGINT,
  providers TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN p_group_by = 'hour' THEN TO_CHAR(DATE_TRUNC('hour', timestamp), 'YYYY-MM-DD HH24:00')
      WHEN p_group_by = 'day' THEN TO_CHAR(DATE_TRUNC('day', timestamp), 'YYYY-MM-DD')
      WHEN p_group_by = 'week' THEN TO_CHAR(DATE_TRUNC('week', timestamp), 'YYYY-MM-DD')
      WHEN p_group_by = 'month' THEN TO_CHAR(DATE_TRUNC('month', timestamp), 'YYYY-MM')
      ELSE TO_CHAR(DATE_TRUNC('day', timestamp), 'YYYY-MM-DD')
    END AS date,
    AVG(value)::NUMERIC AS average_value,
    MIN(value)::NUMERIC AS min_value,
    MAX(value)::NUMERIC AS max_value,
    MAX(health_metrics.unit) AS unit,
    COUNT(*)::BIGINT AS data_points,
    ARRAY_AGG(DISTINCT provider) AS providers
  FROM health_metrics
  WHERE user_id = p_user_id
    AND data_type = p_data_type
    AND timestamp >= p_start_date
    AND timestamp <= p_end_date
  GROUP BY date
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour détecter des anomalies dans les données
CREATE OR REPLACE FUNCTION detect_health_anomalies(
  p_user_id UUID,
  p_data_type TEXT,
  p_lookback_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  timestamp TIMESTAMPTZ,
  value NUMERIC,
  avg_value NUMERIC,
  std_dev NUMERIC,
  z_score NUMERIC,
  is_anomaly BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      AVG(value) AS avg_val,
      STDDEV(value) AS std_val
    FROM health_metrics
    WHERE user_id = p_user_id
      AND data_type = p_data_type
      AND timestamp >= NOW() - INTERVAL '1 day' * p_lookback_days
  )
  SELECT
    hm.timestamp,
    hm.value,
    s.avg_val::NUMERIC,
    s.std_val::NUMERIC,
    ((hm.value - s.avg_val) / NULLIF(s.std_val, 0))::NUMERIC AS z_score,
    (ABS((hm.value - s.avg_val) / NULLIF(s.std_val, 0)) > 2.5) AS is_anomaly
  FROM health_metrics hm
  CROSS JOIN stats s
  WHERE hm.user_id = p_user_id
    AND hm.data_type = p_data_type
    AND hm.timestamp >= NOW() - INTERVAL '7 days'
  ORDER BY hm.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires pour la documentation
COMMENT ON TABLE health_connections IS 'Stocke les connexions OAuth aux providers de santé (Google Fit, Apple Health, Withings)';
COMMENT ON TABLE health_metrics IS 'Stocke toutes les métriques santé synchronisées depuis les providers';
COMMENT ON TABLE health_insights IS 'Insights générés par IA basés sur les données santé';
COMMENT ON TABLE health_integration_preferences IS 'Préférences utilisateur pour les intégrations santé';
