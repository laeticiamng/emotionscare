-- ============================================================
-- EMOTIONSCARE STORE - Intégration Shopify
-- Gestion des achats et activation automatique des modules
-- ============================================================

-- Table des achats Shopify
CREATE TABLE IF NOT EXISTS public.shopify_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,
  shopify_product_id TEXT NOT NULL,
  product_handle TEXT NOT NULL,
  product_title TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  variant_title TEXT,
  price_amount DECIMAL(10,2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  quantity INTEGER NOT NULL DEFAULT 1,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mapping produits Shopify → modules EmotionsCare
CREATE TABLE IF NOT EXISTS public.product_module_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle TEXT NOT NULL UNIQUE,
  module_name TEXT NOT NULL,
  module_path TEXT NOT NULL,
  activation_type TEXT NOT NULL DEFAULT 'instant',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des modules activés pour chaque utilisateur
CREATE TABLE IF NOT EXISTS public.user_activated_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_name TEXT NOT NULL,
  module_path TEXT NOT NULL,
  activated_via TEXT NOT NULL, -- 'purchase' ou 'promo'
  purchase_id UUID REFERENCES public.shopify_purchases(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_name)
);

-- Enable RLS
ALTER TABLE public.shopify_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_module_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activated_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour shopify_purchases
CREATE POLICY "Users can view their own purchases"
  ON public.shopify_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all purchases"
  ON public.shopify_purchases
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies pour product_module_mapping (lecture publique)
CREATE POLICY "Everyone can view product mappings"
  ON public.product_module_mapping
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage mappings"
  ON public.product_module_mapping
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies pour user_activated_modules
CREATE POLICY "Users can view their own activated modules"
  ON public.user_activated_modules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all activations"
  ON public.user_activated_modules
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_shopify_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_shopify_purchases_timestamp
  BEFORE UPDATE ON public.shopify_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_shopify_purchases_updated_at();

-- Insert des mappings produits par défaut
INSERT INTO public.product_module_mapping (product_handle, module_name, module_path, description) VALUES
  ('lampe-luminotherapie-design-blanche', 'mood-light', '/app/scan', 'Accès au module Humeur & Lumière'),
  ('casque-audio-relaxant-stereo', 'music-therapy', '/app/music', 'Accès Musicothérapie Personnalisée IA'),
  ('diffuseur-huiles-essentielles-pierre-mate-1', 'sensory-relax', '/app/breath', 'Module Relaxation Sensorielle'),
  ('couverture-lestee-premium-7kg', 'emotional-cocoon', '/app/coach', 'Séance Cocoon Émotionnel guidée par IA'),
  ('masque-sommeil-chauffant-bluetooth', 'restorative-sleep', '/app/vr', 'Module Sommeil Réparateur VR'),
  ('carnet-emotionnel-premium', 'journal-advanced', '/app/journal', 'Journal Émotionnel Avancé'),
  ('e-book-journal-emotionnel-30-jours', 'journal-program', '/app/journal', 'Programme Journal 30 jours complet')
ON CONFLICT (product_handle) DO NOTHING;

-- Index pour performance
CREATE INDEX idx_shopify_purchases_user_id ON public.shopify_purchases(user_id);
CREATE INDEX idx_shopify_purchases_order_id ON public.shopify_purchases(order_id);
CREATE INDEX idx_user_activated_modules_user_id ON public.user_activated_modules(user_id);
CREATE INDEX idx_product_module_mapping_handle ON public.product_module_mapping(product_handle);

COMMENT ON TABLE public.shopify_purchases IS 'Enregistre tous les achats Shopify pour activation automatique des modules';
COMMENT ON TABLE public.product_module_mapping IS 'Mapping entre produits Shopify et modules EmotionsCare';
COMMENT ON TABLE public.user_activated_modules IS 'Modules activés pour chaque utilisateur suite à un achat ou promo';