-- Create table for executive business metrics
CREATE TABLE IF NOT EXISTS public.executive_business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_escalations INTEGER DEFAULT 0,
  cost_per_escalation DECIMAL(10,2) DEFAULT 0,
  total_escalation_cost DECIMAL(10,2) DEFAULT 0,
  ab_test_wins INTEGER DEFAULT 0,
  ab_test_roi_percentage DECIMAL(10,2) DEFAULT 0,
  ab_test_value_saved DECIMAL(10,2) DEFAULT 0,
  time_saved_hours DECIMAL(10,2) DEFAULT 0,
  automation_rate_percentage DECIMAL(5,2) DEFAULT 0,
  manual_interventions INTEGER DEFAULT 0,
  business_value_saved DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for date queries
CREATE INDEX IF NOT EXISTS idx_executive_metrics_date ON public.executive_business_metrics(metric_date DESC);

-- Enable RLS
ALTER TABLE public.executive_business_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read
CREATE POLICY "Authenticated users can read executive metrics"
ON public.executive_business_metrics
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only service role can insert/update
CREATE POLICY "Service role can insert executive metrics"
ON public.executive_business_metrics
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update executive metrics"
ON public.executive_business_metrics
FOR UPDATE
TO service_role
USING (true);

-- Create table for incident reports
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  affected_systems TEXT[],
  impact_description TEXT,
  
  -- Timeline of events
  timeline JSONB DEFAULT '[]'::jsonb,
  
  -- ML-generated analysis
  root_cause_analysis TEXT,
  root_cause_confidence DECIMAL(5,2),
  contributing_factors TEXT[],
  
  -- Recommendations
  corrective_actions TEXT[],
  preventive_measures TEXT[],
  
  -- Post-mortem
  post_mortem_template TEXT,
  lessons_learned TEXT[],
  
  -- Metrics
  downtime_minutes INTEGER,
  users_affected INTEGER,
  business_impact_cost DECIMAL(10,2),
  
  -- Related data
  related_alert_ids TEXT[],
  related_escalation_ids UUID[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_incident_reports_started_at ON public.incident_reports(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_severity ON public.incident_reports(severity);

-- Enable RLS
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all incidents
CREATE POLICY "Authenticated users can read incident reports"
ON public.incident_reports
FOR SELECT
TO authenticated
USING (true);

-- Policy: Service role can insert/update/delete
CREATE POLICY "Service role can manage incident reports"
ON public.incident_reports
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_executive_metrics_updated_at
BEFORE UPDATE ON public.executive_business_metrics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at
BEFORE UPDATE ON public.incident_reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample executive metrics for last 12 months
DO $$
DECLARE
  current_date DATE := CURRENT_DATE;
  i INTEGER;
BEGIN
  FOR i IN 0..365 LOOP
    INSERT INTO public.executive_business_metrics (
      metric_date,
      total_escalations,
      cost_per_escalation,
      total_escalation_cost,
      ab_test_wins,
      ab_test_roi_percentage,
      ab_test_value_saved,
      time_saved_hours,
      automation_rate_percentage,
      manual_interventions,
      business_value_saved
    ) VALUES (
      current_date - i,
      FLOOR(RANDOM() * 50 + 10)::INTEGER,
      ROUND((RANDOM() * 50 + 100)::NUMERIC, 2),
      ROUND((RANDOM() * 2500 + 1000)::NUMERIC, 2),
      FLOOR(RANDOM() * 3)::INTEGER,
      ROUND((RANDOM() * 15 + 5)::NUMERIC, 2),
      ROUND((RANDOM() * 5000 + 1000)::NUMERIC, 2),
      ROUND((RANDOM() * 8 + 2)::NUMERIC, 2),
      ROUND((RANDOM() * 20 + 60)::NUMERIC, 2),
      FLOOR(RANDOM() * 10 + 2)::INTEGER,
      ROUND((RANDOM() * 10000 + 5000)::NUMERIC, 2)
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;