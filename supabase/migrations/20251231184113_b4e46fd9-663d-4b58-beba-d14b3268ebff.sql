-- Création de la table vr_session_templates pour les sessions VR recommandées
CREATE TABLE public.vr_session_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 15,
  category TEXT NOT NULL DEFAULT 'relaxation',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  thumbnail_url TEXT,
  environment_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  popularity_score INTEGER DEFAULT 0,
  intensity INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.vr_session_templates ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut voir les templates actifs
CREATE POLICY "VR templates are viewable by everyone"
  ON public.vr_session_templates
  FOR SELECT
  USING (is_active = true);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_vr_templates_active ON public.vr_session_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_vr_templates_popularity ON public.vr_session_templates(popularity_score DESC);
CREATE INDEX idx_vr_templates_category ON public.vr_session_templates(category);

-- Trigger pour updated_at
CREATE TRIGGER update_vr_session_templates_updated_at
  BEFORE UPDATE ON public.vr_session_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques templates par défaut
INSERT INTO public.vr_session_templates (name, description, duration, category, difficulty, popularity_score, intensity, tags) VALUES
  ('Méditation matinale', 'Commencez votre journée avec une méditation guidée pour un esprit clair', 15, 'méditation', 'débutant', 100, 1, ARRAY['morning', 'calm', 'focus']),
  ('Relaxation profonde', 'Une session immersive pour libérer le stress et retrouver l''équilibre', 25, 'relaxation', 'intermédiaire', 95, 2, ARRAY['stress-relief', 'evening', 'sleep']),
  ('Forêt apaisante', 'Immergez-vous dans une forêt virtuelle pour apaiser votre esprit', 20, 'nature', 'débutant', 90, 1, ARRAY['nature', 'calm', 'immersion']),
  ('Plage au coucher de soleil', 'Détendez-vous sur une plage virtuelle au son des vagues', 30, 'nature', 'débutant', 85, 1, ARRAY['beach', 'sunset', 'relaxation']),
  ('Respiration guidée', 'Exercices de respiration pour gérer l''anxiété', 10, 'respiration', 'débutant', 80, 1, ARRAY['breath', 'anxiety', 'quick']),
  ('Voyage spatial', 'Explorez l''espace pour une évasion totale', 20, 'exploration', 'intermédiaire', 75, 2, ARRAY['space', 'immersion', 'adventure']);