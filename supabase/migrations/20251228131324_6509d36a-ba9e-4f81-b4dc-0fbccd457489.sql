-- Corriger les URLs Pixabay cassées dans music_history
UPDATE public.music_history
SET track_url = 'https://cdn.pixabay.com/audio/2024/11/04/audio_a94216a94c.mp3'
WHERE track_url = 'https://cdn.pixabay.com/audio/2022/03/22/audio_5bac687fe3.mp3';

-- Corriger aussi les autres anciennes URLs potentiellement cassées (2022)
UPDATE public.music_history
SET track_url = 'https://cdn.pixabay.com/audio/2024/11/04/audio_a94216a94c.mp3'
WHERE track_url LIKE '%cdn.pixabay.com/audio/2022/%'
  AND track_url NOT LIKE '%audio/2024/%';