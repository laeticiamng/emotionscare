-- Date: 20250602
-- Ticket: Harmonisation backend & securisation API
-- Migration: journal raw

/*---------------------------------------------------------------------------
  3-1  CAPSULE VOCALE – TABLE + TRIGGER
---------------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS public.journal_voice (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash  text NOT NULL,
  ts            timestamptz NOT NULL DEFAULT now(),

  text_raw      text NOT NULL,
  summary_120   text,
  word_count    int,
  valence       real,
  emo_vec       real[8],
  pitch_avg     real,
  crystal_meta  jsonb,
  panas_pa      int,
  panas_na      int
);
CREATE INDEX IF NOT EXISTS idx_jvoice_user_ts ON journal_voice(user_id_hash, ts DESC);

CREATE OR REPLACE FUNCTION public.jv_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(regexp_split_to_array(NEW.text_raw, '\s+'),1);
  NEW.panas_pa   := GREATEST(10, LEAST(50, ((NEW.valence + 1) * 25)::int));
  NEW.panas_na   := 60 - NEW.panas_pa;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jv_calc
BEFORE INSERT ON public.journal_voice
FOR EACH ROW EXECUTE FUNCTION public.jv_before_insert();

/*---------------------------------------------------------------------------
  3-2  STORY STYLÉE – TABLE + TRIGGER
---------------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS public.journal_text (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash  text NOT NULL,
  ts            timestamptz NOT NULL DEFAULT now(),

  text_raw      text NOT NULL,
  has_voice     boolean DEFAULT false,
  word_count    int,
  valence       real,
  emo_vec       real[8],
  wpm           int,
  gratitude_hits int,
  sms1          int,
  impulsivity_flag boolean
);
CREATE INDEX idx_jtext_user_ts ON journal_text(user_id_hash, ts DESC);

CREATE OR REPLACE FUNCTION public.jt_before_insert()
RETURNS TRIGGER AS $$
DECLARE
  merci_count int;
BEGIN
  NEW.word_count := array_length(regexp_split_to_array(NEW.text_raw, '\s+'),1);
  merci_count := (regexp_matches(lower(NEW.text_raw), '\b(merci|thanks)\b','g')).count;
  NEW.gratitude_hits := COALESCE(merci_count,0);
  IF NEW.impulsivity_flag IS NULL THEN
     NEW.impulsivity_flag := FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jt_calc
BEFORE INSERT ON public.journal_text
FOR EACH ROW EXECUTE FUNCTION public.jt_before_insert();

/*---------------------------------------------------------------------------
  3-3  RLS + POLICIES – Anonymisation
---------------------------------------------------------------------------*/
ALTER TABLE journal_voice  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_text   ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_jv_select ON journal_voice
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_jt_select ON journal_text
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
