-- Migration: Rapports automatiques enrichis IA (Phase 3 - Excellence)

-- Table des rapports IA
CREATE TABLE IF NOT EXISTS ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('weekly_summary', 'monthly_summary', 'quarterly_review', 'mood_analysis', 'progress_report', 'health_insights', 'therapy_notes', 'custom')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::JSONB,
  ai_insights JSONB NOT NULL,
  metadata JSONB NOT NULL,
  format TEXT NOT NULL DEFAULT 'html' CHECK (format IN ('pdf', 'html', 'markdown', 'json')),
  file_url TEXT,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  shared_with TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Table des planifications de rapports
CREATE TABLE IF NOT EXISTS report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'on_demand')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  recipients JSONB NOT NULL DEFAULT '[]'::JSONB,
  preferences JSONB NOT NULL,
  next_generation_at TIMESTAMPTZ,
  last_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des modèles de rapport
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_built_in BOOLEAN NOT NULL DEFAULT false,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des analytics de rapports
CREATE TABLE IF NOT EXISTS report_analytics (
  report_id UUID PRIMARY KEY REFERENCES ai_reports(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  average_read_time_seconds INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_ai_reports_user_id ON ai_reports(user_id);
CREATE INDEX idx_ai_reports_type ON ai_reports(type);
CREATE INDEX idx_ai_reports_generated_at ON ai_reports(generated_at DESC);
CREATE INDEX idx_ai_reports_period ON ai_reports(period_start, period_end);
CREATE INDEX idx_report_schedules_user_id ON report_schedules(user_id);
CREATE INDEX idx_report_schedules_next_generation ON report_schedules(next_generation_at) WHERE enabled = true;
CREATE INDEX idx_report_templates_type ON report_templates(type);
CREATE INDEX idx_report_templates_built_in ON report_templates(is_built_in);

-- Triggers pour updated_at
CREATE TRIGGER update_report_schedules_updated_at
  BEFORE UPDATE ON report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
  BEFORE UPDATE ON report_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_analytics_updated_at
  BEFORE UPDATE ON report_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_report_views(p_report_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO report_analytics (report_id, views, last_viewed_at)
  VALUES (p_report_id, 1, NOW())
  ON CONFLICT (report_id)
  DO UPDATE SET
    views = report_analytics.views + 1,
    last_viewed_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter les téléchargements
CREATE OR REPLACE FUNCTION increment_report_downloads(p_report_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO report_analytics (report_id, downloads)
  VALUES (p_report_id, 1)
  ON CONFLICT (report_id)
  DO UPDATE SET downloads = report_analytics.downloads + 1;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter les partages
CREATE OR REPLACE FUNCTION increment_report_shares(p_report_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO report_analytics (report_id, shares)
  VALUES (p_report_id, 1)
  ON CONFLICT (report_id)
  DO UPDATE SET shares = report_analytics.shares + 1;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_analytics ENABLE ROW LEVEL SECURITY;

-- Policies pour ai_reports
CREATE POLICY "Users can view their own reports"
  ON ai_reports FOR SELECT
  USING (user_id = auth.uid() OR auth.uid() = ANY(shared_with::uuid[]));

CREATE POLICY "Users can insert their own reports"
  ON ai_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reports"
  ON ai_reports FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reports"
  ON ai_reports FOR DELETE
  USING (user_id = auth.uid());

-- Policies pour report_schedules
CREATE POLICY "Users can view their own schedules"
  ON report_schedules FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own schedules"
  ON report_schedules FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own schedules"
  ON report_schedules FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own schedules"
  ON report_schedules FOR DELETE
  USING (user_id = auth.uid());

-- Policies pour report_templates
CREATE POLICY "Users can view templates"
  ON report_templates FOR SELECT
  USING (is_built_in = true OR created_by = auth.uid());

CREATE POLICY "Users can insert their own templates"
  ON report_templates FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates"
  ON report_templates FOR UPDATE
  USING (created_by = auth.uid() AND is_built_in = false);

CREATE POLICY "Users can delete their own templates"
  ON report_templates FOR DELETE
  USING (created_by = auth.uid() AND is_built_in = false);

-- Policies pour report_analytics
CREATE POLICY "Users can view analytics of their reports"
  ON report_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_reports
      WHERE ai_reports.id = report_analytics.report_id
      AND ai_reports.user_id = auth.uid()
    )
  );

-- Commentaires
COMMENT ON TABLE ai_reports IS 'Rapports automatiques enrichis par IA';
COMMENT ON TABLE report_schedules IS 'Planifications de génération automatique de rapports';
COMMENT ON TABLE report_templates IS 'Modèles de rapports personnalisables';
COMMENT ON TABLE report_analytics IS 'Analytics et statistiques des rapports';
