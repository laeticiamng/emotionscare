-- Make emotion_badge nullable in music_generation_sessions
ALTER TABLE public.music_generation_sessions 
ALTER COLUMN emotion_badge DROP NOT NULL;

-- Set default value for existing null cases
ALTER TABLE public.music_generation_sessions 
ALTER COLUMN emotion_badge SET DEFAULT 'custom';