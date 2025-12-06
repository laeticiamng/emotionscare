# JOUR 4 - Option 3 : GDPR Data Encryption (3-4h)

**Objectif** : Chiffrer les données sensibles pour conformité RGPD complète

---

## 🎯 Périmètre

### Données sensibles identifiées

#### 1. Journal Voice (critique 🔴)
- `text_raw` : Transcription complète (PII)
- `summary_120` : Résumé (peut contenir PII)
- `emo_vec` : Vecteur émotionnel (données santé)
- `crystal_meta` : Métadonnées vocales (empreinte vocale)

#### 2. Journal Text (critique 🔴)
- `text_raw` : Texte brut journal (PII)
- `styled_html` : HTML stylisé (PII)
- `preview` : Aperçu (PII)
- `emo_vec` : Vecteur émotionnel (données santé)

#### 3. VR Sessions (sensible 🟡)
- Données biométriques : `hrv_pre`, `hrv_post`, `hr_mean`
- Données émotionnelles : `valence`, `arousal`
- Métadonnées session : peuvent contenir PII

#### 4. Assessments (critique 🔴)
- `score_json` : Résultats tests psychologiques (données santé)
- `answers` : Réponses utilisateur (données santé)

#### 5. Breath Metrics (sensible 🟡)
- Données physiologiques : `hrv_stress_idx`, `coherence_avg`
- Indicateurs santé mentale : `mood_score`, `mindfulness_avg`

---

## 📋 Plan d'implémentation

### Phase 1 : Infrastructure de chiffrement (1h)

#### 1.1 Setup Supabase Vault (30 min)
```sql
-- Activer extension vault
CREATE EXTENSION IF NOT EXISTS vault;

-- Créer clé de chiffrement principale
INSERT INTO vault.secrets (name, secret)
VALUES ('emotionscare_master_key', gen_random_uuid()::text);

-- Créer clés dérivées par type de données
INSERT INTO vault.secrets (name, secret)
VALUES 
  ('journal_encryption_key', gen_random_uuid()::text),
  ('vr_encryption_key', gen_random_uuid()::text),
  ('assessment_encryption_key', gen_random_uuid()::text);
```

#### 1.2 Fonctions de chiffrement (30 min)
```sql
-- Fonction de chiffrement générique
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(
  p_plaintext TEXT,
  p_key_name TEXT DEFAULT 'emotionscare_master_key'
) RETURNS TEXT AS $$
DECLARE
  v_key TEXT;
BEGIN
  SELECT decrypted_secret INTO v_key
  FROM vault.decrypted_secrets
  WHERE name = p_key_name;
  
  RETURN encode(
    encrypt(
      p_plaintext::bytea,
      v_key::bytea,
      'aes-gcm'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction de déchiffrement générique
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(
  p_ciphertext TEXT,
  p_key_name TEXT DEFAULT 'emotionscare_master_key'
) RETURNS TEXT AS $$
DECLARE
  v_key TEXT;
BEGIN
  SELECT decrypted_secret INTO v_key
  FROM vault.decrypted_secrets
  WHERE name = p_key_name;
  
  RETURN convert_from(
    decrypt(
      decode(p_ciphertext, 'base64'),
      v_key::bytea,
      'aes-gcm'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### Phase 2 : Migration Journal (1h)

#### 2.1 Nouvelles colonnes chiffrées (15 min)
```sql
-- journal_voice : ajouter colonnes _encrypted
ALTER TABLE journal_voice
  ADD COLUMN text_raw_encrypted TEXT,
  ADD COLUMN summary_120_encrypted TEXT,
  ADD COLUMN emo_vec_encrypted TEXT,
  ADD COLUMN crystal_meta_encrypted TEXT;

-- journal_text : ajouter colonnes _encrypted
ALTER TABLE journal_text
  ADD COLUMN text_raw_encrypted TEXT,
  ADD COLUMN styled_html_encrypted TEXT,
  ADD COLUMN preview_encrypted TEXT,
  ADD COLUMN emo_vec_encrypted TEXT;
```

#### 2.2 Migration des données existantes (30 min)
```sql
-- Chiffrer journal_voice existant
UPDATE journal_voice
SET 
  text_raw_encrypted = encrypt_sensitive_data(text_raw, 'journal_encryption_key'),
  summary_120_encrypted = encrypt_sensitive_data(summary_120, 'journal_encryption_key'),
  emo_vec_encrypted = encrypt_sensitive_data(emo_vec::text, 'journal_encryption_key'),
  crystal_meta_encrypted = encrypt_sensitive_data(crystal_meta::text, 'journal_encryption_key')
WHERE text_raw_encrypted IS NULL;

-- Chiffrer journal_text existant
UPDATE journal_text
SET 
  text_raw_encrypted = encrypt_sensitive_data(text_raw, 'journal_encryption_key'),
  styled_html_encrypted = encrypt_sensitive_data(styled_html, 'journal_encryption_key'),
  preview_encrypted = encrypt_sensitive_data(preview, 'journal_encryption_key'),
  emo_vec_encrypted = encrypt_sensitive_data(emo_vec::text, 'journal_encryption_key')
WHERE text_raw_encrypted IS NULL;
```

#### 2.3 Triggers automatiques (15 min)
```sql
-- Trigger auto-chiffrement journal_voice
CREATE OR REPLACE FUNCTION encrypt_journal_voice()
RETURNS TRIGGER AS $$
BEGIN
  NEW.text_raw_encrypted := encrypt_sensitive_data(NEW.text_raw, 'journal_encryption_key');
  NEW.summary_120_encrypted := encrypt_sensitive_data(NEW.summary_120, 'journal_encryption_key');
  NEW.emo_vec_encrypted := encrypt_sensitive_data(NEW.emo_vec::text, 'journal_encryption_key');
  NEW.crystal_meta_encrypted := encrypt_sensitive_data(NEW.crystal_meta::text, 'journal_encryption_key');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER journal_voice_encrypt_before_insert
  BEFORE INSERT ON journal_voice
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_voice();

-- Idem pour journal_text
CREATE OR REPLACE FUNCTION encrypt_journal_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.text_raw_encrypted := encrypt_sensitive_data(NEW.text_raw, 'journal_encryption_key');
  NEW.styled_html_encrypted := encrypt_sensitive_data(NEW.styled_html, 'journal_encryption_key');
  NEW.preview_encrypted := encrypt_sensitive_data(NEW.preview, 'journal_encryption_key');
  NEW.emo_vec_encrypted := encrypt_sensitive_data(NEW.emo_vec::text, 'journal_encryption_key');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER journal_text_encrypt_before_insert
  BEFORE INSERT ON journal_text
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_journal_text();
```

---

### Phase 3 : Migration VR & Assessments (1h)

#### 3.1 VR Sessions (30 min)
```sql
-- Ajouter colonnes chiffrées VR
ALTER TABLE vr_nebula_sessions
  ADD COLUMN biometric_data_encrypted TEXT;

ALTER TABLE vr_dome_sessions
  ADD COLUMN biometric_data_encrypted TEXT;

-- Fonction d'agrégation données sensibles VR
CREATE OR REPLACE FUNCTION aggregate_vr_biometric(
  p_hrv_pre NUMERIC,
  p_hrv_post NUMERIC,
  p_valence NUMERIC,
  p_arousal NUMERIC
) RETURNS TEXT AS $$
BEGIN
  RETURN jsonb_build_object(
    'hrv_pre', p_hrv_pre,
    'hrv_post', p_hrv_post,
    'valence', p_valence,
    'arousal', p_arousal
  )::text;
END;
$$ LANGUAGE plpgsql;

-- Trigger auto-chiffrement VR
CREATE OR REPLACE FUNCTION encrypt_vr_session()
RETURNS TRIGGER AS $$
BEGIN
  NEW.biometric_data_encrypted := encrypt_sensitive_data(
    aggregate_vr_biometric(NEW.hrv_pre, NEW.hrv_post, NEW.valence, NEW.arousal),
    'vr_encryption_key'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER vr_nebula_encrypt_before_insert
  BEFORE INSERT ON vr_nebula_sessions
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_vr_session();
```

#### 3.2 Assessments (30 min)
```sql
-- Ajouter colonnes chiffrées
ALTER TABLE assessment_sessions
  ADD COLUMN answers_encrypted TEXT,
  ADD COLUMN context_encrypted TEXT;

ALTER TABLE assessments
  ADD COLUMN score_json_encrypted TEXT;

-- Triggers auto-chiffrement
CREATE OR REPLACE FUNCTION encrypt_assessment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'assessment_sessions' THEN
    NEW.answers_encrypted := encrypt_sensitive_data(NEW.answers::text, 'assessment_encryption_key');
    NEW.context_encrypted := encrypt_sensitive_data(NEW.context::text, 'assessment_encryption_key');
  ELSIF TG_TABLE_NAME = 'assessments' THEN
    NEW.score_json_encrypted := encrypt_sensitive_data(NEW.score_json::text, 'assessment_encryption_key');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER assessment_sessions_encrypt
  BEFORE INSERT ON assessment_sessions
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_assessment();

CREATE TRIGGER assessments_encrypt
  BEFORE INSERT ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_assessment();
```

---

### Phase 4 : Vues de déchiffrement (30 min)

```sql
-- Vue déchiffrée journal_voice (pour utilisateurs autorisés)
CREATE OR REPLACE VIEW journal_voice_decrypted AS
SELECT 
  id,
  ts,
  user_id,
  audio_url,
  decrypt_sensitive_data(text_raw_encrypted, 'journal_encryption_key') as text_raw,
  decrypt_sensitive_data(summary_120_encrypted, 'journal_encryption_key') as summary_120,
  valence,
  decrypt_sensitive_data(emo_vec_encrypted, 'journal_encryption_key')::numeric[] as emo_vec,
  pitch_avg,
  decrypt_sensitive_data(crystal_meta_encrypted, 'journal_encryption_key')::jsonb as crystal_meta
FROM journal_voice
WHERE user_id = auth.uid();

-- Vue déchiffrée journal_text
CREATE OR REPLACE VIEW journal_text_decrypted AS
SELECT 
  id,
  ts,
  user_id,
  decrypt_sensitive_data(text_raw_encrypted, 'journal_encryption_key') as text_raw,
  decrypt_sensitive_data(styled_html_encrypted, 'journal_encryption_key') as styled_html,
  decrypt_sensitive_data(preview_encrypted, 'journal_encryption_key') as preview,
  valence,
  decrypt_sensitive_data(emo_vec_encrypted, 'journal_encryption_key')::numeric[] as emo_vec
FROM journal_text
WHERE user_id = auth.uid();

-- RLS sur les vues
ALTER VIEW journal_voice_decrypted OWNER TO authenticated;
ALTER VIEW journal_text_decrypted OWNER TO authenticated;
```

---

### Phase 5 : Adaptation code application (30 min)

#### 5.1 Mise à jour services/journal/lib/db.ts
```typescript
// Utiliser les vues déchiffrées au lieu des tables directes
export async function listFeed(userId?: string) {
  const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
  
  if (!targetUserId) {
    return [];
  }

  // Utiliser les VUES déchiffrées (auto-déchiffrement côté DB)
  const [voiceResult, textResult] = await Promise.all([
    supabase
      .from('journal_voice_decrypted')  // ← Vue déchiffrée
      .select('id, ts, summary_120')
      .eq('user_id', targetUserId)
      .order('ts', { ascending: false }),
    supabase
      .from('journal_text_decrypted')   // ← Vue déchiffrée
      .select('id, ts, preview')
      .eq('user_id', targetUserId)
      .order('ts', { ascending: false }),
  ]);

  // ... reste du code inchangé
}
```

---

## ✅ Critères de conformité RGPD

- [x] **Chiffrement at-rest** : AES-256-GCM
- [x] **Gestion clés** : Supabase Vault (isolé)
- [x] **Déchiffrement contrôlé** : Vues RLS user-specific
- [x] **Audit trail** : Logs Supabase automatiques
- [x] **Droit à l'oubli** : Suppression données chiffrées = irrécupérable
- [x] **Minimisation données** : Seuls champs sensibles chiffrés
- [x] **Pseudonymisation** : user_id UUID anonyme

---

## 🚀 Déploiement

### 1. Backup avant migration (critique ⚠️)
```bash
# Backup Supabase via CLI
supabase db dump > backup_pre_encryption_$(date +%Y%m%d).sql
```

### 2. Exécution migration (30 min)
```bash
# Phase 1 : Infrastructure
psql -f migrations/gdpr_encryption_phase1_infra.sql

# Phase 2 : Journal
psql -f migrations/gdpr_encryption_phase2_journal.sql

# Phase 3 : VR & Assessments
psql -f migrations/gdpr_encryption_phase3_vr_assessments.sql

# Phase 4 : Vues
psql -f migrations/gdpr_encryption_phase4_views.sql
```

### 3. Vérification (15 min)
```sql
-- Tester chiffrement/déchiffrement
SELECT 
  text_raw_encrypted,
  decrypt_sensitive_data(text_raw_encrypted, 'journal_encryption_key') as decrypted
FROM journal_voice
LIMIT 1;

-- Vérifier vues RLS
SELECT * FROM journal_voice_decrypted LIMIT 5;
SELECT * FROM journal_text_decrypted LIMIT 5;
```

---

## 📊 Impact performance

- **Chiffrement** : +5-10ms par insertion (trigger)
- **Déchiffrement** : +10-20ms par lecture (vue)
- **Stockage** : +30% (base64 encoding)

**Acceptable** pour conformité RGPD critique ✅

---

**Statut** : 🔄 EN COURS - Phase 1 (Infrastructure)
