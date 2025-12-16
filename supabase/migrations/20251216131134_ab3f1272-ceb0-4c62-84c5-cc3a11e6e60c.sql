-- Add medical_consents column to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS medical_consents JSONB DEFAULT '{}';

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_preferences_medical_consents 
ON public.user_preferences USING GIN (medical_consents);

-- Comment
COMMENT ON COLUMN public.user_preferences.medical_consents IS 'Stocke les consentements médicaux de l utilisateur';