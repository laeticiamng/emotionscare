-- Création de la table newsletter_subscribers pour la landing page
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'homepage',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les recherches par email
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_active ON public.newsletter_subscribers(is_active) WHERE is_active = true;

-- Commentaires
COMMENT ON TABLE public.newsletter_subscribers IS 'Abonnés à la newsletter EmotionsCare';
COMMENT ON COLUMN public.newsletter_subscribers.email IS 'Email de l''abonné (unique)';
COMMENT ON COLUMN public.newsletter_subscribers.source IS 'Source d''inscription (homepage, footer, popup, etc.)';

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (formulaire de newsletter)
CREATE POLICY "Permettre l'inscription à la newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Politique pour permettre la lecture par les admins uniquement (via service role)
-- Les utilisateurs normaux ne peuvent pas voir les abonnés