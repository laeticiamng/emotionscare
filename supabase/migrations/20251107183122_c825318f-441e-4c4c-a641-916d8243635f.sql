-- Supprimer la table si elle existe
DROP TABLE IF EXISTS compliance_scores CASCADE;

-- Recréer la table compliance_scores sans contrainte FK initialement
CREATE TABLE compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  previous_score INTEGER,
  impact INTEGER,
  event_type TEXT NOT NULL,
  event_data JSONB,
  affected_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter la contrainte FK après
ALTER TABLE compliance_scores ADD CONSTRAINT fk_compliance_scores_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_compliance_scores_user ON compliance_scores(user_id);
CREATE INDEX idx_compliance_scores_created ON compliance_scores(created_at DESC);

ALTER TABLE compliance_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own compliance scores"
  ON compliance_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create compliance scores"
  ON compliance_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
