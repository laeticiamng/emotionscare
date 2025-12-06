/**
 * Migration: Long-Term Predictions Table - Phase 4.2
 * Stockage des prédictions IA long-terme
 */

-- Créer la table des prédictions
CREATE TABLE IF NOT EXISTS public.long_term_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  timeframe text NOT NULL CHECK (timeframe IN ('3months', '6months', '12months')),
  forecast_data jsonb NOT NULL,

  -- Métadonnées
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Index pour les requêtes fréquentes
  UNIQUE(user_id, timeframe)
);

-- Créer les indexes
CREATE INDEX IF NOT EXISTS idx_long_term_predictions_user_id
  ON public.long_term_predictions(user_id);

CREATE INDEX IF NOT EXISTS idx_long_term_predictions_timeframe
  ON public.long_term_predictions(timeframe);

CREATE INDEX IF NOT EXISTS idx_long_term_predictions_created_at
  ON public.long_term_predictions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_long_term_predictions_user_timeframe
  ON public.long_term_predictions(user_id, timeframe);

-- Activer RLS
ALTER TABLE public.long_term_predictions ENABLE ROW LEVEL SECURITY;

-- Politique de lecture: utilisateurs ne voient que leurs propres prédictions
CREATE POLICY "Users can read their own predictions"
  ON public.long_term_predictions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique d'insertion: utilisateurs ne peuvent insérer que les leurs
CREATE POLICY "Users can insert their own predictions"
  ON public.long_term_predictions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique de mise à jour: utilisateurs ne peuvent mettre à jour que les leurs
CREATE POLICY "Users can update their own predictions"
  ON public.long_term_predictions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique de suppression: utilisateurs ne peuvent supprimer que les leurs
CREATE POLICY "Users can delete their own predictions"
  ON public.long_term_predictions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Créer une fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION public.update_long_term_predictions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour le timestamp
DROP TRIGGER IF EXISTS update_long_term_predictions_timestamp_trigger
  ON public.long_term_predictions;

CREATE TRIGGER update_long_term_predictions_timestamp_trigger
  BEFORE UPDATE ON public.long_term_predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_long_term_predictions_timestamp();

-- Ajouter des commentaires
COMMENT ON TABLE public.long_term_predictions IS 'Stockage des prédictions émotionnelles long-terme (3-6-12 mois)';
COMMENT ON COLUMN public.long_term_predictions.forecast_data IS 'Données complètes de prédiction au format JSONB (EmotionalForecast)';
COMMENT ON COLUMN public.long_term_predictions.timeframe IS 'Période de prédiction: 3 mois, 6 mois ou 12 mois';
