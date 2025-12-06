-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.user_unlocked_modules CASCADE;
DROP TABLE IF EXISTS public.product_module_mapping CASCADE;

-- Table de mapping : produit Shopify → module EmotionsCare à débloquer
CREATE TABLE public.product_module_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id TEXT NOT NULL UNIQUE,
  module_name TEXT NOT NULL,
  module_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des modules débloqués par utilisateur
CREATE TABLE public.user_unlocked_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  shopify_order_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_name)
);

-- Enable RLS
ALTER TABLE public.product_module_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocked_modules ENABLE ROW LEVEL SECURITY;

-- Policies pour product_module_mapping (lecture publique, écriture admin uniquement)
CREATE POLICY "Anyone can view product module mappings"
  ON public.product_module_mapping
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage mappings"
  ON public.product_module_mapping
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies pour user_unlocked_modules (utilisateurs voient leurs propres modules)
CREATE POLICY "Users can view their own unlocked modules"
  ON public.user_unlocked_modules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert unlocked modules"
  ON public.user_unlocked_modules
  FOR INSERT
  WITH CHECK (true);

-- Indexes pour performance
CREATE INDEX idx_user_unlocked_modules_user_id ON public.user_unlocked_modules(user_id);
CREATE INDEX idx_user_unlocked_modules_module_name ON public.user_unlocked_modules(module_name);

-- Données initiales : mapping des modules EmotionsCare
INSERT INTO public.product_module_mapping (shopify_product_id, module_name, module_description) VALUES
  ('lamp_luminotherapy', 'Luminothérapie', 'Accès au module Luminothérapie avec exercices guidés'),
  ('headphones_relaxation', 'Musicothérapie', 'Accès aux playlists IA personnalisées'),
  ('diffuser_essential_oils', 'Relaxation', 'Accès au module Relaxation & Aromathérapie'),
  ('sleep_mask_heating', 'Sommeil', 'Accès au module Sommeil & Méditation guidée'),
  ('weighted_blanket', 'Relaxation', 'Accès au module Relaxation profonde'),
  ('meditation_mat', 'Méditation', 'Accès au module Méditation & Respiration'),
  ('wellness_bracelet', 'Scan', 'Accès au module Scan émotionnel avancé'),
  ('emotional_journal', 'Journal', 'Accès au journal émotionnel premium'),
  ('music_box_relaxing', 'Musicothérapie', 'Accès aux sons binauraux personnalisés'),
  ('chromatic_light', 'Luminothérapie', 'Accès aux séances chromatiques avancées');