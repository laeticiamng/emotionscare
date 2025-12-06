-- Day 43: Complete Journal Database Schema

-- ============================================
-- 1. Journal Prompts Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text TEXT NOT NULL CHECK (LENGTH(prompt_text) BETWEEN 10 AND 500),
  category TEXT NOT NULL CHECK (category IN ('reflection', 'gratitude', 'goals', 'emotions', 'creativity', 'mindfulness')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.journal_prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_active ON public.journal_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_prompts_difficulty ON public.journal_prompts(difficulty);

-- Enable RLS
ALTER TABLE public.journal_prompts ENABLE ROW LEVEL SECURITY;

-- Public read access for active prompts
CREATE POLICY "Anyone can read active prompts"
  ON public.journal_prompts FOR SELECT
  USING (is_active = true);

-- ============================================
-- 2. Journal Reminders Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_time TEXT NOT NULL CHECK (reminder_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  days_of_week INTEGER[] NOT NULL CHECK (
    array_length(days_of_week, 1) > 0 AND 
    days_of_week <@ ARRAY[0,1,2,3,4,5,6]
  ),
  is_active BOOLEAN DEFAULT true,
  message TEXT CHECK (LENGTH(message) <= 200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.journal_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON public.journal_reminders(is_active);

-- Enable RLS
ALTER TABLE public.journal_reminders ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reminders
CREATE POLICY "Users can manage their own reminders"
  ON public.journal_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. Voice Processing Jobs Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.voice_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transcription TEXT,
  emotion_analysis JSONB,
  processing_error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_jobs_status ON public.voice_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_voice_jobs_user ON public.voice_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_jobs_entry ON public.voice_processing_jobs(entry_id);

-- Enable RLS
ALTER TABLE public.voice_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Users can view their own voice processing jobs
CREATE POLICY "Users can view their own voice jobs"
  ON public.voice_processing_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Add missing columns to journal_entries
-- ============================================
DO $$
BEGIN
  -- Add mode column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'mode'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN mode TEXT DEFAULT 'text' CHECK (mode IN ('text', 'voice'));
  END IF;

  -- Add summary column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'summary'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN summary TEXT;
  END IF;

  -- Add transcript column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN transcript TEXT;
  END IF;

  -- Add is_favorite column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE public.journal_entries 
    ADD COLUMN is_favorite BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_journal_mode ON public.journal_entries(mode);
CREATE INDEX IF NOT EXISTS idx_journal_favorite ON public.journal_entries(user_id, is_favorite);

-- ============================================
-- 5. Update triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_journal_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_journal_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_voice_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_update_journal_prompts_updated_at ON public.journal_prompts;
CREATE TRIGGER trigger_update_journal_prompts_updated_at
  BEFORE UPDATE ON public.journal_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_prompts_updated_at();

DROP TRIGGER IF EXISTS trigger_update_journal_reminders_updated_at ON public.journal_reminders;
CREATE TRIGGER trigger_update_journal_reminders_updated_at
  BEFORE UPDATE ON public.journal_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journal_reminders_updated_at();

DROP TRIGGER IF EXISTS trigger_update_voice_jobs_updated_at ON public.voice_processing_jobs;
CREATE TRIGGER trigger_update_voice_jobs_updated_at
  BEFORE UPDATE ON public.voice_processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_voice_jobs_updated_at();

-- ============================================
-- 6. Seed Journal Prompts (optional)
-- ============================================
INSERT INTO public.journal_prompts (prompt_text, category, difficulty, tags) VALUES
  ('Décrivez trois choses pour lesquelles vous êtes reconnaissant aujourd''hui.', 'gratitude', 'easy', ARRAY['gratitude', 'positivité']),
  ('Quel défi avez-vous surmonté récemment et qu''avez-vous appris ?', 'reflection', 'medium', ARRAY['croissance', 'apprentissage']),
  ('Imaginez votre vie idéale dans 5 ans. Que voyez-vous ?', 'goals', 'medium', ARRAY['vision', 'futur']),
  ('Comment vous sentez-vous en ce moment ? Explorez vos émotions.', 'emotions', 'easy', ARRAY['émotions', 'conscience']),
  ('Écrivez une histoire courte qui commence par : "Il était une fois..."', 'creativity', 'hard', ARRAY['créativité', 'écriture']),
  ('Prenez 5 minutes pour décrire votre respiration et vos sensations corporelles.', 'mindfulness', 'easy', ARRAY['pleine conscience', 'corps']),
  ('Quelle personne a eu le plus d''impact sur vous cette semaine ? Pourquoi ?', 'reflection', 'medium', ARRAY['relations', 'influence']),
  ('Listez 10 petites choses qui vous rendent heureux au quotidien.', 'gratitude', 'easy', ARRAY['bonheur', 'quotidien']),
  ('Quel est votre plus grand rêve et que faites-vous pour le réaliser ?', 'goals', 'hard', ARRAY['ambition', 'action']),
  ('Décrivez un moment de pure joie de votre enfance en détail.', 'emotions', 'medium', ARRAY['souvenirs', 'joie'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. Comments
-- ============================================
COMMENT ON TABLE public.journal_prompts IS 'Suggestions d''écriture pour inspirer les entrées de journal';
COMMENT ON TABLE public.journal_reminders IS 'Rappels personnalisés pour encourager le journaling régulier';
COMMENT ON TABLE public.voice_processing_jobs IS 'Tâches de traitement des enregistrements vocaux (transcription, analyse)';
COMMENT ON COLUMN public.journal_entries.mode IS 'Type d''entrée: text ou voice';
COMMENT ON COLUMN public.journal_entries.summary IS 'Résumé automatique de l''entrée';
COMMENT ON COLUMN public.journal_entries.is_favorite IS 'Marqué comme favori par l''utilisateur';