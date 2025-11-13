-- Migration: Escalade automatique des alertes et IA
-- Date: 2025-01-13

-- Ajouter les champs d'escalade à unified_alerts
ALTER TABLE public.unified_alerts 
ADD COLUMN IF NOT EXISTS escalation_level int DEFAULT 0,
ADD COLUMN IF NOT EXISTS escalation_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS acknowledged_at timestamptz,
ADD COLUMN IF NOT EXISTS acknowledged_by text;

-- Index pour optimiser les requêtes d'escalade
CREATE INDEX IF NOT EXISTS idx_unified_alerts_status_created 
ON public.unified_alerts(status, created_at) 
WHERE status NOT IN ('resolved', 'acknowledged');

-- Table des règles d'escalade
CREATE TABLE IF NOT EXISTS public.alert_escalation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  delay_hours int NOT NULL DEFAULT 2,
  max_escalation_level int NOT NULL DEFAULT 3,
  priority_increase boolean DEFAULT true,
  notification_levels jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table pour l'historique des erreurs (pour analyse IA)
CREATE TABLE IF NOT EXISTS public.error_patterns_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  error_message text NOT NULL,
  severity text NOT NULL,
  context jsonb,
  stack_trace text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  alert_id uuid REFERENCES public.unified_alerts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_error_patterns_type_time 
ON public.error_patterns_history(error_type, occurred_at DESC);

-- Table des suggestions de templates IA
CREATE TABLE IF NOT EXISTS public.ai_template_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name text NOT NULL,
  error_pattern jsonb NOT NULL,
  suggested_template jsonb NOT NULL,
  confidence_score real NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  occurrences int NOT NULL DEFAULT 1,
  sample_errors jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

-- RLS pour les tables
ALTER TABLE public.alert_escalation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_patterns_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_template_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies pour admin seulement
CREATE POLICY p_escalation_rules_admin 
ON public.alert_escalation_rules
FOR ALL 
USING (true);

CREATE POLICY p_error_patterns_admin 
ON public.error_patterns_history
FOR ALL 
USING (true);

CREATE POLICY p_ai_suggestions_admin 
ON public.ai_template_suggestions
FOR ALL 
USING (true);

-- Seed: Règle d'escalade par défaut
INSERT INTO public.alert_escalation_rules (name, description, delay_hours, max_escalation_level, notification_levels)
VALUES (
  'Escalade Standard',
  'Règle d''escalade par défaut pour toutes les alertes non résolues',
  2,
  3,
  '[
    {"level": 1, "roles": ["developer", "tech_lead"], "priority": "high"},
    {"level": 2, "roles": ["tech_lead", "manager"], "priority": "critical"},
    {"level": 3, "roles": ["manager", "cto"], "priority": "critical"}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;