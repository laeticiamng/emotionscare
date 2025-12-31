-- Ajouter une contrainte unique sur privacy_consents pour l'upsert
ALTER TABLE public.privacy_consents 
ADD CONSTRAINT privacy_consents_user_consent_unique 
UNIQUE (user_id, consent_type);

-- Ajouter RLS sur privacy_consents si manquant
ALTER TABLE public.privacy_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own consents" ON public.privacy_consents;
CREATE POLICY "Users can view own consents" 
ON public.privacy_consents 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consents" ON public.privacy_consents;
CREATE POLICY "Users can insert own consents" 
ON public.privacy_consents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own consents" ON public.privacy_consents;
CREATE POLICY "Users can update own consents" 
ON public.privacy_consents 
FOR UPDATE 
USING (auth.uid() = user_id);