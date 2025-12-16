-- Add key and value columns to user_settings for generic storage pattern
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS key TEXT,
ADD COLUMN IF NOT EXISTS value TEXT;

-- Create unique constraint for user_id + key combination
CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_key_unique 
ON public.user_settings (user_id, key) 
WHERE key IS NOT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_settings_key_idx 
ON public.user_settings (key) 
WHERE key IS NOT NULL;