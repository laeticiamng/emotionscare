-- Migration: API publique et clés API (Phase 3 - Excellence)

-- Table des clés API
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT ARRAY['read']::TEXT[],
  rate_limit JSONB NOT NULL DEFAULT '{"requests_per_day": 1000, "requests_per_hour": 100}'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table d'utilisation des clés API
CREATE TABLE IF NOT EXISTS api_key_usage (
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 0,
  errors_count INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (api_key_id, date)
);

-- Table des webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des logs de webhooks
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key) WHERE is_active = true;
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_key_usage_date ON api_key_usage(date DESC);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhooks_enabled ON webhooks(enabled) WHERE enabled = true;
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour vérifier le rate limit
CREATE OR REPLACE FUNCTION check_api_rate_limit(p_api_key_id UUID)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INTEGER,
  reset_at TIMESTAMPTZ
) AS $$
DECLARE
  v_rate_limit JSONB;
  v_today_count INTEGER;
  v_max_per_day INTEGER;
BEGIN
  -- Récupérer la limite de taux
  SELECT rate_limit INTO v_rate_limit
  FROM api_keys
  WHERE id = p_api_key_id AND is_active = true;

  IF v_rate_limit IS NULL THEN
    RETURN QUERY SELECT false, 0, NOW();
    RETURN;
  END IF;

  v_max_per_day := (v_rate_limit->>'requests_per_day')::INTEGER;

  -- Compter les requêtes d'aujourd'hui
  SELECT COALESCE(requests_count, 0) INTO v_today_count
  FROM api_key_usage
  WHERE api_key_id = p_api_key_id AND date = CURRENT_DATE;

  -- Vérifier si la limite est atteinte
  IF v_today_count >= v_max_per_day THEN
    RETURN QUERY SELECT false, 0, (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ;
  ELSE
    RETURN QUERY SELECT true, v_max_per_day - v_today_count, (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter l'utilisation de l'API
CREATE OR REPLACE FUNCTION increment_api_usage(
  p_api_key_id UUID,
  p_response_time_ms INTEGER DEFAULT 0,
  p_is_error BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO api_key_usage (api_key_id, date, requests_count, errors_count, avg_response_time_ms)
  VALUES (
    p_api_key_id,
    CURRENT_DATE,
    1,
    CASE WHEN p_is_error THEN 1 ELSE 0 END,
    p_response_time_ms
  )
  ON CONFLICT (api_key_id, date)
  DO UPDATE SET
    requests_count = api_key_usage.requests_count + 1,
    errors_count = api_key_usage.errors_count + CASE WHEN p_is_error THEN 1 ELSE 0 END,
    avg_response_time_ms = (
      (api_key_usage.avg_response_time_ms * api_key_usage.requests_count + p_response_time_ms)
      / (api_key_usage.requests_count + 1)
    )::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour déclencher un webhook
CREATE OR REPLACE FUNCTION trigger_webhook(
  p_user_id UUID,
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS VOID AS $$
DECLARE
  v_webhook RECORD;
BEGIN
  FOR v_webhook IN
    SELECT * FROM webhooks
    WHERE user_id = p_user_id
      AND enabled = true
      AND p_event_type = ANY(events)
  LOOP
    -- Insérer dans la queue des webhooks à envoyer
    INSERT INTO webhook_logs (webhook_id, event_type, payload)
    VALUES (v_webhook.id, p_event_type, p_payload);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour api_keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (user_id = auth.uid());

-- Policies pour api_key_usage
CREATE POLICY "Users can view usage of their API keys"
  ON api_key_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_key_usage.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Policies pour webhooks
CREATE POLICY "Users can manage their own webhooks"
  ON webhooks FOR ALL
  USING (user_id = auth.uid());

-- Policies pour webhook_logs
CREATE POLICY "Users can view logs of their webhooks"
  ON webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM webhooks
      WHERE webhooks.id = webhook_logs.webhook_id
      AND webhooks.user_id = auth.uid()
    )
  );

-- Commentaires
COMMENT ON TABLE api_keys IS 'Clés API pour accéder à l''API publique EmotionsCare';
COMMENT ON TABLE api_key_usage IS 'Statistiques d''utilisation des clés API';
COMMENT ON TABLE webhooks IS 'Configuration des webhooks pour les notifications en temps réel';
COMMENT ON TABLE webhook_logs IS 'Logs des déclenchements de webhooks';
