-- ============================================================================
-- GDPR Encryption Phase 2 : Migration Journal
-- ============================================================================

-- Ajouter colonnes chiffrées à journal_voice
ALTER TABLE journal_voice
  ADD COLUMN IF NOT EXISTS text_raw_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS summary_120_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS emo_vec_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS crystal_meta_encrypted TEXT;

-- Ajouter colonnes chiffrées à journal_text
ALTER TABLE journal_text
  ADD COLUMN IF NOT EXISTS text_raw_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS styled_html_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS preview_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS emo_vec_encrypted TEXT;

-- Trigger auto-chiffrement journal_voice
CREATE OR REPLACE FUNCTION encrypt_journal_voice()
RETURNS TRIGGER AS $$
BEGIN
  -- Chiffrer les données sensibles avant insertion
  IF NEW.text_raw IS NOT NULL THEN
    NEW.text_raw_encrypted := encrypt_sensitive_data(NEW.text_raw, 'journal_encryption_key');
  END IF;
  
  IF NEW.summary_120 IS NOT NULL THEN
    NEW.summary_120_encrypted := encrypt_sensitive_data(NEW.summary_120, 'journal_encryption_key');
  END IF;
  
  IF NEW.emo_vec IS NOT NULL THEN
    NEW.emo_vec_encrypted := encrypt_sensitive_data(NEW.emo_vec::text, 'journal_encryption_key');
  END IF;
  
  IF NEW.crystal_meta IS NOT NULL THEN
    NEW.crystal_meta_encrypted := encrypt_sensitive_data(NEW.crystal_meta::text, 'journal_encryption_key');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER journal_voice_encrypt_before_insert
  BEFORE INSERT ON journal_voice
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_voice();

CREATE TRIGGER journal_voice_encrypt_before_update
  BEFORE UPDATE ON journal_voice
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_voice();

-- Trigger auto-chiffrement journal_text
CREATE OR REPLACE FUNCTION encrypt_journal_text()
RETURNS TRIGGER AS $$
BEGIN
  -- Chiffrer les données sensibles avant insertion
  IF NEW.text_raw IS NOT NULL THEN
    NEW.text_raw_encrypted := encrypt_sensitive_data(NEW.text_raw, 'journal_encryption_key');
  END IF;
  
  IF NEW.styled_html IS NOT NULL THEN
    NEW.styled_html_encrypted := encrypt_sensitive_data(NEW.styled_html, 'journal_encryption_key');
  END IF;
  
  IF NEW.preview IS NOT NULL THEN
    NEW.preview_encrypted := encrypt_sensitive_data(NEW.preview, 'journal_encryption_key');
  END IF;
  
  IF NEW.emo_vec IS NOT NULL THEN
    NEW.emo_vec_encrypted := encrypt_sensitive_data(NEW.emo_vec::text, 'journal_encryption_key');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER journal_text_encrypt_before_insert
  BEFORE INSERT ON journal_text
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_text();

CREATE TRIGGER journal_text_encrypt_before_update
  BEFORE UPDATE ON journal_text
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_text();

-- Vues déchiffrées pour accès utilisateur
CREATE OR REPLACE VIEW journal_voice_decrypted AS
SELECT 
  id,
  ts,
  user_id,
  user_hash,
  audio_url,
  CASE 
    WHEN text_raw_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(text_raw_encrypted, 'journal_encryption_key')
    ELSE text_raw
  END as text_raw,
  CASE 
    WHEN summary_120_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(summary_120_encrypted, 'journal_encryption_key')
    ELSE summary_120
  END as summary_120,
  valence,
  CASE 
    WHEN emo_vec_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(emo_vec_encrypted, 'journal_encryption_key')::numeric[]
    ELSE emo_vec
  END as emo_vec,
  pitch_avg,
  CASE 
    WHEN crystal_meta_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(crystal_meta_encrypted, 'journal_encryption_key')::jsonb
    ELSE crystal_meta
  END as crystal_meta
FROM journal_voice;

CREATE OR REPLACE VIEW journal_text_decrypted AS
SELECT 
  id,
  ts,
  user_id,
  user_hash,
  CASE 
    WHEN text_raw_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(text_raw_encrypted, 'journal_encryption_key')
    ELSE text_raw
  END as text_raw,
  CASE 
    WHEN styled_html_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(styled_html_encrypted, 'journal_encryption_key')
    ELSE styled_html
  END as styled_html,
  CASE 
    WHEN preview_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(preview_encrypted, 'journal_encryption_key')
    ELSE preview
  END as preview,
  valence,
  CASE 
    WHEN emo_vec_encrypted IS NOT NULL 
    THEN decrypt_sensitive_data(emo_vec_encrypted, 'journal_encryption_key')::numeric[]
    ELSE emo_vec
  END as emo_vec
FROM journal_text;

-- RLS sur les vues (même policies que les tables)
ALTER VIEW journal_voice_decrypted OWNER TO postgres;
ALTER VIEW journal_text_decrypted OWNER TO postgres;

-- Grant permissions sur les vues
GRANT SELECT ON journal_voice_decrypted TO authenticated;
GRANT SELECT ON journal_text_decrypted TO authenticated;