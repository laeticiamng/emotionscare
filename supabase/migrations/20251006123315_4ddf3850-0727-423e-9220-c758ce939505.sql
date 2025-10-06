-- Ajouter contraintes sur les statuts pour éviter les écritures invalides

-- Contrainte sur parcours_segments.status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'parcours_segments_status_chk'
  ) THEN
    ALTER TABLE public.parcours_segments
      ADD CONSTRAINT parcours_segments_status_chk
      CHECK (status IN ('queued', 'generating', 'first', 'complete', 'failed'));
  END IF;
END $$;

-- Contrainte sur parcours_runs.status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'parcours_runs_status_chk'
  ) THEN
    ALTER TABLE public.parcours_runs
      ADD CONSTRAINT parcours_runs_status_chk
      CHECK (status IN ('creating', 'ready', 'failed'));
  END IF;
END $$;

-- S'assurer que le bucket est privé
UPDATE storage.buckets 
SET public = false 
WHERE id = 'parcours-tracks';