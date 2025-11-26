-- Migration 1: Ajouter la colonne language à user_preferences
-- Cette colonne est utilisée par le système i18n pour stocker la langue préférée

ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'auto'));

COMMENT ON COLUMN public.user_preferences.language IS 'Langue préférée de l''utilisateur (fr, en, auto)';

-- Migration 2: Créer la table scan_history pour l'historique des scans émotionnels
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_data JSONB NOT NULL,
  emotions JSONB,
  dominant_emotion TEXT,
  intensity NUMERIC(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);

-- RLS pour scan_history
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scan history"
ON public.scan_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
ON public.scan_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.scan_history FOR DELETE
USING (auth.uid() = user_id);

-- Migration 3: Vérifier et corriger la table user_goals
-- Ajouter les colonnes si elles n'existent pas
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Trigger pour updated_at sur user_goals
CREATE OR REPLACE FUNCTION public.update_user_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_goals_updated_at ON public.user_goals;
CREATE TRIGGER trigger_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_user_goals_updated_at();