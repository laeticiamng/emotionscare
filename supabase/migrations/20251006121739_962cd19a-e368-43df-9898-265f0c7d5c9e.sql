-- Ajouter colonnes SUDS sur parcours_runs
ALTER TABLE public.parcours_runs 
  ADD COLUMN IF NOT EXISTS suds_start INTEGER CHECK (suds_start BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS suds_mid INTEGER CHECK (suds_mid BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS suds_end INTEGER CHECK (suds_end BETWEEN 0 AND 10);

-- Créer le bucket Storage pour les tracks audio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parcours-tracks',
  'parcours-tracks',
  false,
  52428800, -- 50MB
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies si elles existent
DROP POLICY IF EXISTS "Users can read their own tracks" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage all tracks" ON storage.objects;

-- Policy Storage : users peuvent lire leurs propres tracks
-- Le chemin est: run_id/segment_id.mp3
CREATE POLICY "Users can read their own tracks"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'parcours-tracks' 
    AND EXISTS (
      SELECT 1 FROM public.parcours_runs pr
      WHERE pr.id::text = (storage.foldername(name))[1]
      AND pr.user_id = auth.uid()
    )
  );

-- Policy Storage : service role peut tout écrire (pour callbacks)
CREATE POLICY "Service role can manage all tracks"
  ON storage.objects FOR ALL
  USING (bucket_id = 'parcours-tracks' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'parcours-tracks' AND auth.role() = 'service_role');