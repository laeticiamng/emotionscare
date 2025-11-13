-- =====================================================
-- Migration: Chatbot IA, Tickets Automatiques & Tests A/B
-- =====================================================

-- Table pour les configurations de tests A/B
CREATE TABLE IF NOT EXISTS public.ab_test_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  control_rule_id UUID REFERENCES alert_escalation_rules(id),
  variant_rule_id UUID REFERENCES alert_escalation_rules(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  min_sample_size INTEGER DEFAULT 100,
  confidence_level NUMERIC DEFAULT 0.95,
  winner TEXT CHECK (winner IN ('control', 'variant', 'inconclusive')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les résultats des tests A/B
CREATE TABLE IF NOT EXISTS public.ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_test_configurations(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES unified_alerts(id),
  variant TEXT NOT NULL CHECK (variant IN ('control', 'variant')),
  escalation_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  resolution_time_minutes INTEGER,
  final_severity TEXT,
  feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Table pour les configurations d'intégrations de tickets
CREATE TABLE IF NOT EXISTS public.ticket_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type TEXT NOT NULL CHECK (integration_type IN ('jira', 'linear')),
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_token TEXT NOT NULL, -- Encrypted in production
  project_key TEXT NOT NULL,
  default_assignee TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour tracker les tickets créés automatiquement
CREATE TABLE IF NOT EXISTS public.auto_created_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES unified_alerts(id),
  integration_id UUID NOT NULL REFERENCES ticket_integrations(id),
  ticket_key TEXT NOT NULL,
  ticket_url TEXT,
  assigned_to TEXT,
  status TEXT,
  ml_suggested_assignee TEXT,
  ml_confidence NUMERIC,
  pattern_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_ab_test_configs_status ON ab_test_configurations(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_variant ON ab_test_results(variant);
CREATE INDEX IF NOT EXISTS idx_ticket_integrations_active ON ticket_integrations(is_active);
CREATE INDEX IF NOT EXISTS idx_auto_created_tickets_alert ON auto_created_tickets(alert_id);
CREATE INDEX IF NOT EXISTS idx_auto_created_tickets_integration ON auto_created_tickets(integration_id);

-- Fonction de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_ab_test_configurations_updated_at
  BEFORE UPDATE ON ab_test_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_integrations_updated_at
  BEFORE UPDATE ON ticket_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_created_tickets_updated_at
  BEFORE UPDATE ON auto_created_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE ab_test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_created_tickets ENABLE ROW LEVEL SECURITY;

-- Policies pour ab_test_configurations
CREATE POLICY "Admin can manage AB tests"
  ON ab_test_configurations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view AB tests"
  ON ab_test_configurations FOR SELECT
  USING (true);

-- Policies pour ab_test_results
CREATE POLICY "Admin can manage AB test results"
  ON ab_test_results FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view AB test results"
  ON ab_test_results FOR SELECT
  USING (true);

-- Policies pour ticket_integrations
CREATE POLICY "Admin can manage ticket integrations"
  ON ticket_integrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies pour auto_created_tickets
CREATE POLICY "Admin can manage auto tickets"
  ON auto_created_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their auto tickets"
  ON auto_created_tickets FOR SELECT
  USING (true);