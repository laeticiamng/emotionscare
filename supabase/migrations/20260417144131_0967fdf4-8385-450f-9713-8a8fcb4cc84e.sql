-- Retrait colonne auth_cookies (secrets en clair) — non utilisée par le code applicatif
ALTER TABLE public.oic_extraction_progress DROP COLUMN IF EXISTS auth_cookies;
