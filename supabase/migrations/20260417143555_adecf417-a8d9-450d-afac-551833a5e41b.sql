-- 1. Bucket suportsedn : passage en privé (suppression directe bloquée par la protection storage)
UPDATE storage.buckets SET public = false WHERE id = 'suportsedn';

-- 2. Restreindre le listing public de music-tracks au sous-dossier public/
DROP POLICY IF EXISTS "Public read access for music tracks" ON storage.objects;

CREATE POLICY "Public read access for music tracks public folder"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'music-tracks'
  AND (storage.foldername(name))[1] = 'public'
);
