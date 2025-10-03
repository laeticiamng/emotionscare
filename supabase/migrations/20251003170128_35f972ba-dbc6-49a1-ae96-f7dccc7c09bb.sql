-- ============================================================================
-- GDPR Encryption Phase 1 : Infrastructure de chiffrement
-- ============================================================================

-- Table de gestion des clés de chiffrement
CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name TEXT UNIQUE NOT NULL,
  key_value TEXT NOT NULL,
  key_type TEXT NOT NULL DEFAULT 'aes-256-gcm',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rotated_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "encryption_keys_service_role_only"
  ON encryption_keys
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Créer les clés de chiffrement initiales
INSERT INTO encryption_keys (key_name, key_value, key_type)
VALUES 
  ('emotionscare_master_key', encode(gen_random_bytes(32), 'base64'), 'aes-256-gcm'),
  ('journal_encryption_key', encode(gen_random_bytes(32), 'base64'), 'aes-256-gcm'),
  ('vr_encryption_key', encode(gen_random_bytes(32), 'base64'), 'aes-256-gcm'),
  ('assessment_encryption_key', encode(gen_random_bytes(32), 'base64'), 'aes-256-gcm'),
  ('breath_encryption_key', encode(gen_random_bytes(32), 'base64'), 'aes-256-gcm')
ON CONFLICT (key_name) DO NOTHING;

-- Fonction de chiffrement générique
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(
  p_plaintext TEXT,
  p_key_name TEXT DEFAULT 'emotionscare_master_key'
) RETURNS TEXT AS $$
DECLARE
  v_key TEXT;
  v_encrypted BYTEA;
BEGIN
  SELECT key_value INTO v_key
  FROM encryption_keys
  WHERE key_name = p_key_name AND is_active = TRUE;
  
  IF v_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found: %', p_key_name;
  END IF;
  
  v_encrypted := encrypt(p_plaintext::bytea, decode(v_key, 'base64'), 'aes');
  RETURN encode(v_encrypted, 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction de déchiffrement générique
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(
  p_ciphertext TEXT,
  p_key_name TEXT DEFAULT 'emotionscare_master_key'
) RETURNS TEXT AS $$
DECLARE
  v_key TEXT;
  v_decrypted BYTEA;
BEGIN
  IF p_ciphertext IS NULL OR p_ciphertext = '' THEN
    RETURN NULL;
  END IF;
  
  SELECT key_value INTO v_key
  FROM encryption_keys
  WHERE key_name = p_key_name AND is_active = TRUE;
  
  IF v_key IS NULL THEN
    RAISE EXCEPTION 'Decryption key not found: %', p_key_name;
  END IF;
  
  v_decrypted := decrypt(decode(p_ciphertext, 'base64'), decode(v_key, 'base64'), 'aes');
  RETURN convert_from(v_decrypted, 'UTF8');
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Decryption failed for key %: %', p_key_name, SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;