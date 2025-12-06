-- Ajouter colonnes SUDS sur parcours_runs
ALTER TABLE public.parcours_runs 
  ADD COLUMN IF NOT EXISTS suds_start INTEGER CHECK (suds_start BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS suds_mid INTEGER CHECK (suds_mid BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS suds_end INTEGER CHECK (suds_end BETWEEN 0 AND 10);

-- Ajouter storage_path sur parcours_segments pour stocker le chemin, pas l'URL signée
ALTER TABLE public.parcours_segments
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

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

-- Fonction pour gérer updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger updated_at pour parcours_runs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at_runs') THEN
    CREATE TRIGGER set_updated_at_runs 
    BEFORE UPDATE ON public.parcours_runs
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;

-- Trigger updated_at pour parcours_segments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at_segments') THEN
    CREATE TRIGGER set_updated_at_segments 
    BEFORE UPDATE ON public.parcours_segments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;