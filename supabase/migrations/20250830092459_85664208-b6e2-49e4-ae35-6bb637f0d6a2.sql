-- 1) RLS & RBAC Supabase - Finalisation sécuritaire
-- Tables d'organisation et RBAC
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
  team_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Tables de consentements avec horodatage
CREATE TABLE IF NOT EXISTS public.privacy_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'cam', 'mic', 'hr', 'notify', 'data_processing'
  granted BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'settings', -- 'onboarding', 'settings'
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tables métriques avec user_id obligatoire
CREATE TABLE IF NOT EXISTS public.emotion_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  emotion_type TEXT NOT NULL,
  confidence_score NUMERIC(3,2),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  sentiment_score NUMERIC(3,2),
  tags TEXT[],
  is_voice BOOLEAN DEFAULT false,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.music_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'therapy', 'mixer', 'story'
  duration_seconds INTEGER DEFAULT 0,
  mood_before TEXT,
  mood_after TEXT,
  track_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Tables d'export RGPD
CREATE TABLE IF NOT EXISTS public.data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL DEFAULT 'full',
  status TEXT NOT NULL DEFAULT 'pending',
  file_url TEXT,
  expires_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Vues agrégées RH (anonymisées, min 5 users)
CREATE OR REPLACE VIEW public.team_emotion_summary AS
SELECT 
  om.org_id,
  om.team_name,
  DATE_TRUNC('day', em.created_at) as date,
  em.emotion_type,
  COUNT(*) as count,
  ROUND(AVG(em.confidence_score), 2) as avg_confidence
FROM public.emotion_metrics em
JOIN public.org_memberships om ON em.user_id = om.user_id
WHERE om.team_name IS NOT NULL
GROUP BY om.org_id, om.team_name, DATE_TRUNC('day', em.created_at), em.emotion_type
HAVING COUNT(DISTINCT em.user_id) >= 5; -- K-anonymat minimum

-- Enable RLS sur toutes les tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

-- Policies RLS strictes
-- Utilisateurs ne voient que leurs données
CREATE POLICY "Users can view own privacy consents" ON public.privacy_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own privacy consents" ON public.privacy_consents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emotion metrics" ON public.emotion_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion metrics" ON public.emotion_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own music sessions" ON public.music_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own data exports" ON public.data_exports
  FOR ALL USING (auth.uid() = user_id);

-- Managers peuvent voir les vues agrégées de leur org
CREATE POLICY "Managers can view team summaries" ON public.org_memberships
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.org_memberships om2 
      WHERE om2.user_id = auth.uid() 
      AND om2.org_id = org_memberships.org_id 
      AND om2.role IN ('manager', 'admin')
    )
  );

-- Storage buckets avec policies
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('audio-recordings', 'audio-recordings', false),
  ('emotion-captures', 'emotion-captures', false),
  ('data-exports', 'data-exports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own audio" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload emotion captures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'emotion-captures' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own emotion captures" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'emotion-captures' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can access own data exports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'data-exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fonction sécurisée pour agrégation RH
CREATE OR REPLACE FUNCTION public.get_team_analytics(
  p_org_id UUID,
  p_team_name TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  date DATE,
  emotion_type TEXT,
  user_count INTEGER,
  avg_confidence NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier que l'utilisateur est manager de l'org
  IF NOT EXISTS (
    SELECT 1 FROM public.org_memberships 
    WHERE user_id = auth.uid() 
    AND org_id = p_org_id 
    AND role IN ('manager', 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied: not a manager of this organization';
  END IF;

  RETURN QUERY
  SELECT 
    tes.date::DATE,
    tes.emotion_type,
    tes.count::INTEGER as user_count,
    tes.avg_confidence
  FROM public.team_emotion_summary tes
  WHERE tes.org_id = p_org_id
    AND (p_team_name IS NULL OR tes.team_name = p_team_name)
    AND (p_start_date IS NULL OR tes.date >= p_start_date)
    AND (p_end_date IS NULL OR tes.date <= p_end_date)
  ORDER BY tes.date DESC, tes.emotion_type;
END;
$$;