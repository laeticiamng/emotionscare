-- =====================================================
-- MODULE 6: MARKETPLACE CRÉATEURS
-- Tables pour la gestion des créateurs et programmes
-- =====================================================

-- Table des créateurs
CREATE TABLE IF NOT EXISTS public.marketplace_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  credentials JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
  verified_at TIMESTAMPTZ,
  stripe_account_id TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 20.00,
  total_sales INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des programmes
CREATE TABLE IF NOT EXISTS public.marketplace_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.marketplace_creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  cover_image_url TEXT,
  preview_url TEXT,
  format TEXT NOT NULL CHECK (format IN ('audio', 'video', 'pdf', 'program')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  duration_minutes INTEGER DEFAULT 0,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  modules JSONB DEFAULT '[]'::jsonb,
  total_purchases INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Table des achats
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.marketplace_programs(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  progress_percent INTEGER DEFAULT 0,
  completed_modules TEXT[] DEFAULT '{}',
  UNIQUE(user_id, program_id)
);

-- Table des avis
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.marketplace_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, program_id)
);

-- Table des paiements créateurs
CREATE TABLE IF NOT EXISTS public.marketplace_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.marketplace_creators(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_marketplace_programs_creator ON public.marketplace_programs(creator_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_programs_status ON public.marketplace_programs(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_programs_category ON public.marketplace_programs(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_programs_featured ON public.marketplace_programs(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_user ON public.marketplace_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_program ON public.marketplace_reviews(program_id);

-- Enable RLS
ALTER TABLE public.marketplace_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Créateurs
CREATE POLICY "Creators are publicly viewable" ON public.marketplace_creators
  FOR SELECT USING (status = 'verified');

CREATE POLICY "Users can view own creator profile" ON public.marketplace_creators
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own creator profile" ON public.marketplace_creators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creator profile" ON public.marketplace_creators
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies: Programmes
CREATE POLICY "Published programs are public" ON public.marketplace_programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can view own programs" ON public.marketplace_programs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.marketplace_creators c WHERE c.id = creator_id AND c.user_id = auth.uid())
  );

CREATE POLICY "Creators can insert own programs" ON public.marketplace_programs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.marketplace_creators c WHERE c.id = creator_id AND c.user_id = auth.uid())
  );

CREATE POLICY "Creators can update own programs" ON public.marketplace_programs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.marketplace_creators c WHERE c.id = creator_id AND c.user_id = auth.uid())
  );

-- RLS Policies: Achats
CREATE POLICY "Users can view own purchases" ON public.marketplace_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON public.marketplace_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases" ON public.marketplace_purchases
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies: Avis
CREATE POLICY "Reviews are public" ON public.marketplace_reviews
  FOR SELECT USING (true);

CREATE POLICY "Purchasers can review" ON public.marketplace_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.marketplace_purchases p 
      WHERE p.user_id = auth.uid() AND p.program_id = marketplace_reviews.program_id AND p.status = 'completed'
    )
  );

-- RLS Policies: Payouts
CREATE POLICY "Creators can view own payouts" ON public.marketplace_payouts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.marketplace_creators c WHERE c.id = creator_id AND c.user_id = auth.uid())
  );

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_marketplace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_marketplace_creators_updated_at
  BEFORE UPDATE ON public.marketplace_creators
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_programs_updated_at
  BEFORE UPDATE ON public.marketplace_programs
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

-- Trigger pour recalculer les stats programme
CREATE OR REPLACE FUNCTION update_program_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.marketplace_programs
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.marketplace_reviews WHERE program_id = NEW.program_id),
    review_count = (SELECT COUNT(*) FROM public.marketplace_reviews WHERE program_id = NEW.program_id)
  WHERE id = NEW.program_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_program_stats_on_review
  AFTER INSERT OR UPDATE ON public.marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION update_program_stats();