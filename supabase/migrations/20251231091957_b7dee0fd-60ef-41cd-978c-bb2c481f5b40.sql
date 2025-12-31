-- Ajouter les colonnes manquantes à data_exports
ALTER TABLE public.data_exports 
ADD COLUMN IF NOT EXISTS file_size_bytes bigint,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_data_exports_user_status 
ON public.data_exports(user_id, status);

-- S'assurer que RLS est activé
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres exports
DROP POLICY IF EXISTS "Users can view own exports" ON public.data_exports;
CREATE POLICY "Users can view own exports" 
ON public.data_exports 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer des exports
DROP POLICY IF EXISTS "Users can create own exports" ON public.data_exports;
CREATE POLICY "Users can create own exports" 
ON public.data_exports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres exports
DROP POLICY IF EXISTS "Users can update own exports" ON public.data_exports;
CREATE POLICY "Users can update own exports" 
ON public.data_exports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ajouter consent_type et granted à consent_history si manquants
ALTER TABLE public.consent_history 
ADD COLUMN IF NOT EXISTS consent_type text,
ADD COLUMN IF NOT EXISTS granted boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS consent_version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Politique RLS pour consent_history
ALTER TABLE public.consent_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own consent history" ON public.consent_history;
CREATE POLICY "Users can view own consent history" 
ON public.consent_history 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consent history" ON public.consent_history;
CREATE POLICY "Users can insert own consent history" 
ON public.consent_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique RLS pour user_privacy_preferences
ALTER TABLE public.user_privacy_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own privacy prefs" ON public.user_privacy_preferences;
CREATE POLICY "Users can view own privacy prefs" 
ON public.user_privacy_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own privacy prefs" ON public.user_privacy_preferences;
CREATE POLICY "Users can upsert own privacy prefs" 
ON public.user_privacy_preferences 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);