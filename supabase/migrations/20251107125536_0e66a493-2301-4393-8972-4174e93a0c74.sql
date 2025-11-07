-- Migration: Système de rétention automatique des données RGPD
-- Date: 2025-01-XX
-- Description: Tables pour gérer la rétention, l'archivage et les notifications

-- Table des règles de rétention par type de données
CREATE TABLE IF NOT EXISTS public.data_retention_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL UNIQUE, -- 'journal_entries', 'emotion_scans', 'assessments', etc.
  retention_days INTEGER NOT NULL DEFAULT 365,
  archive_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_delete_enabled BOOLEAN NOT NULL DEFAULT false,
  notification_days_before INTEGER NOT NULL DEFAULT 30, -- Notifier X jours avant expiration
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT valid_retention_days CHECK (retention_days > 0 AND retention_days <= 3650),
  CONSTRAINT valid_notification_days CHECK (notification_days_before > 0 AND notification_days_before <= 365)
);

-- Table des données archivées avant suppression
CREATE TABLE IF NOT EXISTS public.data_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  original_data JSONB NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ,
  reason TEXT DEFAULT 'retention_policy',
  CONSTRAINT valid_expiration CHECK (expires_at > archived_at)
);

-- Table des notifications d'expiration
CREATE TABLE IF NOT EXISTS public.retention_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entities_count INTEGER NOT NULL DEFAULT 0,
  expiration_date DATE NOT NULL,
  notification_type TEXT NOT NULL, -- 'warning', 'final_warning', 'expired'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_data_archives_user ON data_archives(user_id, archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_archives_entity ON data_archives(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_data_archives_expires ON data_archives(expires_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_retention_notifs_user ON retention_notifications(user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_retention_notifs_acknowledged ON retention_notifications(user_id, acknowledged) WHERE NOT acknowledged;

-- Enable RLS
ALTER TABLE public.data_retention_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour data_retention_rules (admin only)
CREATE POLICY "Admins can view retention rules"
  ON public.data_retention_rules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage retention rules"
  ON public.data_retention_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies pour data_archives
CREATE POLICY "Users can view their own archives"
  ON public.data_archives
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all archives"
  ON public.data_archives
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can manage archives"
  ON public.data_archives
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies pour retention_notifications
CREATE POLICY "Users can view their notifications"
  ON public.retention_notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can acknowledge their notifications"
  ON public.retention_notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.retention_notifications
  FOR INSERT
  WITH CHECK (true);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_retention_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour updated_at
CREATE TRIGGER update_retention_rules_timestamp
  BEFORE UPDATE ON public.data_retention_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_retention_rules_updated_at();

-- Insérer des règles par défaut
INSERT INTO public.data_retention_rules (entity_type, retention_days, archive_enabled, auto_delete_enabled, notification_days_before)
VALUES
  ('journal_entries', 730, true, false, 30), -- 2 ans
  ('emotion_scans', 365, true, false, 30), -- 1 an
  ('assessment_results', 1095, true, false, 60), -- 3 ans
  ('coach_logs', 180, true, true, 14), -- 6 mois (auto-delete)
  ('user_activity_logs', 90, false, true, 7), -- 3 mois (auto-delete sans archive)
  ('audit_logs', 2555, true, false, 90) -- 7 ans (obligation légale)
ON CONFLICT (entity_type) DO NOTHING;

-- Fonction pour archiver automatiquement les données expirées
CREATE OR REPLACE FUNCTION public.archive_expired_data(
  p_entity_type TEXT,
  p_retention_days INTEGER
)
RETURNS TABLE(archived_count INTEGER) AS $$
DECLARE
  v_archived_count INTEGER := 0;
BEGIN
  -- Cette fonction sera appelée par l'edge function
  -- Elle identifie et archive les données expirées selon les règles
  
  CASE p_entity_type
    WHEN 'journal_entries' THEN
      INSERT INTO public.data_archives (entity_type, entity_id, user_id, original_data, expires_at)
      SELECT 
        'journal_entries',
        id,
        user_id,
        to_jsonb(journal_entries.*),
        now() + INTERVAL '30 days' -- 30 jours d'archive avant suppression définitive
      FROM public.journal_entries
      WHERE created_at < now() - (p_retention_days || ' days')::INTERVAL
        AND id NOT IN (SELECT entity_id FROM public.data_archives WHERE entity_type = 'journal_entries');
      
      GET DIAGNOSTICS v_archived_count = ROW_COUNT;
      
    WHEN 'emotion_scans' THEN
      INSERT INTO public.data_archives (entity_type, entity_id, user_id, original_data, expires_at)
      SELECT 
        'emotion_scans',
        id,
        user_id,
        to_jsonb(emotion_scans.*),
        now() + INTERVAL '30 days'
      FROM public.emotion_scans
      WHERE created_at < now() - (p_retention_days || ' days')::INTERVAL
        AND id NOT IN (SELECT entity_id FROM public.data_archives WHERE entity_type = 'emotion_scans');
      
      GET DIAGNOSTICS v_archived_count = ROW_COUNT;
      
    WHEN 'coach_logs' THEN
      INSERT INTO public.data_archives (entity_type, entity_id, user_id, original_data, expires_at)
      SELECT 
        'coach_logs',
        id,
        user_id,
        to_jsonb(coach_logs.*),
        now() + INTERVAL '30 days'
      FROM public.coach_logs
      WHERE created_at < now() - (p_retention_days || ' days')::INTERVAL
        AND id NOT IN (SELECT entity_id FROM public.data_archives WHERE entity_type = 'coach_logs');
      
      GET DIAGNOSTICS v_archived_count = ROW_COUNT;
  END CASE;
  
  RETURN QUERY SELECT v_archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;