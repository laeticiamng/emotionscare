-- Table pour le système de vies (hearts) des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_hearts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hearts INTEGER NOT NULL DEFAULT 5 CHECK (hearts >= 0 AND hearts <= 5),
  last_refill_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_hearts ENABLE ROW LEVEL SECURITY;

-- Policies pour user_hearts
CREATE POLICY "Users can view their own hearts"
ON public.user_hearts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hearts"
ON public.user_hearts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hearts"
ON public.user_hearts
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_user_hearts_updated_at
BEFORE UPDATE ON public.user_hearts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour performance
CREATE INDEX idx_user_hearts_user_id ON public.user_hearts(user_id);

-- Fonction pour régénérer automatiquement les vies
CREATE OR REPLACE FUNCTION public.regenerate_hearts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_hearts
  SET 
    hearts = LEAST(5, hearts + FLOOR(EXTRACT(EPOCH FROM (now() - last_refill_time)) / 1800)::INTEGER),
    last_refill_time = CASE 
      WHEN hearts < 5 THEN now() - ((EXTRACT(EPOCH FROM (now() - last_refill_time))::INTEGER % 1800) * INTERVAL '1 second')
      ELSE last_refill_time
    END,
    updated_at = now()
  WHERE hearts < 5
    AND EXTRACT(EPOCH FROM (now() - last_refill_time)) >= 1800;
END;
$$;