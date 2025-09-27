-- Migration sécurisée pour les nouvelles tables EmotionsCare

-- Supprimer les policies existantes si elles existent pour éviter les conflits
DO $$ 
BEGIN
    -- Supprimer les policies existantes pour emotion_scans
    DROP POLICY IF EXISTS "Users can manage their own emotion scans" ON public.emotion_scans;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore les erreurs si la policy n'existe pas
END $$;

-- Table pour les scans d'émotions (si elle n'existe pas déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'emotion_scans') THEN
        CREATE TABLE public.emotion_scans (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          emotion TEXT NOT NULL,
          confidence INTEGER NOT NULL DEFAULT 0,
          description TEXT,
          recommendations TEXT[],
          scan_data JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.emotion_scans ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Table pour les entrées de journal vocal
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voice_journal_entries') THEN
        CREATE TABLE public.voice_journal_entries (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          transcription TEXT NOT NULL,
          ai_insights TEXT,
          emotion TEXT,
          sentiment DECIMAL(3,2),
          keywords TEXT[],
          duration INTEGER DEFAULT 0,
          audio_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.voice_journal_entries ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Table pour les sessions VR
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vr_sessions') THEN
        CREATE TABLE public.vr_sessions (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          session_type TEXT NOT NULL,
          environment TEXT NOT NULL,
          duration INTEGER NOT NULL DEFAULT 0,
          emotions_before JSONB,
          emotions_after JSONB,
          biometric_data JSONB,
          session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.vr_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- RLS Policies (avec vérification d'existence)
DO $$ 
BEGIN
    -- Policy pour emotion_scans
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'emotion_scans' 
        AND policyname = 'Users can manage their own emotion scans'
    ) THEN
        CREATE POLICY "Users can manage their own emotion scans" ON public.emotion_scans
          FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Policy pour voice_journal_entries
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'voice_journal_entries' 
        AND policyname = 'Users can manage their own voice journal entries'
    ) THEN
        CREATE POLICY "Users can manage their own voice journal entries" ON public.voice_journal_entries
          FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Policy pour vr_sessions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vr_sessions' 
        AND policyname = 'Users can manage their own VR sessions'
    ) THEN
        CREATE POLICY "Users can manage their own VR sessions" ON public.vr_sessions
          FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Créer les indexes si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_emotion_scans_user_created ON public.emotion_scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_journal_user_created ON public.voice_journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vr_sessions_user_created ON public.vr_sessions(user_id, created_at DESC);