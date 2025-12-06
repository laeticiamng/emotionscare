-- Table pour les signatures électroniques des rapports
CREATE TABLE IF NOT EXISTS report_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  signature_hash TEXT NOT NULL,
  certificate_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX idx_report_signatures_report_id ON report_signatures(report_id);
CREATE INDEX idx_report_signatures_user_id ON report_signatures(user_id);

-- RLS policies
ALTER TABLE report_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signatures"
  ON report_signatures FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create signatures"
  ON report_signatures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table pour les logs d'exports (analytics)
CREATE TABLE IF NOT EXISTS export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'json', 'csv')),
  template TEXT CHECK (template IN ('standard', 'executive', 'technical', 'minimal')),
  file_size INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour analytics
CREATE INDEX idx_export_logs_user_id ON export_logs(user_id);
CREATE INDEX idx_export_logs_format ON export_logs(format);
CREATE INDEX idx_export_logs_created_at ON export_logs(created_at DESC);

-- RLS policies
ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own export logs"
  ON export_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create export logs"
  ON export_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table pour les templates PDF personnalisés
CREATE TABLE IF NOT EXISTS pdf_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,
  sections JSONB NOT NULL DEFAULT '{"cover": true, "summary": true, "charts": true, "details": true, "recommendations": true}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX idx_pdf_templates_user_id ON pdf_templates(user_id);

-- RLS policies
ALTER TABLE pdf_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
  ON pdf_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create templates"
  ON pdf_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON pdf_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON pdf_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_pdf_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pdf_templates_updated_at
  BEFORE UPDATE ON pdf_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_pdf_templates_updated_at();
