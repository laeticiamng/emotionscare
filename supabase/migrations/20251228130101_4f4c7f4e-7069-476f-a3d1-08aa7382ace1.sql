-- Corriger les URLs audio cassées dans music_history
-- Remplacer les URLs Supabase et Pixabay /download/ par des URLs CDN publiques fonctionnelles

-- URL de fallback CDN publique Pixabay (fonctionne sans authentification)
-- https://cdn.pixabay.com/audio/... au lieu de https://cdn.pixabay.com/download/audio/...

-- 1. Corriger les URLs Supabase Storage (fichiers inexistants)
UPDATE public.music_history 
SET track_url = 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3'
WHERE track_url LIKE '%supabase.co/storage%';

-- 2. Corriger les URLs Pixabay /download/ (nécessitent auth) -> remplacer par /audio/
UPDATE public.music_history 
SET track_url = REPLACE(track_url, '/download/audio/', '/audio/')
WHERE track_url LIKE '%pixabay.com/download/audio/%';

-- Vérification: afficher les URLs distinctes restantes
-- SELECT DISTINCT track_url FROM public.music_history WHERE track_url IS NOT NULL;