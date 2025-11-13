CREATE TABLE IF NOT EXISTS public.scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  recipient_emails TEXT[] NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
  time_of_day TIME NOT NULL DEFAULT '09:00:00',
  timezone TEXT NOT NULL DEFAULT 'Europe/Paris',
  include_charts BOOLEAN DEFAULT true,
  date_range_days INTEGER DEFAULT 7 CHECK (date_range_days > 0),
  format TEXT NOT NULL DEFAULT 'pdf' CHECK (format IN ('pdf', 'csv', 'both')),
  filters JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read scheduled_reports" ON public.scheduled_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert scheduled_reports" ON public.scheduled_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update scheduled_reports" ON public.scheduled_reports FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete scheduled_reports" ON public.scheduled_reports FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_scheduled_reports_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scheduled_reports_updated_at BEFORE UPDATE ON public.scheduled_reports FOR EACH ROW EXECUTE FUNCTION update_scheduled_reports_updated_at();

CREATE TABLE IF NOT EXISTS public.report_send_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_report_id UUID REFERENCES public.scheduled_reports(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT now(),
  recipient_emails TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  report_data JSONB
);

ALTER TABLE public.report_send_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read report_send_history" ON public.report_send_history FOR SELECT TO authenticated USING (true);