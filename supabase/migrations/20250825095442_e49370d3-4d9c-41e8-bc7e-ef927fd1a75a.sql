-- Création de la table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  user_type TEXT DEFAULT 'b2c' CHECK (user_type IN ('b2c', 'b2b_user', 'b2b_admin')),
  permissions TEXT[] DEFAULT ARRAY['basic'],
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'enterprise')),
  preferences JSONB DEFAULT '{"theme": "light", "language": "fr", "notifications": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent voir leur propre profil
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Politique pour que les utilisateurs puissent modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Politique pour créer un profil
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Fonction pour gérer la création automatique de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    display_name,
    user_type,
    permissions
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'b2c'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'b2b_admin' THEN ARRAY['admin', 'educator', 'student']
      WHEN NEW.raw_user_meta_data->>'user_type' = 'b2b_user' THEN ARRAY['educator', 'student'] 
      ELSE ARRAY['basic']
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Table pour les sessions utilisateur et tracking d'activité
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  device_info JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  location JSONB DEFAULT '{}'::jsonb,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLS pour les sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Table pour les données d'humeur et émotions
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valence NUMERIC CHECK (valence >= -100 AND valence <= 100),
  arousal NUMERIC CHECK (arousal >= 0 AND arousal <= 100),
  emotion_tags TEXT[],
  context TEXT,
  notes TEXT,
  confidence_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mood entries" 
ON public.mood_entries 
FOR ALL 
USING (user_id = auth.uid());

-- Table pour les playlists musicales personnalisées
CREATE TABLE public.music_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mood_category TEXT,
  is_public BOOLEAN DEFAULT false,
  tracks JSONB DEFAULT '[]'::jsonb,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own playlists" 
ON public.music_playlists 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public playlists" 
ON public.music_playlists 
FOR SELECT 
USING (is_public = true);

-- Table pour les exercices de respiration personnalisés
CREATE TABLE public.breathwork_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  breathing_pattern JSONB NOT NULL,
  completion_rate NUMERIC DEFAULT 0,
  stress_before NUMERIC CHECK (stress_before >= 0 AND stress_before <= 10),
  stress_after NUMERIC CHECK (stress_after >= 0 AND stress_after <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.breathwork_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own breathwork sessions" 
ON public.breathwork_sessions 
FOR ALL 
USING (user_id = auth.uid());

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les timestamps
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at 
  BEFORE UPDATE ON public.music_playlists 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();