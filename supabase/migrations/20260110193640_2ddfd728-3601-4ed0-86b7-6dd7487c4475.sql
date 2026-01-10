-- ============================================
-- FIX 1: Créer table edn_items (référencée mais manquante)
-- ============================================
CREATE TABLE IF NOT EXISTS public.edn_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  difficulty text DEFAULT 'beginner',
  duration_min integer DEFAULT 5,
  icon text,
  color text,
  is_premium boolean DEFAULT false,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.edn_items ENABLE ROW LEVEL SECURITY;

-- RLS: Lecture publique pour les items actifs
CREATE POLICY "Public read for active edn_items"
ON public.edn_items FOR SELECT
USING (is_active = true);

-- Admin peut tout faire
CREATE POLICY "Admins can manage edn_items"
ON public.edn_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_edn_items_slug ON public.edn_items(slug);
CREATE INDEX IF NOT EXISTS idx_edn_items_category ON public.edn_items(category);
CREATE INDEX IF NOT EXISTS idx_edn_items_active ON public.edn_items(is_active);

-- ============================================
-- FIX 2: Table pour l'historique Story Synth
-- ============================================
CREATE TABLE IF NOT EXISTS public.story_synth_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  intentions text[] NOT NULL,
  audio_url text,
  duration_seconds integer DEFAULT 180,
  is_favorite boolean DEFAULT false,
  play_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.story_synth_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stories"
ON public.story_synth_stories FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_story_synth_user ON public.story_synth_stories(user_id);

-- ============================================
-- FIX 3: Table pour stats Flash Glow persistées
-- ============================================
CREATE TABLE IF NOT EXISTS public.flash_glow_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds integer NOT NULL,
  score integer DEFAULT 0,
  pattern text DEFAULT 'basic',
  completed boolean DEFAULT true,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.flash_glow_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own flash_glow_sessions"
ON public.flash_glow_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_flash_glow_user ON public.flash_glow_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flash_glow_date ON public.flash_glow_sessions(session_date);

-- ============================================
-- FIX 4: Stats Breathwork persistées
-- ============================================
CREATE TABLE IF NOT EXISTS public.breathwork_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_name text NOT NULL,
  duration_seconds integer NOT NULL,
  cycles_completed integer DEFAULT 0,
  completion_rate numeric DEFAULT 0,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.breathwork_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own breathwork_sessions"
ON public.breathwork_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_breathwork_user ON public.breathwork_sessions(user_id);

-- ============================================
-- FIX 5: Mémoire persistante Coach IA
-- ============================================
CREATE TABLE IF NOT EXISTS public.coach_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type text NOT NULL DEFAULT 'context',
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  importance_score numeric DEFAULT 0.5,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.coach_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own coach_memory"
ON public.coach_memory FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_coach_memory_user ON public.coach_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_memory_type ON public.coach_memory(memory_type);

-- ============================================
-- FIX 6: Leaderboard persisté
-- ============================================
CREATE TABLE IF NOT EXISTS public.global_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_emoji text DEFAULT '✨',
  total_score integer DEFAULT 0,
  weekly_score integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  level integer DEFAULT 1,
  rank_position integer,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.global_leaderboard ENABLE ROW LEVEL SECURITY;

-- Lecture publique du leaderboard
CREATE POLICY "Public read leaderboard"
ON public.global_leaderboard FOR SELECT
USING (true);

-- Seul l'utilisateur peut modifier son entrée
CREATE POLICY "Users can update own leaderboard entry"
ON public.global_leaderboard FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leaderboard entry"
ON public.global_leaderboard FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_user ON public.global_leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.global_leaderboard(total_score DESC);

-- ============================================
-- FIX 7: Mood Mixer sessions persistées
-- ============================================
CREATE TABLE IF NOT EXISTS public.mood_mixer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_id text,
  preset_name text,
  components jsonb NOT NULL,
  duration_seconds integer DEFAULT 0,
  satisfaction_score integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mood_mixer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mood_mixer_sessions"
ON public.mood_mixer_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_mood_mixer_user ON public.mood_mixer_sessions(user_id);

-- ============================================
-- FIX 8: Boss Grit quests persistées  
-- ============================================
CREATE TABLE IF NOT EXISTS public.boss_grit_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_title text NOT NULL,
  quest_description text,
  difficulty text DEFAULT 'moderate',
  xp_earned integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  total_tasks integer DEFAULT 3,
  elapsed_seconds integer DEFAULT 0,
  success boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.boss_grit_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own boss_grit_quests"
ON public.boss_grit_quests FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_boss_grit_user ON public.boss_grit_quests(user_id);