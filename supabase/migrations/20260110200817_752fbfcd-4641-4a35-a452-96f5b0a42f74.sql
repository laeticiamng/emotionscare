-- =====================================================
-- MIGRATION: Tables manquantes et corrections
-- =====================================================

-- 1. Table user_reminders pour la persistance des rappels
CREATE TABLE IF NOT EXISTS public.user_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('breathwork', 'journal', 'scan', 'meditation', 'check-in', 'custom')),
  title TEXT NOT NULL,
  message TEXT,
  time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,0}',
  is_active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour user_reminders
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON public.user_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders" ON public.user_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON public.user_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON public.user_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_reminders_user_id ON public.user_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reminders_active ON public.user_reminders(user_id, is_active);

-- 2. Table user_goals pour le tracking des objectifs
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'wellness',
  target_value INTEGER DEFAULT 100,
  current_value INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'percent',
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS pour user_goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals" ON public.user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON public.user_goals(user_id, status);

-- 3. Ajouter colonnes manquantes si elles n'existent pas
DO $$
BEGIN
  -- Ajouter session_date à flash_glow_sessions si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flash_glow_sessions' AND column_name = 'session_date'
  ) THEN
    ALTER TABLE public.flash_glow_sessions ADD COLUMN session_date DATE DEFAULT CURRENT_DATE;
  END IF;

  -- Ajouter session_date à breathwork_sessions si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'breathwork_sessions' AND column_name = 'session_date'
  ) THEN
    ALTER TABLE public.breathwork_sessions ADD COLUMN session_date DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- 4. Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger pour user_reminders
DROP TRIGGER IF EXISTS set_user_reminders_updated_at ON public.user_reminders;
CREATE TRIGGER set_user_reminders_updated_at
  BEFORE UPDATE ON public.user_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger pour user_goals
DROP TRIGGER IF EXISTS set_user_goals_updated_at ON public.user_goals;
CREATE TRIGGER set_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();