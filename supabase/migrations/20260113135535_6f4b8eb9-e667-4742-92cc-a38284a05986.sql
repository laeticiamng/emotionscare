-- Créer les tables bounce back dans le bon ordre

-- 1. Table principale des tournois
CREATE TABLE IF NOT EXISTS public.bounce_back_tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL DEFAULT 'registration',
  max_players INTEGER NOT NULL DEFAULT 32,
  current_round INTEGER DEFAULT 0,
  total_rounds INTEGER DEFAULT 5,
  prize_xp INTEGER DEFAULT 500,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bounce_back_tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_tournaments" ON public.bounce_back_tournaments FOR SELECT USING (true);

-- 2. Table des joueurs
CREATE TABLE IF NOT EXISTS public.bounce_back_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.bounce_back_tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '😊',
  resilience_score INTEGER DEFAULT 0,
  rounds_won INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_comeback INTEGER DEFAULT 0,
  is_eliminated BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bounce_back_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_players" ON public.bounce_back_players FOR SELECT USING (true);
CREATE POLICY "join_players" ON public.bounce_back_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_players" ON public.bounce_back_players FOR UPDATE USING (auth.uid() = user_id);

-- 3. Table des rounds
CREATE TABLE IF NOT EXISTS public.bounce_back_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.bounce_back_tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  challenge_type TEXT NOT NULL DEFAULT 'reframe',
  challenge_prompt TEXT NOT NULL,
  time_limit_seconds INTEGER DEFAULT 120,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  participants_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0
);

ALTER TABLE public.bounce_back_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_rounds" ON public.bounce_back_rounds FOR SELECT USING (true);

-- 4. Table des soumissions
CREATE TABLE IF NOT EXISTS public.bounce_back_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID NOT NULL REFERENCES public.bounce_back_rounds(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.bounce_back_players(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bounce_back_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_submissions" ON public.bounce_back_submissions FOR SELECT USING (true);
CREATE POLICY "create_submissions" ON public.bounce_back_submissions FOR INSERT WITH CHECK (true);

-- Fonctions RPC pour mood mixer
CREATE OR REPLACE FUNCTION public.increment_preset_likes(p_preset_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE mood_mixer_presets SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = p_preset_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_preset_likes(p_preset_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE mood_mixer_presets SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = p_preset_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_preset_uses(p_preset_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE mood_mixer_presets SET uses_count = COALESCE(uses_count, 0) + 1 WHERE id = p_preset_id;
END;
$$;

-- Insérer un tournoi de test
INSERT INTO public.bounce_back_tournaments (name, description, phase, max_players, total_rounds, prize_xp, starts_at)
VALUES ('Tournoi Résilience #1', 'Premier tournoi de résilience communautaire', 'registration', 32, 5, 500, now() + interval '1 day')
ON CONFLICT DO NOTHING;