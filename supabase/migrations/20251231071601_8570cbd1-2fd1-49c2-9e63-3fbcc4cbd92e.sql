-- Table pour stocker les feedbacks de session de respiration
CREATE TABLE IF NOT EXISTS public.breath_session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES breathing_vr_sessions(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  felt_calm BOOLEAN,
  felt_focused BOOLEAN,
  felt_relaxed BOOLEAN,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes par utilisateur
CREATE INDEX IF NOT EXISTS idx_breath_feedback_user ON breath_session_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_breath_feedback_created ON breath_session_feedback(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE breath_session_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own feedback"
  ON breath_session_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON breath_session_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON breath_session_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON breath_session_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_breath_feedback_updated_at
  BEFORE UPDATE ON breath_session_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();