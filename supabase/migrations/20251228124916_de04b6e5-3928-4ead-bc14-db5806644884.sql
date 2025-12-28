-- Créer le bucket pour les fichiers audio de démo (si pas existant)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('music-tracks', 'music-tracks', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Créer la policy pour lecture publique
DROP POLICY IF EXISTS "Public read access for music tracks" ON storage.objects;
CREATE POLICY "Public read access for music tracks"
ON storage.objects FOR SELECT
USING (bucket_id = 'music-tracks');