-- EC-MUSIC-PARCOURS-XL : Tables pour parcours musicothérapie longs
-- Sécurité : RLS stricte, chiffrement, k-anonymat B2B

-- Table des presets de parcours (20 émotions)
CREATE TABLE IF NOT EXISTS public.parcours_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  emotion_category TEXT NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 18,
  duration_max INTEGER NOT NULL DEFAULT 24,
  preset_config JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des runs utilisateur (sessions de parcours)
CREATE TABLE IF NOT EXISTS public.parcours_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_key TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress',
  suds_start INTEGER,
  suds_mid INTEGER,
  suds_end INTEGER,
  notes_encrypted TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des segments audio générés
CREATE TABLE IF NOT EXISTS public.parcours_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.parcours_runs(id) ON DELETE CASCADE,
  segment_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  start_seconds INTEGER NOT NULL,
  end_seconds INTEGER NOT NULL,
  suno_task_id TEXT,
  audio_url TEXT,
  stream_url TEXT,
  lyrics JSONB,
  voiceover_script TEXT,
  voiceover_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(run_id, segment_index)
);

-- Table des consentements utilisateur
CREATE TABLE IF NOT EXISTS public.user_music_consents (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mic_optin BOOLEAN NOT NULL DEFAULT false,
  camera_optin BOOLEAN NOT NULL DEFAULT false,
  emotion_analysis_optin BOOLEAN NOT NULL DEFAULT false,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  consent_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table agrégations B2B (k-anonyme ≥5)
CREATE TABLE IF NOT EXISTS public.b2b_music_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  week_start DATE NOT NULL,
  cohort_size INTEGER NOT NULL,
  text_summary TEXT NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cohort_size_minimum CHECK (cohort_size >= 5),
  UNIQUE(org_id, week_start)
);

-- RLS : parcours_runs
ALTER TABLE public.parcours_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own runs"
ON public.parcours_runs
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS : parcours_segments
ALTER TABLE public.parcours_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view segments of their runs"
ON public.parcours_segments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.parcours_runs
    WHERE parcours_runs.id = parcours_segments.run_id
    AND parcours_runs.user_id = auth.uid()
  )
);

-- RLS : user_music_consents
ALTER TABLE public.user_music_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own consents"
ON public.user_music_consents
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS : b2b_music_aggregates (admin only)
ALTER TABLE public.b2b_music_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can view aggregates"
ON public.b2b_music_aggregates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_memberships.org_id = b2b_music_aggregates.org_id
    AND org_memberships.user_id = auth.uid()
    AND org_memberships.role IN ('admin', 'manager')
  )
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_parcours_runs_user_started ON public.parcours_runs(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_parcours_segments_run ON public.parcours_segments(run_id, segment_index);
CREATE INDEX IF NOT EXISTS idx_b2b_aggregates_org_week ON public.b2b_music_aggregates(org_id, week_start DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_parcours_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_parcours_presets_updated_at
BEFORE UPDATE ON public.parcours_presets
FOR EACH ROW
EXECUTE FUNCTION update_parcours_updated_at();

CREATE TRIGGER trigger_user_music_consents_updated_at
BEFORE UPDATE ON public.user_music_consents
FOR EACH ROW
EXECUTE FUNCTION update_parcours_updated_at();