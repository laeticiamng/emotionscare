-- JOUR 4 - PHASE 1 : Migration Journal In-Memory → Supabase
-- Date: 2025-10-03
-- Objectif: Créer tables journal_voice et journal_text avec RLS

-- ============================================
-- 1. TABLE journal_voice
-- ============================================

CREATE TABLE IF NOT EXISTS public.journal_voice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_hash TEXT, -- Migration progressive (legacy)
  audio_url TEXT,
  text_raw TEXT NOT NULL,
  summary_120 TEXT,
  valence DECIMAL(3,2) CHECK (valence BETWEEN -1 AND 1),
  emo_vec DECIMAL(3,2)[] DEFAULT ARRAY[]::DECIMAL(3,2)[],
  pitch_avg DECIMAL(5,2),
  crystal_meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_jvoice_user_ts 
ON journal_voice(user_id, ts DESC);

CREATE INDEX IF NOT EXISTS idx_jvoice_created 
ON journal_voice(created_at DESC);

-- Trigger auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_journal_voice_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_journal_voice_updated_at
  BEFORE UPDATE ON public.journal_voice
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_voice_updated_at();

-- ============================================
-- 2. TABLE journal_text
-- ============================================

CREATE TABLE IF NOT EXISTS public.journal_text (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_hash TEXT, -- Migration progressive (legacy)
  text_raw TEXT NOT NULL,
  styled_html TEXT,
  preview TEXT,
  valence DECIMAL(3,2) CHECK (valence BETWEEN -1 AND 1),
  emo_vec DECIMAL(3,2)[] DEFAULT ARRAY[]::DECIMAL(3,2)[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_jtext_user_ts 
ON journal_text(user_id, ts DESC);

CREATE INDEX IF NOT EXISTS idx_jtext_created 
ON journal_text(created_at DESC);

-- Trigger auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_journal_text_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_journal_text_updated_at
  BEFORE UPDATE ON public.journal_text
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_text_updated_at();

-- ============================================
-- 3. RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.journal_voice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_text ENABLE ROW LEVEL SECURITY;

-- journal_voice policies
CREATE POLICY "journal_voice_select_own"
  ON public.journal_voice
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "journal_voice_insert_own"
  ON public.journal_voice
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_voice_update_own"
  ON public.journal_voice
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_voice_delete_own"
  ON public.journal_voice
  FOR DELETE
  USING (auth.uid() = user_id);

-- journal_text policies
CREATE POLICY "journal_text_select_own"
  ON public.journal_text
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "journal_text_insert_own"
  ON public.journal_text
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_text_update_own"
  ON public.journal_text
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_text_delete_own"
  ON public.journal_text
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.journal_voice IS 
'Entrées journal vocal avec transcription et analyse émotionnelle. Remplace storage in-memory.';

COMMENT ON TABLE public.journal_text IS 
'Entrées journal texte avec analyse émotionnelle. Remplace storage in-memory.';

COMMENT ON COLUMN public.journal_voice.emo_vec IS 
'Vecteur émotionnel (ex: [joy, sadness, anger]). Valeurs entre -1 et 1.';

COMMENT ON COLUMN public.journal_text.emo_vec IS 
'Vecteur émotionnel (ex: [joy, sadness, anger]). Valeurs entre -1 et 1.';

-- ============================================
-- 5. VÉRIFICATIONS
-- ============================================

-- Vérifier que RLS est activé
DO $$
DECLARE
  voice_rls BOOLEAN;
  text_rls BOOLEAN;
BEGIN
  SELECT relrowsecurity INTO voice_rls
  FROM pg_class
  WHERE relname = 'journal_voice';
  
  SELECT relrowsecurity INTO text_rls
  FROM pg_class
  WHERE relname = 'journal_text';
  
  IF NOT voice_rls THEN
    RAISE EXCEPTION 'RLS not enabled on journal_voice';
  END IF;
  
  IF NOT text_rls THEN
    RAISE EXCEPTION 'RLS not enabled on journal_text';
  END IF;
  
  RAISE NOTICE 'RLS correctly enabled on journal_voice and journal_text';
END $$;

-- Compter les policies
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('journal_voice', 'journal_text')
GROUP BY tablename;

-- Expected: 4 policies per table (SELECT, INSERT, UPDATE, DELETE)