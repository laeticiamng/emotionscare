-- Date: 20250609
-- Ticket: Harmonisation backend & securisation API
-- Migration: rgpd exports

/* Table des jobs d'export */
CREATE TABLE IF NOT EXISTS public.export_jobs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash  text        NOT NULL,
  status        text        NOT NULL DEFAULT 'pending',
  file_url      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz
);
CREATE INDEX IF NOT EXISTS idx_export_user ON export_jobs(user_id_hash, created_at DESC);

/* Table des demandes de suppression */
CREATE TABLE IF NOT EXISTS public.delete_requests (
  user_id_hash  text PRIMARY KEY,
  requested_at  timestamptz NOT NULL DEFAULT now(),
  purge_at      timestamptz NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

ALTER TABLE export_jobs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE delete_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_export_rw ON export_jobs
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_delete_rw ON delete_requests
  USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
