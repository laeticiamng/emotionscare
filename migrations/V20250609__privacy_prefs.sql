/* 1-A  TABLE ------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.privacy_prefs (
  user_id_hash text PRIMARY KEY,
  cam          boolean NOT NULL DEFAULT true,
  mic          boolean NOT NULL DEFAULT true,
  hr           boolean NOT NULL DEFAULT true,
  gps          boolean NOT NULL DEFAULT true,
  social       boolean NOT NULL DEFAULT true,
  nft          boolean NOT NULL DEFAULT true,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

/* 1-B  RLS --------------------------------------------------------- */
ALTER TABLE public.privacy_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_priv_select ON public.privacy_prefs
  FOR SELECT USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

CREATE POLICY p_priv_upsert ON public.privacy_prefs
  FOR INSERT WITH CHECK (user_id_hash = current_setting('request.jwt.claim.user_hash', true))
  FOR UPDATE USING (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

/* 1-C  Seed (création auto à la 1ʳᵉ connexion) : HANDLED côté API */
