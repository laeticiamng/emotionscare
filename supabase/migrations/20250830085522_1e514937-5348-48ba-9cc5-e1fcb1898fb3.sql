-- Correction de l'index qui posait problème
CREATE INDEX IF NOT EXISTS idx_personalized_recommendations_user_priority 
ON personalized_recommendations(user_id, priority_score DESC, created_at DESC) 
WHERE viewed = FALSE;