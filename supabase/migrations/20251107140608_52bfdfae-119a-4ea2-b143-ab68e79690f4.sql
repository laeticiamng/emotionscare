-- Date: 20251107
-- Migration: GDPR Webhooks System
-- Système de webhooks RGPD avec retry automatique

/* 1. TABLE: webhook_endpoints - Configuration des endpoints */
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  secret_key text NOT NULL, -- Pour signer les payloads
  is_active boolean NOT NULL DEFAULT true,
  events text[] NOT NULL DEFAULT '{}', -- Types d'événements: consent_granted, consent_withdrawn, export_requested, data_deleted, etc.
  description text,
  headers jsonb DEFAULT '{}', -- Headers personnalisés
  retry_config jsonb DEFAULT '{"max_attempts": 3, "backoff_seconds": [30, 300, 3600]}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* 2. TABLE: webhook_deliveries - Historique des envois */
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid NOT NULL REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, success, failed, retrying
  attempts int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 3,
  next_retry_at timestamptz,
  http_status int,
  response_body text,
  error_message text,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* 3. TABLE: webhook_events - Log de tous les événements */
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  entity_type text NOT NULL, -- consent, export, deletion
  entity_id uuid,
  user_id uuid REFERENCES auth.users(id),
  event_data jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 4. INDEX pour performances */
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_active ON public.webhook_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_events ON public.webhook_endpoints USING GIN(events);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON public.webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON public.webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_retry ON public.webhook_deliveries(next_retry_at) WHERE status = 'retrying';
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed) WHERE processed = false;

/* 5. RLS Policies */
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent gérer les webhooks (pour l'instant tous les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view webhook endpoints" 
  ON public.webhook_endpoints FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage webhook endpoints" 
  ON public.webhook_endpoints FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Deliveries: lecture seule pour les utilisateurs
CREATE POLICY "Authenticated users can view webhook deliveries" 
  ON public.webhook_deliveries FOR SELECT 
  TO authenticated USING (true);

-- Events: système seulement
CREATE POLICY "Service role can manage webhook events" 
  ON public.webhook_events FOR ALL
  TO service_role USING (true) WITH CHECK (true);

/* 6. Trigger pour updated_at */
CREATE TRIGGER trigger_update_webhook_endpoints_updated_at
  BEFORE UPDATE ON public.webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION public.update_consent_updated_at();

CREATE TRIGGER trigger_update_webhook_deliveries_updated_at
  BEFORE UPDATE ON public.webhook_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_consent_updated_at();

/* 7. Fonction: Créer un événement webhook lors d'un changement de consentement */
CREATE OR REPLACE FUNCTION public.create_webhook_event_on_consent_change()
RETURNS TRIGGER AS $$
DECLARE
  v_event_type text;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.consent_given = true) THEN
    v_event_type := 'consent_granted';
  ELSIF (TG_OP = 'UPDATE' AND OLD.consent_given != NEW.consent_given) THEN
    v_event_type := CASE WHEN NEW.consent_given THEN 'consent_granted' ELSE 'consent_withdrawn' END;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.webhook_events (
    event_type,
    entity_type,
    entity_id,
    user_id,
    event_data
  ) VALUES (
    v_event_type,
    'consent',
    NEW.id,
    NEW.user_id,
    jsonb_build_object(
      'consent_id', NEW.id,
      'user_id', NEW.user_id,
      'channel_id', NEW.channel_id,
      'purpose_id', NEW.purpose_id,
      'consent_given', NEW.consent_given,
      'consent_date', NEW.consent_date,
      'source', NEW.source
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_webhook_consent_change
  AFTER INSERT OR UPDATE ON public.user_consent_preferences
  FOR EACH ROW EXECUTE FUNCTION public.create_webhook_event_on_consent_change();

/* 8. Fonction: Obtenir les webhooks à envoyer pour un événement */
CREATE OR REPLACE FUNCTION public.get_webhooks_for_event(p_event_type text)
RETURNS TABLE (
  webhook_id uuid,
  webhook_url text,
  webhook_secret text,
  webhook_headers jsonb,
  retry_config jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    url,
    secret_key,
    headers,
    webhook_endpoints.retry_config
  FROM public.webhook_endpoints
  WHERE is_active = true
    AND p_event_type = ANY(events);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 9. Fonction: Obtenir les statistiques des webhooks */
CREATE OR REPLACE FUNCTION public.get_webhook_statistics(p_webhook_id uuid DEFAULT NULL)
RETURNS TABLE (
  webhook_id uuid,
  webhook_name text,
  total_deliveries bigint,
  successful_deliveries bigint,
  failed_deliveries bigint,
  pending_deliveries bigint,
  success_rate numeric,
  avg_delivery_time_seconds numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    we.id as webhook_id,
    we.name as webhook_name,
    COUNT(wd.id) as total_deliveries,
    COUNT(wd.id) FILTER (WHERE wd.status = 'success') as successful_deliveries,
    COUNT(wd.id) FILTER (WHERE wd.status = 'failed') as failed_deliveries,
    COUNT(wd.id) FILTER (WHERE wd.status IN ('pending', 'retrying')) as pending_deliveries,
    CASE 
      WHEN COUNT(wd.id) > 0 THEN 
        ROUND((COUNT(wd.id) FILTER (WHERE wd.status = 'success')::numeric / COUNT(wd.id)::numeric) * 100, 2)
      ELSE 0
    END as success_rate,
    AVG(EXTRACT(EPOCH FROM (wd.delivered_at - wd.created_at))) FILTER (WHERE wd.delivered_at IS NOT NULL) as avg_delivery_time_seconds
  FROM public.webhook_endpoints we
  LEFT JOIN public.webhook_deliveries wd ON wd.webhook_id = we.id
  WHERE (p_webhook_id IS NULL OR we.id = p_webhook_id)
  GROUP BY we.id, we.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;