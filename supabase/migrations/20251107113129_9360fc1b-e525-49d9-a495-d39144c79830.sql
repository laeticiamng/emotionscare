-- Table pour les alertes RGPD
CREATE TABLE IF NOT EXISTS public.gdpr_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('export_urgent', 'deletion_urgent', 'consent_anomaly', 'multiple_requests', 'suspicious_activity')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_gdpr_alerts_type ON public.gdpr_alerts(alert_type);
CREATE INDEX idx_gdpr_alerts_severity ON public.gdpr_alerts(severity);
CREATE INDEX idx_gdpr_alerts_resolved ON public.gdpr_alerts(resolved);
CREATE INDEX idx_gdpr_alerts_created_at ON public.gdpr_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE public.gdpr_alerts ENABLE ROW LEVEL SECURITY;

-- Policy pour admins (utiliser le bon enum app_role: 'admin' ou 'user')
CREATE POLICY "Admins can view all alerts"
ON public.gdpr_alerts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can update alerts"
ON public.gdpr_alerts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);

-- Fonction pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION public.update_gdpr_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger pour updated_at
CREATE TRIGGER update_gdpr_alerts_updated_at
BEFORE UPDATE ON public.gdpr_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_gdpr_alerts_updated_at();

-- Fonction pour détecter les anomalies de consentements
CREATE OR REPLACE FUNCTION public.detect_consent_anomaly()
RETURNS TRIGGER AS $$
DECLARE
  recent_denials INTEGER;
  total_consents INTEGER;
  denial_rate NUMERIC;
BEGIN
  -- Compter les refus récents (dernières 24h)
  SELECT COUNT(*) INTO recent_denials
  FROM public.user_consents
  WHERE consent_type = 'analytics'
  AND granted = FALSE
  AND created_at >= NOW() - INTERVAL '24 hours';

  -- Compter le total de consentements récents
  SELECT COUNT(*) INTO total_consents
  FROM public.user_consents
  WHERE created_at >= NOW() - INTERVAL '24 hours';

  -- Calculer le taux de refus
  IF total_consents > 10 THEN
    denial_rate := (recent_denials::NUMERIC / total_consents::NUMERIC) * 100;
    
    -- Si le taux de refus dépasse 70%, créer une alerte
    IF denial_rate > 70 THEN
      INSERT INTO public.gdpr_alerts (
        alert_type,
        severity,
        title,
        description,
        metadata
      ) VALUES (
        'consent_anomaly',
        'warning',
        'Taux élevé de refus de consentements',
        format('Taux de refus: %s%% sur les dernières 24h (%s refus sur %s)', 
          ROUND(denial_rate, 2), recent_denials, total_consents),
        jsonb_build_object(
          'denial_rate', denial_rate,
          'recent_denials', recent_denials,
          'total_consents', total_consents
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger pour détection d'anomalies (uniquement si la table user_consents existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_consents') THEN
    DROP TRIGGER IF EXISTS detect_consent_anomaly_trigger ON public.user_consents;
    CREATE TRIGGER detect_consent_anomaly_trigger
    AFTER INSERT ON public.user_consents
    FOR EACH ROW
    EXECUTE FUNCTION public.detect_consent_anomaly();
  END IF;
END $$;