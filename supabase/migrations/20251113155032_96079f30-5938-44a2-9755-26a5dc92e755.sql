-- Table pour tracker l'envoi des rapports d'audit
CREATE TABLE IF NOT EXISTS public.audit_report_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipients TEXT[] NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  total_changes INTEGER DEFAULT 0,
  total_alerts INTEGER DEFAULT 0,
  critical_alerts INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_audit_report_logs_sent_at ON public.audit_report_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_report_logs_sent_by ON public.audit_report_logs(sent_by);

-- RLS Policies
ALTER TABLE public.audit_report_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les logs de rapports
CREATE POLICY "Admins can view report logs"
  ON public.audit_report_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Seuls les admins peuvent insérer des logs
CREATE POLICY "Admins can insert report logs"
  ON public.audit_report_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

COMMENT ON TABLE public.audit_report_logs IS 'Logs des rapports d''audit envoyés manuellement ou automatiquement';