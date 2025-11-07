-- Date: 20251107
-- Migration: DSAR Management System
-- Système de gestion des demandes DSAR (Data Subject Access Request)

/* 1. TABLE: dsar_requests - Demandes DSAR */
CREATE TABLE IF NOT EXISTS public.dsar_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL, -- access, rectification, erasure, portability, restriction, objection
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected, processing, completed, expired
  priority text NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  requested_data jsonb DEFAULT '[]', -- Types de données demandées
  justification text,
  legal_deadline timestamptz NOT NULL, -- 30 jours par défaut
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  completed_at timestamptz,
  package_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* 2. TABLE: dsar_approvals - Workflow d'approbation */
CREATE TABLE IF NOT EXISTS public.dsar_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.dsar_requests(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES auth.users(id),
  approval_level int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  decision_notes text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 3. INDEX */
CREATE INDEX IF NOT EXISTS idx_dsar_requests_user ON public.dsar_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_status ON public.dsar_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_deadline ON public.dsar_requests(legal_deadline);
CREATE INDEX IF NOT EXISTS idx_dsar_approvals_request ON public.dsar_approvals(request_id);

/* 4. RLS */
ALTER TABLE public.dsar_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsar_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DSAR requests" 
  ON public.dsar_requests FOR SELECT 
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create DSAR requests" 
  ON public.dsar_requests FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Approvers can view all DSAR requests" 
  ON public.dsar_requests FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Approvers can update DSAR requests" 
  ON public.dsar_requests FOR UPDATE 
  TO authenticated USING (true);

/* 5. Fonction: Calculer la deadline légale (30 jours) */
CREATE OR REPLACE FUNCTION public.set_dsar_legal_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.legal_deadline := NEW.created_at + INTERVAL '30 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_dsar_deadline
  BEFORE INSERT ON public.dsar_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_dsar_legal_deadline();