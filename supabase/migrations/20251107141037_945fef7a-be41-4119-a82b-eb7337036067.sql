-- Date: 20251107
-- Migration: GDPR Compliance Audit System
-- Système d'audit automatisé de conformité RGPD

/* 1. TABLE: compliance_audits - Audits de conformité */
CREATE TABLE IF NOT EXISTS public.compliance_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_date timestamptz NOT NULL DEFAULT now(),
  overall_score numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress', -- in_progress, completed, failed
  audit_type text NOT NULL DEFAULT 'automatic', -- automatic, manual, scheduled
  triggered_by uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  report_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 2. TABLE: compliance_categories - Catégories d'audit */
CREATE TABLE IF NOT EXISTS public.compliance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  weight numeric(3,2) NOT NULL DEFAULT 1.0, -- Poids dans le score global
  max_score int NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 3. TABLE: compliance_scores - Scores par catégorie */
CREATE TABLE IF NOT EXISTS public.compliance_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES public.compliance_audits(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.compliance_categories(id),
  score numeric(5,2) NOT NULL DEFAULT 0,
  max_score int NOT NULL DEFAULT 100,
  checks_passed int NOT NULL DEFAULT 0,
  checks_total int NOT NULL DEFAULT 0,
  findings jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(audit_id, category_id)
);

/* 4. TABLE: compliance_recommendations - Recommandations */
CREATE TABLE IF NOT EXISTS public.compliance_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES public.compliance_audits(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.compliance_categories(id),
  severity text NOT NULL, -- critical, high, medium, low
  priority int NOT NULL DEFAULT 0,
  title text NOT NULL,
  description text NOT NULL,
  impact text,
  remediation text,
  status text NOT NULL DEFAULT 'open', -- open, in_progress, resolved, dismissed
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 5. TABLE: compliance_checks - Contrôles individuels */
CREATE TABLE IF NOT EXISTS public.compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.compliance_categories(id),
  check_code text UNIQUE NOT NULL,
  check_name text NOT NULL,
  description text,
  query_function text, -- Nom de la fonction SQL à exécuter
  expected_result text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 6. INDEX pour performances */
CREATE INDEX IF NOT EXISTS idx_compliance_audits_date ON public.compliance_audits(audit_date DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_audits_status ON public.compliance_audits(status);
CREATE INDEX IF NOT EXISTS idx_compliance_scores_audit ON public.compliance_scores(audit_id);
CREATE INDEX IF NOT EXISTS idx_compliance_recommendations_audit ON public.compliance_recommendations(audit_id);
CREATE INDEX IF NOT EXISTS idx_compliance_recommendations_severity ON public.compliance_recommendations(severity);
CREATE INDEX IF NOT EXISTS idx_compliance_recommendations_status ON public.compliance_recommendations(status);

/* 7. RLS Policies */
ALTER TABLE public.compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view compliance audits" 
  ON public.compliance_audits FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create compliance audits" 
  ON public.compliance_audits FOR INSERT 
  TO authenticated WITH CHECK (true);

CREATE POLICY "Categories visible to authenticated users" 
  ON public.compliance_categories FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Scores visible to authenticated users" 
  ON public.compliance_scores FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Recommendations visible to authenticated users" 
  ON public.compliance_recommendations FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can update recommendations" 
  ON public.compliance_recommendations FOR UPDATE 
  TO authenticated USING (true);

CREATE POLICY "Checks visible to authenticated users" 
  ON public.compliance_checks FOR SELECT 
  TO authenticated USING (true);

/* 8. Seed data - Catégories de conformité */
INSERT INTO public.compliance_categories (code, name, description, weight, max_score) VALUES
  ('consent', 'Gestion du consentement', 'Conformité des mécanismes de consentement et préférences utilisateur', 1.5, 100),
  ('data_minimization', 'Minimisation des données', 'Collecte et conservation uniquement des données nécessaires', 1.2, 100),
  ('access_control', 'Contrôle d''accès', 'Sécurité et contrôle des accès aux données personnelles', 1.3, 100),
  ('retention', 'Rétention des données', 'Politiques de conservation et suppression des données', 1.1, 100),
  ('transparency', 'Transparence', 'Information claire sur le traitement des données', 1.0, 100),
  ('user_rights', 'Droits des utilisateurs', 'Facilitation des droits d''accès, rectification, suppression', 1.4, 100),
  ('security', 'Sécurité technique', 'Mesures de sécurité technique et organisationnelle', 1.5, 100),
  ('documentation', 'Documentation', 'Tenue des registres et documentation des traitements', 0.9, 100)
ON CONFLICT (code) DO NOTHING;

/* 9. Fonction: Calculer le score de consentement */
CREATE OR REPLACE FUNCTION public.audit_consent_compliance()
RETURNS jsonb AS $$
DECLARE
  v_total_users bigint;
  v_users_with_consent bigint;
  v_active_consents bigint;
  v_consent_rate numeric;
  v_score numeric;
  v_findings jsonb;
BEGIN
  -- Compter les utilisateurs
  SELECT COUNT(DISTINCT id) INTO v_total_users FROM auth.users;
  
  -- Utilisateurs ayant donné au moins un consentement
  SELECT COUNT(DISTINCT user_id) INTO v_users_with_consent
  FROM public.user_consent_preferences
  WHERE consent_given = true;
  
  -- Consentements actifs
  SELECT COUNT(*) INTO v_active_consents
  FROM public.user_consent_preferences
  WHERE consent_given = true;
  
  -- Calculer le taux
  v_consent_rate := CASE 
    WHEN v_total_users > 0 THEN (v_users_with_consent::numeric / v_total_users::numeric) * 100
    ELSE 0
  END;
  
  -- Calculer le score (100 si > 80%, proportionnel sinon)
  v_score := CASE
    WHEN v_consent_rate >= 80 THEN 100
    WHEN v_consent_rate >= 50 THEN 70 + (v_consent_rate - 50) * 0.6
    ELSE v_consent_rate * 1.4
  END;
  
  v_findings := jsonb_build_array(
    jsonb_build_object(
      'metric', 'Taux de consentement',
      'value', ROUND(v_consent_rate, 2),
      'status', CASE WHEN v_consent_rate >= 80 THEN 'pass' ELSE 'warning' END
    ),
    jsonb_build_object(
      'metric', 'Utilisateurs avec consentement',
      'value', v_users_with_consent,
      'total', v_total_users,
      'status', CASE WHEN v_consent_rate >= 50 THEN 'pass' ELSE 'fail' END
    )
  );
  
  RETURN jsonb_build_object(
    'score', ROUND(v_score, 2),
    'max_score', 100,
    'checks_passed', CASE WHEN v_consent_rate >= 80 THEN 2 WHEN v_consent_rate >= 50 THEN 1 ELSE 0 END,
    'checks_total', 2,
    'findings', v_findings
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 10. Fonction: Calculer le score de rétention */
CREATE OR REPLACE FUNCTION public.audit_retention_compliance()
RETURNS jsonb AS $$
DECLARE
  v_policies_count bigint;
  v_active_policies bigint;
  v_score numeric;
  v_findings jsonb;
BEGIN
  -- Compter les politiques de rétention
  SELECT COUNT(*) INTO v_policies_count
  FROM public.data_retention_rules;
  
  SELECT COUNT(*) INTO v_active_policies
  FROM public.data_retention_rules
  WHERE is_active = true;
  
  -- Score basé sur l'existence de politiques
  v_score := CASE
    WHEN v_active_policies >= 5 THEN 100
    WHEN v_active_policies >= 3 THEN 75
    WHEN v_active_policies >= 1 THEN 50
    ELSE 20
  END;
  
  v_findings := jsonb_build_array(
    jsonb_build_object(
      'metric', 'Politiques de rétention actives',
      'value', v_active_policies,
      'status', CASE WHEN v_active_policies >= 3 THEN 'pass' ELSE 'warning' END
    )
  );
  
  RETURN jsonb_build_object(
    'score', v_score,
    'max_score', 100,
    'checks_passed', CASE WHEN v_active_policies >= 3 THEN 1 ELSE 0 END,
    'checks_total', 1,
    'findings', v_findings
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 11. Fonction: Calculer le score de droits utilisateurs */
CREATE OR REPLACE FUNCTION public.audit_user_rights_compliance()
RETURNS jsonb AS $$
DECLARE
  v_export_requests bigint;
  v_completed_exports bigint;
  v_avg_completion_days numeric;
  v_score numeric;
  v_findings jsonb;
BEGIN
  -- Statistiques des exports
  SELECT COUNT(*) INTO v_export_requests FROM public.export_jobs;
  
  SELECT COUNT(*) INTO v_completed_exports
  FROM public.export_jobs
  WHERE status = 'completed';
  
  SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 86400)
  INTO v_avg_completion_days
  FROM public.export_jobs
  WHERE completed_at IS NOT NULL;
  
  -- Score basé sur le délai moyen
  v_score := CASE
    WHEN v_avg_completion_days IS NULL THEN 80 -- Pas de données = bénéfice du doute
    WHEN v_avg_completion_days <= 1 THEN 100
    WHEN v_avg_completion_days <= 7 THEN 90
    WHEN v_avg_completion_days <= 30 THEN 70
    ELSE 40
  END;
  
  v_findings := jsonb_build_array(
    jsonb_build_object(
      'metric', 'Délai moyen d''export',
      'value', ROUND(COALESCE(v_avg_completion_days, 0), 1),
      'unit', 'jours',
      'status', CASE WHEN COALESCE(v_avg_completion_days, 0) <= 7 THEN 'pass' ELSE 'warning' END
    ),
    jsonb_build_object(
      'metric', 'Taux de complétion',
      'value', CASE WHEN v_export_requests > 0 THEN ROUND((v_completed_exports::numeric / v_export_requests::numeric) * 100, 2) ELSE 0 END,
      'status', 'pass'
    )
  );
  
  RETURN jsonb_build_object(
    'score', v_score,
    'max_score', 100,
    'checks_passed', CASE WHEN COALESCE(v_avg_completion_days, 0) <= 30 THEN 2 ELSE 1 END,
    'checks_total', 2,
    'findings', v_findings
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 12. Fonction: Calculer le score de sécurité */
CREATE OR REPLACE FUNCTION public.audit_security_compliance()
RETURNS jsonb AS $$
DECLARE
  v_anomalies bigint;
  v_critical_anomalies bigint;
  v_pseudonymization_rules bigint;
  v_score numeric;
  v_findings jsonb;
BEGIN
  -- Anomalies détectées
  SELECT COUNT(*) INTO v_anomalies
  FROM public.access_anomalies
  WHERE detected_at >= NOW() - INTERVAL '30 days';
  
  SELECT COUNT(*) INTO v_critical_anomalies
  FROM public.access_anomalies
  WHERE detected_at >= NOW() - INTERVAL '30 days'
    AND severity = 'critical'
    AND status != 'resolved';
  
  -- Règles de pseudonymisation
  SELECT COUNT(*) INTO v_pseudonymization_rules
  FROM public.pseudonymization_rules
  WHERE is_active = true;
  
  -- Score basé sur les anomalies critiques non résolues
  v_score := CASE
    WHEN v_critical_anomalies = 0 AND v_pseudonymization_rules >= 3 THEN 100
    WHEN v_critical_anomalies = 0 THEN 85
    WHEN v_critical_anomalies <= 2 THEN 70
    WHEN v_critical_anomalies <= 5 THEN 50
    ELSE 30
  END;
  
  v_findings := jsonb_build_array(
    jsonb_build_object(
      'metric', 'Anomalies critiques non résolues',
      'value', v_critical_anomalies,
      'status', CASE WHEN v_critical_anomalies = 0 THEN 'pass' ELSE 'fail' END
    ),
    jsonb_build_object(
      'metric', 'Règles de pseudonymisation',
      'value', v_pseudonymization_rules,
      'status', CASE WHEN v_pseudonymization_rules >= 3 THEN 'pass' ELSE 'warning' END
    )
  );
  
  RETURN jsonb_build_object(
    'score', v_score,
    'max_score', 100,
    'checks_passed', CASE WHEN v_critical_anomalies = 0 THEN 2 ELSE 0 END,
    'checks_total', 2,
    'findings', v_findings
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 13. Fonction: Obtenir le dernier audit */
CREATE OR REPLACE FUNCTION public.get_latest_compliance_audit()
RETURNS TABLE (
  audit json,
  categories json,
  recommendations json
) AS $$
DECLARE
  v_audit_id uuid;
BEGIN
  -- Récupérer le dernier audit complété
  SELECT id INTO v_audit_id
  FROM public.compliance_audits
  WHERE status = 'completed'
  ORDER BY audit_date DESC
  LIMIT 1;
  
  IF v_audit_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT
    row_to_json(a.*) as audit,
    (SELECT json_agg(row_to_json(s.*))
     FROM (
       SELECT cs.*, cc.name as category_name, cc.code as category_code
       FROM public.compliance_scores cs
       JOIN public.compliance_categories cc ON cc.id = cs.category_id
       WHERE cs.audit_id = v_audit_id
       ORDER BY cs.score ASC
     ) s) as categories,
    (SELECT json_agg(row_to_json(r.*))
     FROM (
       SELECT cr.*, cc.name as category_name
       FROM public.compliance_recommendations cr
       LEFT JOIN public.compliance_categories cc ON cc.id = cr.category_id
       WHERE cr.audit_id = v_audit_id AND cr.status = 'open'
       ORDER BY 
         CASE cr.severity 
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END,
         cr.priority DESC
     ) r) as recommendations
  FROM public.compliance_audits a
  WHERE a.id = v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;