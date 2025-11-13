-- ════════════════════════════════════════════════════════════════════════════
-- TABLES POUR SYSTÈME D'ASSIGNATION ML ET COMPÉTENCES D'ÉQUIPE
-- ════════════════════════════════════════════════════════════════════════════

-- Table pour les compétences des membres d'équipe
CREATE TABLE IF NOT EXISTS public.team_member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["database", "frontend", "api", "security"]
  specializations TEXT[] DEFAULT '{}',
  availability_hours JSONB DEFAULT '{"monday": [9,17], "tuesday": [9,17], "wednesday": [9,17], "thursday": [9,17], "friday": [9,17]}'::jsonb,
  max_concurrent_tickets INTEGER DEFAULT 5,
  current_workload INTEGER DEFAULT 0,
  performance_score NUMERIC(3,2) DEFAULT 0.80, -- Score ML basé sur historique
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les règles d'assignation ML
CREATE TABLE IF NOT EXISTS public.ml_assignment_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- "critical", "high_priority", "database_error", etc.
  alert_category TEXT, -- "infrastructure", "application", "security"
  priority_level TEXT[] DEFAULT '{}', -- ["critical", "high"]
  
  -- Critères de matching
  matching_conditions JSONB DEFAULT '{}'::jsonb,
  -- Ex: {"severity": "critical", "tags": ["database"], "source": "postgres"}
  
  -- Configuration ML
  use_ml_recommendation BOOLEAN DEFAULT true,
  ml_confidence_threshold NUMERIC(3,2) DEFAULT 0.70,
  
  -- Assignation
  preferred_assignees UUID[] DEFAULT '{}', -- team_member_skills.id
  fallback_assignees UUID[] DEFAULT '{}',
  auto_assign BOOLEAN DEFAULT true,
  
  -- Contraintes
  respect_availability BOOLEAN DEFAULT true,
  respect_workload BOOLEAN DEFAULT true,
  max_response_time_minutes INTEGER, -- SLA
  
  -- Métadonnées
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 100, -- Ordre d'évaluation des règles
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Table pour l'historique des assignations ML
CREATE TABLE IF NOT EXISTS public.ml_assignment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.auto_created_tickets(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES public.unified_alerts(id),
  rule_id UUID REFERENCES public.ml_assignment_rules(id),
  
  assigned_to UUID REFERENCES public.team_member_skills(id),
  assignment_method TEXT NOT NULL, -- "ml_recommendation", "rule_based", "manual", "fallback"
  
  ml_confidence NUMERIC(3,2),
  ml_reasoning JSONB, -- Explications du modèle ML
  -- Ex: {"factors": ["skill_match": 0.95, "availability": 0.85, "workload": 0.70]}
  
  alternative_suggestions JSONB, -- Autres candidats proposés par ML
  
  was_successful BOOLEAN, -- Rempli après résolution
  resolution_time_minutes INTEGER,
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  feedback_comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les skills détectés automatiquement par ML
CREATE TABLE IF NOT EXISTS public.auto_detected_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES public.team_member_skills(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  detection_source TEXT NOT NULL, -- "ticket_resolution", "code_review", "incident_handling"
  confidence_score NUMERIC(3,2) NOT NULL,
  evidence JSONB, -- Exemples de tickets résolus, etc.
  detected_at TIMESTAMPTZ DEFAULT now(),
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

-- ════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_team_member_skills_user ON public.team_member_skills(user_id);
CREATE INDEX idx_team_member_skills_active ON public.team_member_skills(is_active);
CREATE INDEX idx_team_member_skills_performance ON public.team_member_skills(performance_score DESC);

CREATE INDEX idx_ml_assignment_rules_type ON public.ml_assignment_rules(alert_type);
CREATE INDEX idx_ml_assignment_rules_active ON public.ml_assignment_rules(is_active, priority DESC);

CREATE INDEX idx_ml_assignment_history_ticket ON public.ml_assignment_history(ticket_id);
CREATE INDEX idx_ml_assignment_history_assigned ON public.ml_assignment_history(assigned_to);
CREATE INDEX idx_ml_assignment_history_created ON public.ml_assignment_history(created_at DESC);

CREATE INDEX idx_auto_detected_skills_member ON public.auto_detected_skills(team_member_id);
CREATE INDEX idx_auto_detected_skills_approved ON public.auto_detected_skills(approved);

-- ════════════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.team_member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_assignment_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_assignment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_detected_skills ENABLE ROW LEVEL SECURITY;

-- Policies pour team_member_skills
CREATE POLICY "Admins can view all team member skills"
  ON public.team_member_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert team member skills"
  ON public.team_member_skills FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update team member skills"
  ON public.team_member_skills FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete team member skills"
  ON public.team_member_skills FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies pour ml_assignment_rules (mêmes règles)
CREATE POLICY "Admins can view ML assignment rules"
  ON public.ml_assignment_rules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert ML assignment rules"
  ON public.ml_assignment_rules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update ML assignment rules"
  ON public.ml_assignment_rules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete ML assignment rules"
  ON public.ml_assignment_rules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies pour ml_assignment_history
CREATE POLICY "Admins can view ML assignment history"
  ON public.ml_assignment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert ML assignment history"
  ON public.ml_assignment_history FOR INSERT
  WITH CHECK (true); -- Permet aux edge functions d'insérer

-- Policies pour auto_detected_skills
CREATE POLICY "Admins can view auto-detected skills"
  ON public.auto_detected_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert auto-detected skills"
  ON public.auto_detected_skills FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can approve auto-detected skills"
  ON public.auto_detected_skills FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ════════════════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

-- Trigger pour updated_at sur team_member_skills
CREATE TRIGGER update_team_member_skills_updated_at
  BEFORE UPDATE ON public.team_member_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur ml_assignment_rules
CREATE TRIGGER update_ml_assignment_rules_updated_at
  BEFORE UPDATE ON public.ml_assignment_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ════════════════════════════════════════════════════════════════════════════
-- FONCTION: Obtenir la meilleure assignation ML
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_ml_assignment_recommendation(
  p_alert_type TEXT,
  p_alert_category TEXT,
  p_priority_level TEXT,
  p_alert_tags TEXT[]
)
RETURNS TABLE (
  member_id UUID,
  member_name TEXT,
  confidence_score NUMERIC,
  reasoning JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Algorithme simplifié de recommandation ML
  -- Dans une vraie implémentation, cela appellerait un modèle ML externe
  
  RETURN QUERY
  SELECT 
    tms.id,
    tms.name,
    -- Score calculé basé sur plusieurs facteurs
    LEAST(1.0, 
      (tms.performance_score * 0.4) + 
      (CASE WHEN tms.current_workload < tms.max_concurrent_tickets 
            THEN 0.3 ELSE 0.0 END) +
      (CASE WHEN tms.is_active THEN 0.3 ELSE 0.0 END)
    )::NUMERIC(3,2) as confidence_score,
    jsonb_build_object(
      'performance_factor', tms.performance_score,
      'workload_factor', (tms.max_concurrent_tickets - tms.current_workload)::NUMERIC / tms.max_concurrent_tickets,
      'availability_factor', CASE WHEN tms.is_active THEN 1.0 ELSE 0.0 END,
      'skills_match', tms.skills
    ) as reasoning
  FROM public.team_member_skills tms
  WHERE tms.is_active = true
    AND tms.current_workload < tms.max_concurrent_tickets
  ORDER BY confidence_score DESC
  LIMIT 3;
END;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- DONNÉES INITIALES (exemples)
-- ════════════════════════════════════════════════════════════════════════════

-- Exemples de membres d'équipe (à adapter selon votre équipe)
INSERT INTO public.team_member_skills (name, email, skills, specializations, performance_score)
VALUES 
  ('Tech Lead - Alice', 'alice@company.com', 
   '["database", "backend", "infrastructure", "security"]'::jsonb, 
   ARRAY['PostgreSQL', 'Node.js', 'DevOps'], 0.95),
  ('Backend Dev - Bob', 'bob@company.com',
   '["backend", "api", "database"]'::jsonb,
   ARRAY['REST API', 'GraphQL', 'SQL'], 0.88),
  ('Frontend Dev - Charlie', 'charlie@company.com',
   '["frontend", "api", "ui"]'::jsonb,
   ARRAY['React', 'TypeScript', 'CSS'], 0.82),
  ('DevOps - Diana', 'diana@company.com',
   '["infrastructure", "monitoring", "deployment"]'::jsonb,
   ARRAY['Docker', 'Kubernetes', 'CI/CD'], 0.90)
ON CONFLICT DO NOTHING;

-- Exemples de règles d'assignation ML
INSERT INTO public.ml_assignment_rules (rule_name, alert_type, alert_category, priority_level, matching_conditions, auto_assign)
VALUES
  ('Critical DB Errors', 'database_error', 'infrastructure', 
   ARRAY['critical', 'high'], 
   '{"source": "postgres", "severity": "critical"}'::jsonb, 
   true),
  ('API Performance Issues', 'performance', 'application',
   ARRAY['high', 'medium'],
   '{"type": "api", "metric": "response_time"}'::jsonb,
   true),
  ('Security Incidents', 'security_alert', 'security',
   ARRAY['critical'],
   '{"category": "security", "requires_immediate_action": true}'::jsonb,
   true)
ON CONFLICT DO NOTHING;