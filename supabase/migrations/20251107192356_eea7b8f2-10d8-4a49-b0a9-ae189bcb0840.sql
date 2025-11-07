-- ============================================
-- Tables et buckets pour unified-api
-- ============================================

-- Table pour stocker les rapports de conformité
CREATE TABLE IF NOT EXISTS public.compliance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'annual', 'on-demand')),
  generated_at timestamptz NOT NULL DEFAULT now(),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  pdf_url text,
  html_content text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_compliance_reports_user_date 
  ON public.compliance_reports(user_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status 
  ON public.compliance_reports(status) WHERE status != 'completed';

-- RLS pour compliance_reports
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON public.compliance_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON public.compliance_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Table pour les backups blockchain
-- ============================================

CREATE TABLE IF NOT EXISTS public.blockchain_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_date timestamptz NOT NULL DEFAULT now(),
  block_count int NOT NULL,
  file_path text NOT NULL,
  file_size_bytes bigint,
  encryption_key_hash text,
  checksum text NOT NULL,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  restored_at timestamptz,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_blockchain_backups_date 
  ON public.blockchain_backups(backup_date DESC);

-- RLS pour blockchain_backups
ALTER TABLE public.blockchain_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all backups"
  ON public.blockchain_backups
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert backups"
  ON public.blockchain_backups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update backups"
  ON public.blockchain_backups
  FOR UPDATE
  USING (true);

-- ============================================
-- Table pour les notifications temps réel
-- ============================================

CREATE TABLE IF NOT EXISTS public.realtime_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  type text NOT NULL CHECK (type IN ('gdpr_violation', 'compliance_change', 'report_ready', 'backup_completed', 'system_alert')),
  read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  action_url text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_user_created 
  ON public.realtime_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_unread 
  ON public.realtime_notifications(user_id, read) WHERE read = false;

-- RLS pour realtime_notifications
ALTER TABLE public.realtime_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.realtime_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.realtime_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON public.realtime_notifications
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Trigger pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER compliance_reports_updated_at
  BEFORE UPDATE ON public.compliance_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Buckets Supabase Storage
-- ============================================

-- Bucket pour les rapports PDF
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gdpr-reports',
  'gdpr-reports',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'text/html']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les backups blockchain
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blockchain-backups',
  'blockchain-backups',
  false,
  104857600, -- 100MB limit
  ARRAY['application/json', 'application/octet-stream']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Policies Storage pour gdpr-reports
-- ============================================

CREATE POLICY "Users can read their own reports"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'gdpr-reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Service role can insert reports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gdpr-reports');

CREATE POLICY "Service role can update reports"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'gdpr-reports');

-- ============================================
-- Policies Storage pour blockchain-backups
-- ============================================

CREATE POLICY "Authenticated users can read backups"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'blockchain-backups' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Service role can insert backups"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blockchain-backups');

CREATE POLICY "Service role can update backups"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blockchain-backups');