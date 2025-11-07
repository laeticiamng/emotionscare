-- Date: 20251107
-- Migration: Consent Management System
-- Système de gestion granulaire du consentement

/* 1. TABLE: consent_channels - Canaux de communication disponibles */
CREATE TABLE IF NOT EXISTS public.consent_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_code text UNIQUE NOT NULL, -- 'email', 'sms', 'push', 'phone', etc.
  channel_name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 2. TABLE: consent_purposes - Finalités du consentement */
CREATE TABLE IF NOT EXISTS public.consent_purposes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purpose_code text UNIQUE NOT NULL, -- 'marketing', 'analytics', 'research', etc.
  purpose_name text NOT NULL,
  description text,
  legal_basis text, -- 'consent', 'legitimate_interest', etc.
  is_required boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 3. TABLE: user_consent_preferences - Préférences utilisateur */
CREATE TABLE IF NOT EXISTS public.user_consent_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id uuid NOT NULL REFERENCES public.consent_channels(id) ON DELETE CASCADE,
  purpose_id uuid NOT NULL REFERENCES public.consent_purposes(id) ON DELETE CASCADE,
  consent_given boolean NOT NULL DEFAULT false,
  consent_date timestamptz,
  withdrawal_date timestamptz,
  source text, -- 'web', 'mobile', 'api', 'admin'
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, channel_id, purpose_id)
);

/* 4. TABLE: consent_history - Historique des changements */
CREATE TABLE IF NOT EXISTS public.consent_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id uuid NOT NULL REFERENCES public.consent_channels(id),
  purpose_id uuid NOT NULL REFERENCES public.consent_purposes(id),
  previous_consent boolean,
  new_consent boolean NOT NULL,
  change_type text NOT NULL, -- 'granted', 'withdrawn', 'updated'
  source text,
  ip_address inet,
  user_agent text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 5. TABLE: marketing_campaigns - Campagnes marketing */
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_code text UNIQUE NOT NULL,
  campaign_name text NOT NULL,
  description text,
  channel_id uuid NOT NULL REFERENCES public.consent_channels(id),
  purpose_id uuid NOT NULL REFERENCES public.consent_purposes(id),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'paused', 'completed'
  target_audience jsonb, -- Critères de ciblage
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* 6. TABLE: campaign_consents - Consentements validés par campagne */
CREATE TABLE IF NOT EXISTS public.campaign_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_validated_at timestamptz NOT NULL DEFAULT now(),
  consent_preference_id uuid REFERENCES public.user_consent_preferences(id),
  can_contact boolean NOT NULL DEFAULT true,
  validation_notes text,
  UNIQUE(campaign_id, user_id)
);

/* 7. INDEX pour performances */
CREATE INDEX IF NOT EXISTS idx_user_consent_prefs_user ON public.user_consent_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_prefs_channel ON public.user_consent_preferences(channel_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_prefs_purpose ON public.user_consent_preferences(purpose_id);
CREATE INDEX IF NOT EXISTS idx_consent_history_user ON public.consent_history(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_history_created ON public.consent_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_consents_campaign ON public.campaign_consents(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_consents_user ON public.campaign_consents(user_id);

/* 8. RLS Policies */
ALTER TABLE public.consent_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consent_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_consents ENABLE ROW LEVEL SECURITY;

-- Channels et purposes: lecture publique
CREATE POLICY "Channels visible by all authenticated users" 
  ON public.consent_channels FOR SELECT 
  TO authenticated USING (is_active = true);

CREATE POLICY "Purposes visible by all authenticated users" 
  ON public.consent_purposes FOR SELECT 
  TO authenticated USING (is_active = true);

-- User consent preferences: users can view/update their own
CREATE POLICY "Users can view their own consent preferences" 
  ON public.user_consent_preferences FOR SELECT 
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent preferences" 
  ON public.user_consent_preferences FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consent preferences" 
  ON public.user_consent_preferences FOR UPDATE 
  TO authenticated USING (auth.uid() = user_id);

-- Consent history: users can view their own
CREATE POLICY "Users can view their own consent history" 
  ON public.consent_history FOR SELECT 
  TO authenticated USING (auth.uid() = user_id);

-- Marketing campaigns: visible to authenticated users
CREATE POLICY "Authenticated users can view active campaigns" 
  ON public.marketing_campaigns FOR SELECT 
  TO authenticated USING (status IN ('active', 'scheduled'));

-- Campaign consents: users can view their own
CREATE POLICY "Users can view their own campaign consents" 
  ON public.campaign_consents FOR SELECT 
  TO authenticated USING (auth.uid() = user_id);

/* 9. Triggers pour l'historique */
CREATE OR REPLACE FUNCTION public.track_consent_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.consent_history (
      user_id, channel_id, purpose_id, 
      previous_consent, new_consent, change_type,
      source, ip_address, user_agent
    ) VALUES (
      NEW.user_id, NEW.channel_id, NEW.purpose_id,
      NULL, NEW.consent_given, 'granted',
      NEW.source, NEW.ip_address, NEW.user_agent
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.consent_given != NEW.consent_given THEN
      INSERT INTO public.consent_history (
        user_id, channel_id, purpose_id,
        previous_consent, new_consent, change_type,
        source, ip_address, user_agent
      ) VALUES (
        NEW.user_id, NEW.channel_id, NEW.purpose_id,
        OLD.consent_given, NEW.consent_given,
        CASE WHEN NEW.consent_given THEN 'granted' ELSE 'withdrawn' END,
        NEW.source, NEW.ip_address, NEW.user_agent
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_consent_changes
  AFTER INSERT OR UPDATE ON public.user_consent_preferences
  FOR EACH ROW EXECUTE FUNCTION public.track_consent_changes();

/* 10. Trigger pour updated_at */
CREATE OR REPLACE FUNCTION public.update_consent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_consent_preferences_updated_at
  BEFORE UPDATE ON public.user_consent_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_consent_updated_at();

CREATE TRIGGER trigger_update_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_consent_updated_at();

/* 11. Fonction: Obtenir le statut de consentement d'un utilisateur */
CREATE OR REPLACE FUNCTION public.get_user_consent_status(p_user_id uuid)
RETURNS TABLE (
  channel_code text,
  channel_name text,
  purpose_code text,
  purpose_name text,
  consent_given boolean,
  consent_date timestamptz,
  last_updated timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.channel_code,
    cc.channel_name,
    cp.purpose_code,
    cp.purpose_name,
    COALESCE(ucp.consent_given, false) as consent_given,
    ucp.consent_date,
    ucp.updated_at as last_updated
  FROM public.consent_channels cc
  CROSS JOIN public.consent_purposes cp
  LEFT JOIN public.user_consent_preferences ucp 
    ON ucp.channel_id = cc.id 
    AND ucp.purpose_id = cp.id 
    AND ucp.user_id = p_user_id
  WHERE cc.is_active = true AND cp.is_active = true
  ORDER BY cc.channel_code, cp.purpose_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 12. Fonction: Valider les consentements pour une campagne */
CREATE OR REPLACE FUNCTION public.validate_campaign_consents(p_campaign_id uuid)
RETURNS TABLE (
  user_id uuid,
  can_contact boolean,
  reason text
) AS $$
DECLARE
  v_channel_id uuid;
  v_purpose_id uuid;
BEGIN
  -- Récupérer channel et purpose de la campagne
  SELECT channel_id, purpose_id INTO v_channel_id, v_purpose_id
  FROM public.marketing_campaigns
  WHERE id = p_campaign_id;

  RETURN QUERY
  SELECT 
    u.id as user_id,
    COALESCE(ucp.consent_given, false) as can_contact,
    CASE 
      WHEN ucp.consent_given THEN 'Consent granted'
      WHEN ucp.consent_given = false THEN 'Consent withdrawn'
      ELSE 'No consent recorded'
    END as reason
  FROM auth.users u
  LEFT JOIN public.user_consent_preferences ucp 
    ON ucp.user_id = u.id 
    AND ucp.channel_id = v_channel_id 
    AND ucp.purpose_id = v_purpose_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 13. Seed data - Canaux par défaut */
INSERT INTO public.consent_channels (channel_code, channel_name, description) VALUES
  ('email', 'Email', 'Communications par courrier électronique'),
  ('sms', 'SMS', 'Messages texte sur mobile'),
  ('push', 'Push Notifications', 'Notifications push sur app mobile/web'),
  ('phone', 'Téléphone', 'Appels téléphoniques'),
  ('postal', 'Courrier postal', 'Communications par courrier postal')
ON CONFLICT (channel_code) DO NOTHING;

/* 14. Seed data - Finalités par défaut */
INSERT INTO public.consent_purposes (purpose_code, purpose_name, description, legal_basis, is_required) VALUES
  ('marketing', 'Marketing', 'Campagnes marketing et promotions', 'consent', false),
  ('newsletter', 'Newsletter', 'Newsletters et actualités', 'consent', false),
  ('product_updates', 'Mises à jour produit', 'Informations sur les produits et services', 'consent', false),
  ('research', 'Études et recherches', 'Participation aux études cliniques', 'consent', false),
  ('service', 'Communications de service', 'Notifications essentielles au service', 'legitimate_interest', true),
  ('transactional', 'Transactionnel', 'Confirmations et reçus', 'legitimate_interest', true)
ON CONFLICT (purpose_code) DO NOTHING;