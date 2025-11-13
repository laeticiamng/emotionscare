-- Create monitoring_events table for AI-analyzed application events
CREATE TABLE IF NOT EXISTS public.monitoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL CHECK (event_type IN ('error', 'warning', 'info', 'performance', 'user_action')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  context TEXT NOT NULL CHECK (context IN ('AUTH', 'API', 'UI', 'SCAN', 'VR', 'MUSIC', 'ANALYTICS', 'SYSTEM', 'ERROR_BOUNDARY', 'SESSION', 'CONSENT', 'SOCIAL', 'NYVEE', 'WHO5', 'STAI6', 'BREATH', 'FLASH', 'MIXER', 'SCORES', 'COACH')),
  ai_analysis JSONB,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_monitoring_events_timestamp ON public.monitoring_events(timestamp DESC);
CREATE INDEX idx_monitoring_events_user_id ON public.monitoring_events(user_id);
CREATE INDEX idx_monitoring_events_severity ON public.monitoring_events(severity);
CREATE INDEX idx_monitoring_events_context ON public.monitoring_events(context);
CREATE INDEX idx_monitoring_events_event_type ON public.monitoring_events(event_type);

-- Enable Row Level Security
ALTER TABLE public.monitoring_events ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can view all monitoring events
CREATE POLICY "Admin users can view all monitoring events"
ON public.monitoring_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Users can view their own monitoring events
CREATE POLICY "Users can view their own monitoring events"
ON public.monitoring_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can insert monitoring events
CREATE POLICY "Service role can insert monitoring events"
ON public.monitoring_events
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Authenticated users can insert their own monitoring events
CREATE POLICY "Authenticated users can insert their own events"
ON public.monitoring_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create a function to clean old monitoring events (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_monitoring_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete events older than 90 days
  DELETE FROM public.monitoring_events
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cleanup_old_monitoring_events() TO authenticated;