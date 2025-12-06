-- Table pour l'historique des rapports PDF générés
CREATE TABLE IF NOT EXISTS public.pdf_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('audit', 'violations', 'dsar', 'full')),
  report_version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  score_global DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_report_version UNIQUE (user_id, report_type, report_version)
);

-- Table pour la planification des rapports automatiques
CREATE TABLE IF NOT EXISTS public.pdf_report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('audit', 'violations', 'dsar', 'full')),
  recipient_emails TEXT[] NOT NULL,
  schedule_cron TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_report_schedules ENABLE ROW LEVEL SECURITY;

-- Policies pour pdf_reports
CREATE POLICY "Users can view their own reports"
  ON public.pdf_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports"
  ON public.pdf_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON public.pdf_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour pdf_report_schedules
CREATE POLICY "Users can view their own schedules"
  ON public.pdf_report_schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules"
  ON public.pdf_report_schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
  ON public.pdf_report_schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules"
  ON public.pdf_report_schedules FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes pour performance
CREATE INDEX idx_pdf_reports_user_type ON public.pdf_reports(user_id, report_type);
CREATE INDEX idx_pdf_reports_created ON public.pdf_reports(created_at DESC);
CREATE INDEX idx_pdf_schedules_active ON public.pdf_report_schedules(is_active, next_run_at);

-- Trigger pour updated_at
CREATE TRIGGER update_pdf_schedules_updated_at
  BEFORE UPDATE ON public.pdf_report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();