-- Migration pour le système de tournois hebdomadaires

-- Table des tournois
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tournament_type TEXT NOT NULL CHECK (tournament_type IN ('weekly_xp', 'monthly_challenge', 'special_event')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_start TIMESTAMPTZ NOT NULL,
  registration_end TIMESTAMPTZ NOT NULL,
  max_participants INTEGER DEFAULT 64,
  current_participants INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration', 'in_progress', 'completed', 'cancelled')),
  prize_pool JSONB DEFAULT '[]',
  rules JSONB DEFAULT '{}',
  bracket_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des inscriptions aux tournois
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seed_position INTEGER,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'withdrawn', 'disqualified')),
  UNIQUE(tournament_id, user_id)
);

-- Table des matchs de tournoi
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  player1_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'forfeit')),
  scheduled_time TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des notifications push
CREATE TABLE IF NOT EXISTS public.push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('guild_invite', 'duel_challenge', 'tournament_match', 'reward_unlocked', 'challenge_completed', 'level_up')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des tokens FCM
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('web', 'ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour tournaments
CREATE POLICY "Anyone can view tournaments"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tournaments"
  ON public.tournaments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- RLS Policies pour tournament_registrations
CREATE POLICY "Users can view registrations"
  ON public.tournament_registrations FOR SELECT
  USING (true);

CREATE POLICY "Users can register themselves"
  ON public.tournament_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can withdraw their registration"
  ON public.tournament_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies pour tournament_matches
CREATE POLICY "Anyone can view matches"
  ON public.tournament_matches FOR SELECT
  USING (true);

CREATE POLICY "Players can update their match"
  ON public.tournament_matches FOR UPDATE
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- RLS Policies pour push_notifications
CREATE POLICY "Users can view their notifications"
  ON public.push_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.push_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies pour fcm_tokens
CREATE POLICY "Users can manage their tokens"
  ON public.fcm_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_dates ON public.tournaments(start_date, end_date);
CREATE INDEX idx_tournament_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX idx_tournament_registrations_user ON public.tournament_registrations(user_id);
CREATE INDEX idx_tournament_matches_tournament ON public.tournament_matches(tournament_id);
CREATE INDEX idx_tournament_matches_players ON public.tournament_matches(player1_id, player2_id);
CREATE INDEX idx_push_notifications_user ON public.push_notifications(user_id);
CREATE INDEX idx_push_notifications_status ON public.push_notifications(status);
CREATE INDEX idx_fcm_tokens_user ON public.fcm_tokens(user_id);

-- Trigger pour mettre à jour updated_at sur tournaments
CREATE TRIGGER trigger_update_tournament_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_updated_at();

-- Function pour mettre à jour le nombre de participants
CREATE OR REPLACE FUNCTION update_tournament_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.tournaments
    SET current_participants = current_participants + 1
    WHERE id = NEW.tournament_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.tournaments
    SET current_participants = current_participants - 1
    WHERE id = OLD.tournament_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tournament_participants
  AFTER INSERT OR DELETE ON public.tournament_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_tournament_participants();

-- Function pour créer automatiquement les matchs du premier tour
CREATE OR REPLACE FUNCTION generate_tournament_bracket()
RETURNS TRIGGER AS $$
DECLARE
  registrations RECORD;
  match_num INTEGER := 1;
  participants UUID[];
  i INTEGER := 1;
BEGIN
  IF NEW.status = 'in_progress' AND OLD.status = 'registration' THEN
    -- Récupérer tous les participants
    SELECT ARRAY_AGG(user_id ORDER BY seed_position NULLS LAST, registration_date)
    INTO participants
    FROM public.tournament_registrations
    WHERE tournament_id = NEW.id
    AND status = 'confirmed';

    -- Créer les matchs du premier tour
    WHILE i <= ARRAY_LENGTH(participants, 1) LOOP
      IF i + 1 <= ARRAY_LENGTH(participants, 1) THEN
        INSERT INTO public.tournament_matches (
          tournament_id,
          round_number,
          match_number,
          player1_id,
          player2_id,
          status
        ) VALUES (
          NEW.id,
          1,
          match_num,
          participants[i],
          participants[i + 1],
          'pending'
        );
        match_num := match_num + 1;
      END IF;
      i := i + 2;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_bracket
  AFTER UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION generate_tournament_bracket();
