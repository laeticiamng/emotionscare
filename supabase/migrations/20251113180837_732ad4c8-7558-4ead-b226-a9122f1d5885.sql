-- Create alert_configurations table for managing notification settings
CREATE TABLE IF NOT EXISTS public.alert_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- General settings
  enabled BOOLEAN NOT NULL DEFAULT true,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Threshold filters
  min_priority TEXT NOT NULL DEFAULT 'medium' CHECK (min_priority IN ('urgent', 'high', 'medium', 'low')),
  min_severity TEXT NOT NULL DEFAULT 'medium' CHECK (min_severity IN ('critical', 'high', 'medium', 'low')),
  included_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  excluded_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Notification channels
  notify_email BOOLEAN NOT NULL DEFAULT true,
  email_recipients TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  notify_slack BOOLEAN NOT NULL DEFAULT false,
  slack_webhook_url TEXT,
  slack_channel TEXT,
  
  notify_discord BOOLEAN NOT NULL DEFAULT false,
  discord_webhook_url TEXT,
  discord_username TEXT DEFAULT 'EmotionsCare Monitor',
  
  -- Advanced settings
  throttle_minutes INTEGER DEFAULT 5,
  max_alerts_per_hour INTEGER DEFAULT 10,
  require_alert_flag BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  last_triggered_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.alert_configurations ENABLE ROW LEVEL SECURITY;

-- Admin users can manage alert configurations
CREATE POLICY "Admins can view alert configurations"
ON public.alert_configurations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert alert configurations"
ON public.alert_configurations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update alert configurations"
ON public.alert_configurations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete alert configurations"
ON public.alert_configurations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create indexes for performance
CREATE INDEX idx_alert_configs_enabled ON public.alert_configurations(enabled);
CREATE INDEX idx_alert_configs_priority ON public.alert_configurations(min_priority);
CREATE INDEX idx_alert_configs_categories ON public.alert_configurations USING GIN(included_categories);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_alert_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alert_configurations_updated_at
  BEFORE UPDATE ON public.alert_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_alert_config_updated_at();

-- Insert default configuration
INSERT INTO public.alert_configurations (
  name,
  description,
  min_priority,
  min_severity,
  notify_email,
  email_recipients,
  require_alert_flag
) VALUES (
  'Default Critical Alerts',
  'Configuration par défaut pour les erreurs critiques nécessitant une attention immédiate',
  'urgent',
  'critical',
  true,
  ARRAY[COALESCE(current_setting('app.admin_email', true), 'admin@emotionscare.com')]::TEXT[],
  true
) ON CONFLICT DO NOTHING;