-- ============================================================================
-- Migration Finale : Consolidation EC-MUSIC-PARCOURS-XL
-- ============================================================================

-- Index manquants pour performance
CREATE UNIQUE INDEX IF NOT EXISTS u_segments_run_idx 
  ON public.parcours_segments(run_id, segment_index);

CREATE INDEX IF NOT EXISTS idx_segments_status 
  ON public.parcours_segments(status);

CREATE INDEX IF NOT EXISTS idx_runs_status 
  ON public.parcours_runs(status);

CREATE INDEX IF NOT EXISTS idx_runs_user 
  ON public.parcours_runs(user_id);

-- S'assurer que le bucket est privé (critique pour sécurité)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'parcours-tracks';