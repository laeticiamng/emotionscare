-- Fonctions pour incrémenter/décrémenter les participants
CREATE OR REPLACE FUNCTION increment_participant_count(session_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE focus_team_sessions
  SET participant_count = participant_count + 1,
      updated_at = now()
  WHERE id = session_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_participant_count(session_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE focus_team_sessions
  SET participant_count = GREATEST(0, participant_count - 1),
      updated_at = now()
  WHERE id = session_id;
END;
$$;