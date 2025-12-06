-- Table pour les validations de rapports par IA
CREATE TABLE IF NOT EXISTS report_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  compliance_checks JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  overall_assessment TEXT NOT NULL,
  immediate_actions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_report_validations_report_id ON report_validations(report_id);
CREATE INDEX idx_report_validations_user_id ON report_validations(user_id);

ALTER TABLE report_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own validations"
  ON report_validations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create validations"
  ON report_validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table pour les webhooks RGPD
CREATE TABLE IF NOT EXISTS gdpr_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('report.signed', 'violation.detected', 'alert.critical', 'export.completed', 'consent.updated')),
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  trigger_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gdpr_webhooks_user_id ON gdpr_webhooks(user_id);
CREATE INDEX idx_gdpr_webhooks_event_type ON gdpr_webhooks(event_type);

ALTER TABLE gdpr_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own webhooks"
  ON gdpr_webhooks FOR ALL
  USING (auth.uid() = user_id);

-- Table pour les logs de webhooks
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES gdpr_webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  status_code INTEGER,
  success BOOLEAN DEFAULT false,
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs of their webhooks"
  ON webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gdpr_webhooks
      WHERE gdpr_webhooks.id = webhook_logs.webhook_id
      AND gdpr_webhooks.user_id = auth.uid()
    )
  );

-- Table pour le versioning des templates
CREATE TABLE IF NOT EXISTS template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES pdf_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  config JSONB NOT NULL,
  change_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_template_versions_template_id ON template_versions(template_id);
CREATE INDEX idx_template_versions_version_number ON template_versions(template_id, version_number DESC);

ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their templates"
  ON template_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pdf_templates
      WHERE pdf_templates.id = template_versions.template_id
      AND pdf_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for their templates"
  ON template_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pdf_templates
      WHERE pdf_templates.id = template_versions.template_id
      AND pdf_templates.user_id = auth.uid()
    )
  );
