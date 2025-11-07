-- Migration: Pseudonymization System
-- Tables pour la gestion de la pseudonymisation automatique avec règles configurables

-- 1. Table des règles de pseudonymisation
CREATE TABLE IF NOT EXISTS public.pseudonymization_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type text NOT NULL, -- 'email', 'phone', 'name', 'address', 'custom'
  field_name text NOT NULL, -- nom du champ concerné
  algorithm text NOT NULL, -- 'aes256', 'hmac', 'tokenization', 'format_preserving'
  is_reversible boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  retention_days integer, -- durée de conservation des données pseudonymisées
  auto_apply boolean NOT NULL DEFAULT false, -- application automatique
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(data_type, field_name)
);

-- 2. Table des clés de pseudonymisation (chiffrées)
CREATE TABLE IF NOT EXISTS public.pseudonymization_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES public.pseudonymization_rules(id) ON DELETE CASCADE,
  key_hash text NOT NULL, -- hash de la clé pour identification
  key_encrypted text NOT NULL, -- clé chiffrée avec la master key
  algorithm text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  rotation_count integer NOT NULL DEFAULT 0
);

-- 3. Table de mapping pour la réversibilité (tokenization)
CREATE TABLE IF NOT EXISTS public.pseudonymization_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES public.pseudonymization_rules(id) ON DELETE CASCADE,
  original_hash text NOT NULL, -- hash de la valeur originale (pour recherche)
  pseudonymized_value text NOT NULL,
  encrypted_original text NOT NULL, -- valeur originale chiffrée
  created_at timestamptz NOT NULL DEFAULT now(),
  accessed_count integer NOT NULL DEFAULT 0,
  last_accessed_at timestamptz,
  UNIQUE(rule_id, original_hash)
);

-- 4. Table de log des opérations de pseudonymisation
CREATE TABLE IF NOT EXISTS public.pseudonymization_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES public.pseudonymization_rules(id),
  operation text NOT NULL, -- 'pseudonymize', 'depseudonymize', 'rotate_key'
  data_type text NOT NULL,
  field_name text,
  success boolean NOT NULL,
  error_message text,
  records_affected integer,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- 5. Table des statistiques de pseudonymisation
CREATE TABLE IF NOT EXISTS public.pseudonymization_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES public.pseudonymization_rules(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  pseudonymized_count integer NOT NULL DEFAULT 0,
  depseudonymized_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  avg_processing_time_ms numeric(10,2),
  UNIQUE(rule_id, date)
);

-- RLS Policies
ALTER TABLE public.pseudonymization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pseudonymization_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pseudonymization_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pseudonymization_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pseudonymization_stats ENABLE ROW LEVEL SECURITY;

-- Policies pour pseudonymization_rules (admin only pour création/modification)
CREATE POLICY "Admins can manage pseudonymization rules"
  ON public.pseudonymization_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can view active pseudonymization rules"
  ON public.pseudonymization_rules
  FOR SELECT
  USING (is_active = true);

-- Policies pour pseudonymization_keys (admin only)
CREATE POLICY "Admins can manage pseudonymization keys"
  ON public.pseudonymization_keys
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies pour pseudonymization_mapping (système seulement via edge functions)
CREATE POLICY "Service role can manage pseudonymization mapping"
  ON public.pseudonymization_mapping
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Policies pour pseudonymization_log (admin lecture, système écriture)
CREATE POLICY "Admins can view pseudonymization logs"
  ON public.pseudonymization_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Service role can insert pseudonymization logs"
  ON public.pseudonymization_log
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() IS NOT NULL);

-- Policies pour pseudonymization_stats
CREATE POLICY "Admins can view pseudonymization stats"
  ON public.pseudonymization_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Service role can manage pseudonymization stats"
  ON public.pseudonymization_stats
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Fonction pour obtenir les règles actives par type de données
CREATE OR REPLACE FUNCTION get_active_pseudonymization_rules(p_data_type text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  data_type text,
  field_name text,
  algorithm text,
  is_reversible boolean,
  auto_apply boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.data_type,
    pr.field_name,
    pr.algorithm,
    pr.is_reversible,
    pr.auto_apply
  FROM public.pseudonymization_rules pr
  WHERE pr.is_active = true
    AND (p_data_type IS NULL OR pr.data_type = p_data_type)
  ORDER BY pr.data_type, pr.field_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques de pseudonymisation
CREATE OR REPLACE FUNCTION get_pseudonymization_statistics(
  p_rule_id uuid DEFAULT NULL,
  p_start_date date DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  rule_id uuid,
  data_type text,
  field_name text,
  total_pseudonymized bigint,
  total_depseudonymized bigint,
  total_failed bigint,
  avg_processing_time numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.data_type,
    pr.field_name,
    COALESCE(SUM(ps.pseudonymized_count), 0) as total_pseudonymized,
    COALESCE(SUM(ps.depseudonymized_count), 0) as total_depseudonymized,
    COALESCE(SUM(ps.failed_count), 0) as total_failed,
    COALESCE(AVG(ps.avg_processing_time_ms), 0) as avg_processing_time
  FROM public.pseudonymization_rules pr
  LEFT JOIN public.pseudonymization_stats ps 
    ON ps.rule_id = pr.id 
    AND ps.date BETWEEN p_start_date AND p_end_date
  WHERE (p_rule_id IS NULL OR pr.id = p_rule_id)
  GROUP BY pr.id, pr.data_type, pr.field_name
  ORDER BY total_pseudonymized DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_pseudonymization_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pseudonymization_rules_updated_at
  BEFORE UPDATE ON public.pseudonymization_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_pseudonymization_rules_updated_at();

-- Index pour performance
CREATE INDEX idx_pseudonymization_rules_data_type ON public.pseudonymization_rules(data_type) WHERE is_active = true;
CREATE INDEX idx_pseudonymization_rules_auto_apply ON public.pseudonymization_rules(auto_apply) WHERE is_active = true;
CREATE INDEX idx_pseudonymization_mapping_hash ON public.pseudonymization_mapping(rule_id, original_hash);
CREATE INDEX idx_pseudonymization_log_performed_at ON public.pseudonymization_log(performed_at DESC);
CREATE INDEX idx_pseudonymization_stats_date ON public.pseudonymization_stats(rule_id, date DESC);