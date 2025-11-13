-- Table pour stocker l'historique des erreurs analysées par l'AI
CREATE TABLE IF NOT EXISTS public.ai_monitoring_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Info erreur
  error_type TEXT NOT NULL CHECK (error_type IN ('error', 'performance', 'user_feedback', 'custom')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_agent TEXT,
  context JSONB,
  
  -- Info utilisateur
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Analyse AI
  ai_analysis JSONB NOT NULL,
  is_known_issue BOOLEAN DEFAULT false,
  priority TEXT NOT NULL CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  category TEXT NOT NULL,
  needs_alert BOOLEAN DEFAULT false,
  
  -- Gestion
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_ai_monitoring_errors_created_at ON public.ai_monitoring_errors(created_at DESC);
CREATE INDEX idx_ai_monitoring_errors_severity ON public.ai_monitoring_errors(severity);
CREATE INDEX idx_ai_monitoring_errors_priority ON public.ai_monitoring_errors(priority);
CREATE INDEX idx_ai_monitoring_errors_category ON public.ai_monitoring_errors(category);
CREATE INDEX idx_ai_monitoring_errors_resolved ON public.ai_monitoring_errors(resolved);
CREATE INDEX idx_ai_monitoring_errors_needs_alert ON public.ai_monitoring_errors(needs_alert);

-- RLS policies
ALTER TABLE public.ai_monitoring_errors ENABLE ROW LEVEL SECURITY;

-- Policy: Seuls les admins peuvent voir les erreurs
CREATE POLICY "Admins can view all errors"
  ON public.ai_monitoring_errors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Seuls les admins peuvent marquer comme résolues
CREATE POLICY "Admins can update errors"
  ON public.ai_monitoring_errors
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: L'edge function peut insérer (service_role)
CREATE POLICY "Service role can insert errors"
  ON public.ai_monitoring_errors
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fonction pour nettoyer les vieilles erreurs (> 90 jours)
CREATE OR REPLACE FUNCTION public.cleanup_old_monitoring_errors()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.ai_monitoring_errors
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND resolved = true;
END;
$$;

-- Vue pour statistiques rapides
CREATE OR REPLACE VIEW public.ai_monitoring_stats AS
SELECT 
  COUNT(*) as total_errors,
  COUNT(*) FILTER (WHERE resolved = false) as unresolved_errors,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_errors,
  COUNT(*) FILTER (WHERE severity = 'high') as high_errors,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_errors,
  COUNT(*) FILTER (WHERE needs_alert = true) as alert_needed_errors,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as errors_last_24h,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as errors_last_7d,
  COUNT(DISTINCT category) as unique_categories
FROM public.ai_monitoring_errors;