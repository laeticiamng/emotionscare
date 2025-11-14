/**
 * Migration: Marketplace Tables - Phase 4.3
 * Schema pour le système de marketplace de thèmes, widgets et packs
 */

-- Créer la table des catégories
CREATE TABLE IF NOT EXISTS public.marketplace_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text, -- emoji or icon name
  slug text NOT NULL UNIQUE,
  color text, -- color hex
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des items du marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.marketplace_categories (id) ON DELETE CASCADE,
  creator_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- NULL pour items officiels

  -- Infos basiques
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  long_description text,
  thumbnail_url text,
  preview_images text[], -- Array d'URLs

  -- Type et statut
  type text NOT NULL CHECK (type IN ('theme', 'widget', 'sound_pack', 'ritual', 'meditation')),
  is_official boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'rejected', 'archived')),

  -- Pricing
  price numeric(10, 2) DEFAULT 0, -- 0 = gratuit
  is_premium boolean DEFAULT false,
  free_trial_days integer DEFAULT 0,

  -- Ratings
  rating_count integer DEFAULT 0,
  average_rating numeric(2, 1) DEFAULT 0,

  -- Stats
  install_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,

  -- Content (JSON pour flexibility)
  content jsonb, -- { theme: {...}, config: {...} }

  -- SEO et discovery
  tags text[],
  keywords text,

  -- Metadata
  version text DEFAULT '1.0.0',
  compatibility text, -- e.g. ">=1.0.0"
  file_size integer, -- in bytes
  license text DEFAULT 'proprietary', -- proprietary, cc-by, cc-by-sa, etc.

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,

  -- Indexes et contraintes
  UNIQUE(slug, type),
  CHECK (price >= 0)
);

-- Créer la table des achats/installations
CREATE TABLE IF NOT EXISTS public.user_marketplace_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.marketplace_items (id) ON DELETE CASCADE,

  purchase_type text DEFAULT 'purchase' CHECK (purchase_type IN ('purchase', 'free', 'subscription')),
  amount numeric(10, 2) DEFAULT 0,
  currency text DEFAULT 'EUR',

  -- Statut du paiement
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,

  -- Accès
  is_installed boolean DEFAULT false,
  expires_at timestamptz, -- Pour les essais/abonnements

  -- Metadata
  refund_reason text,
  refund_amount numeric(10, 2),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des thèmes installés (actifs)
CREATE TABLE IF NOT EXISTS public.installed_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.marketplace_items (id) ON DELETE CASCADE,

  is_active boolean DEFAULT false,
  custom_colors jsonb, -- { primary: "#...", secondary: "..." }
  custom_config jsonb, -- user preferences

  installed_at timestamptz DEFAULT now(),
  activated_at timestamptz,
  last_used_at timestamptz,

  UNIQUE(user_id, item_id)
);

-- Créer la table des avis/reviews
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.marketplace_items (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text,

  helpful_count integer DEFAULT 0,
  is_verified_purchase boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(item_id, user_id)
);

-- Créer la table pour les items créés par la communauté
CREATE TABLE IF NOT EXISTS public.community_created_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_item_id uuid REFERENCES public.marketplace_items (id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

  revenue_share_percentage numeric(3, 1) DEFAULT 70, -- Créateur reçoit 70%
  total_earnings numeric(10, 2) DEFAULT 0,
  paid_earnings numeric(10, 2) DEFAULT 0,
  unpaid_earnings numeric(10, 2) DEFAULT 0,

  last_payout_date timestamptz,
  next_payout_date timestamptz,

  -- Badges et reconnaissance
  is_top_creator boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  verification_date timestamptz,

  creation_date timestamptz DEFAULT now()
);

-- Créer les indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category_id
  ON public.marketplace_items(category_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_creator_id
  ON public.marketplace_items(creator_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_type
  ON public.marketplace_items(type);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_is_featured
  ON public.marketplace_items(is_featured);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_status
  ON public.marketplace_items(status);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_average_rating
  ON public.marketplace_items(average_rating DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at
  ON public.marketplace_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id
  ON public.user_marketplace_purchases(user_id);

CREATE INDEX IF NOT EXISTS idx_user_purchases_item_id
  ON public.user_marketplace_purchases(item_id);

CREATE INDEX IF NOT EXISTS idx_user_purchases_created_at
  ON public.user_marketplace_purchases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_installed_themes_user_id
  ON public.installed_themes(user_id);

CREATE INDEX IF NOT EXISTS idx_installed_themes_active
  ON public.installed_themes(user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_reviews_item_id
  ON public.marketplace_reviews(item_id);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at
  ON public.marketplace_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_items_creator_id
  ON public.community_created_items(creator_id);

CREATE INDEX IF NOT EXISTS idx_community_items_top_creator
  ON public.community_created_items(is_top_creator);

-- Activer RLS
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installed_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_created_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour marketplace_items (tous peuvent lire les published items)
CREATE POLICY "Anyone can read published marketplace items"
  ON public.marketplace_items
  FOR SELECT
  USING (status = 'published' OR auth.uid() = creator_id);

CREATE POLICY "Creators can manage their items"
  ON public.marketplace_items
  FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can create items"
  ON public.marketplace_items
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id OR creator_id IS NULL);

CREATE POLICY "Creators can delete their items"
  ON public.marketplace_items
  FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies pour user_marketplace_purchases (users see only their purchases)
CREATE POLICY "Users can read their own purchases"
  ON public.user_marketplace_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON public.user_marketplace_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies pour installed_themes
CREATE POLICY "Users can read their own installed themes"
  ON public.installed_themes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own installed themes"
  ON public.installed_themes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installed themes"
  ON public.installed_themes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own installed themes"
  ON public.installed_themes
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies pour marketplace_reviews
CREATE POLICY "Anyone can read reviews"
  ON public.marketplace_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.marketplace_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.marketplace_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.marketplace_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies pour categories
CREATE POLICY "Anyone can read categories"
  ON public.marketplace_categories
  FOR SELECT
  USING (true);

-- RLS Policies pour community_created_items
CREATE POLICY "Anyone can read community items"
  ON public.community_created_items
  FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage their community items"
  ON public.community_created_items
  FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Fonctions pour mettre à jour automatiquement les timestamps
CREATE OR REPLACE FUNCTION public.update_marketplace_items_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketplace_items_timestamp_trigger
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_marketplace_items_timestamp();

-- Fonction pour recalculer la moyenne des ratings
CREATE OR REPLACE FUNCTION public.update_item_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.marketplace_items
  SET
    average_rating = COALESCE((
      SELECT AVG(CAST(rating AS numeric)) FROM public.marketplace_reviews
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    ), 0),
    rating_count = (
      SELECT COUNT(*) FROM public.marketplace_reviews
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    )
  WHERE id = COALESCE(NEW.item_id, OLD.item_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_item_rating_insert
  AFTER INSERT ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_item_rating();

CREATE TRIGGER update_item_rating_update
  AFTER UPDATE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_item_rating();

CREATE TRIGGER update_item_rating_delete
  AFTER DELETE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_item_rating();

-- Commentaires
COMMENT ON TABLE public.marketplace_items IS 'Items disponibles dans le marketplace (thèmes, widgets, packs sonores, rituels)';
COMMENT ON TABLE public.user_marketplace_purchases IS 'Historique des achats et installations par utilisateur';
COMMENT ON TABLE public.installed_themes IS 'Thèmes installés et leurs configurations personnalisées par utilisateur';
COMMENT ON TABLE public.marketplace_reviews IS 'Avis et notations sur les items du marketplace';
COMMENT ON TABLE public.community_created_items IS 'Métadonnées pour les items créés par la communauté (earnings, verification, etc.)';
