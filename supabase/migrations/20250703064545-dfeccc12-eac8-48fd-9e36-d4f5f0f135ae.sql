-- Table pour stocker les configurations d'intégration API optimisées
CREATE TABLE public.api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  configuration JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  is_optimized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les logs de performance des intégrations
CREATE TABLE public.integration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  user_id UUID,
  request_type TEXT NOT NULL,
  response_time_ms INTEGER,
  status TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour api_integrations
CREATE POLICY "Public can view API integrations" 
ON public.api_integrations 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage API integrations" 
ON public.api_integrations 
FOR ALL 
USING (true);

-- Politiques RLS pour integration_logs
CREATE POLICY "Users can view their own integration logs" 
ON public.integration_logs 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage integration logs" 
ON public.integration_logs 
FOR ALL 
USING (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_integration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_integrations_updated_at
BEFORE UPDATE ON public.api_integrations
FOR EACH ROW
EXECUTE FUNCTION update_integration_updated_at();

-- Insérer la configuration optimisée Suno
INSERT INTO public.api_integrations (name, base_url, version, configuration, is_optimized) VALUES 
('suno_api', 'https://api.sunoapi.org/api', 'v1', '{
  "streaming": {
    "enabled": true,
    "wait_audio": false,
    "response_time_target_ms": 20000
  },
  "quality": {
    "model": "V4_5",
    "custom_mode": true,
    "instrumental_support": true
  },
  "optimization": {
    "stable_endpoint": true,
    "commercial_usage": true,
    "watermark_free": true
  },
  "rate_limits": {
    "requests_per_minute": 60,
    "concurrent_requests": 5
  }
}', true);