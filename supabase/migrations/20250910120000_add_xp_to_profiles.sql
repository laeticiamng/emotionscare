-- Add XP tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp BIGINT NOT NULL DEFAULT 0 CHECK (xp >= 0);

-- Ensure existing rows have the default applied
UPDATE public.profiles
SET xp = COALESCE(xp, 0);
