-- Tables simplifiées pour les nouvelles fonctionnalités

-- 1. Alertes de crise
CREATE TABLE IF NOT EXISTS public.crisis_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_snippet TEXT,
  crisis_score INTEGER,
  indicators JSONB,
  status TEXT DEFAULT 'detected',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crisis_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crisis_alerts_user_policy" ON public.crisis_alerts FOR ALL USING (auth.uid() = user_id);

-- 2. Logs d'export
CREATE TABLE IF NOT EXISTS public.data_export_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  export_type TEXT DEFAULT 'json',
  sections_exported TEXT[],
  exported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.data_export_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "export_logs_user_policy" ON public.data_export_logs FOR ALL USING (auth.uid() = user_id);

-- 3. Connexions wearables
CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT now(),
  last_sync TIMESTAMPTZ,
  metadata JSONB,
  UNIQUE(user_id, provider)
);
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wearable_conn_policy" ON public.wearable_connections FOR ALL USING (auth.uid() = user_id);

-- 4. Données de santé
CREATE TABLE IF NOT EXISTS public.health_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT,
  heart_rate INTEGER,
  hrv INTEGER,
  steps INTEGER,
  sleep_minutes INTEGER,
  stress_level INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health_data_policy" ON public.health_data FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_health_user_date ON public.health_data(user_id, recorded_at DESC);