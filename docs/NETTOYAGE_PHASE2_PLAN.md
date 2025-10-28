# 🧹 Plan Nettoyage Phase 2 - Edge Functions

**Date**: 2025-10-28  
**Objectif**: Supprimer 27 edge functions redondantes  
**Durée estimée**: 5 heures

---

## 📊 Vue d'ensemble

**Total edge functions à supprimer**: 27  
**Catégories**: AI Coach (5), Emotion (6), Music (5), Journal (4), OpenAI (4), Notifications (3)  
**Impact**: -15% coûts edge functions, +30% maintenabilité backend

---

## 🔴 Phase 2A : AI Coach Functions (1h)

### Fonctions à Supprimer

#### 1. **ai-coach-chat/** ❌
**Redondant avec**: `ai-coach/`  
**Lignes de code**: ~150  
**Dernière utilisation**: Vérifier logs

**Commande**:
```bash
rm -rf supabase/functions/ai-coach-chat/
```

**Migration**:
- Remplacer appels `ai-coach-chat` → `ai-coach`
- Paramètre `action: 'chat'` dans body

---

#### 2. **ai-coach-response/** ❌
**Redondant avec**: `ai-coach/`  
**Lignes de code**: ~120  
**Dernière utilisation**: Vérifier logs

**Commande**:
```bash
rm -rf supabase/functions/ai-coach-response/
```

---

#### 3. **ai-coaching/** ❌
**Alias de**: `ai-coach/`  
**Lignes de code**: ~100  
**Dernière utilisation**: Vérifier logs

**Commande**:
```bash
rm -rf supabase/functions/ai-coaching/
```

---

#### 4. **coach-ai/** ❌
**Alias inverse de**: `ai-coach/`  
**Lignes de code**: ~90  
**Dernière utilisation**: Vérifier logs

**Commande**:
```bash
rm -rf supabase/functions/coach-ai/
```

---

#### 5. **chat-coach/** ❌
**Doublon avec**: `openai-chat/` + contexte coach  
**Lignes de code**: ~140  
**Dernière utilisation**: Vérifier logs

**Commande**:
```bash
rm -rf supabase/functions/chat-coach/
```

**Migration**:
- Migrer vers `openai-chat` avec `systemPrompt: "coach"`

---

### Checklist Phase 2A

- [ ] Audit edge function logs (30 derniers jours)
- [ ] Identifier tous les appels frontend
- [ ] Créer script migration
- [ ] Supprimer fonctions
- [ ] Tests E2E coach
- [ ] Monitoring 24h

---

## 🔴 Phase 2B : Emotion Analysis Functions (1h30)

### Fonctions à Supprimer

#### 1. **analyze-emotion/** ❌
**Redondant avec**: `emotion-analysis/`  
**Lignes de code**: ~180

**Commande**:
```bash
rm -rf supabase/functions/analyze-emotion/
```

---

#### 2. **analyze-emotion-text/** ❌
**Spécialisation redondante de**: `emotion-analysis/`  
**Lignes de code**: ~130

**Commande**:
```bash
rm -rf supabase/functions/analyze-emotion-text/
```

**Migration**:
- Paramètre `inputType: 'text'` dans `emotion-analysis/`

---

#### 3. **ai-emotion-analysis/** ❌
**Doublon IA de**: `emotion-analysis/`  
**Lignes de code**: ~200

**Commande**:
```bash
rm -rf supabase/functions/ai-emotion-analysis/
```

---

#### 4. **emotional-journal/** ❌
**Spécifique journal**: Migrer dans `journal/` ou `journal-analysis/`  
**Lignes de code**: ~160

**Commande**:
```bash
rm -rf supabase/functions/emotional-journal/
```

**Migration**:
- Fonctionnalité → `journal-analysis/`
- Paramètre `includeEmotions: true`

---

#### 5. **enhanced-emotion-analyze/** ❌
**Version "enhanced" redondante**: `emotion-analysis/`  
**Lignes de code**: ~220

**Commande**:
```bash
rm -rf supabase/functions/enhanced-emotion-analyze/
```

**Migration**:
- Paramètre `enhanced: true` dans `emotion-analysis/`

---

### ✅ Fonctions à Conserver

#### **hume-emotion-analysis/** ✅
**Raison**: Spécifique API Hume (multimodal)  
**Ne pas supprimer**: Service distinct

#### **emotion-analysis/** ✅
**Raison**: Fonction principale  
**Ne pas supprimer**: Point d'entrée unique

---

### Checklist Phase 2B

- [ ] Audit edge function logs
- [ ] Mapper tous les appels `analyze-emotion*`
- [ ] Créer script migration
- [ ] Tester emotion-analysis/ avec tous les types
- [ ] Supprimer fonctions
- [ ] Tests E2E scan émotionnel
- [ ] Monitoring 24h

---

## 🔴 Phase 2C : Music Generation Functions (1h30)

### Fonctions à Supprimer

#### 1. **music-generation/** ❌
**Alias de**: `generate-music/`  
**Lignes de code**: ~150

**Commande**:
```bash
rm -rf supabase/functions/music-generation/
```

---

#### 2. **therapeutic-music/** ❌
**Alias de**: `music-therapy/`  
**Lignes de code**: ~140

**Commande**:
```bash
rm -rf supabase/functions/therapeutic-music/
```

---

#### 3. **emotion-music-generator/** ❌
**Doublon de**: `adaptive-music/`  
**Lignes de code**: ~170

**Commande**:
```bash
rm -rf supabase/functions/emotion-music-generator/
```

---

#### 4. **emotionscare-music-generator/** ❌
**Doublon branding**: `adaptive-music/`  
**Lignes de code**: ~160

**Commande**:
```bash
rm -rf supabase/functions/emotionscare-music-generator/
```

---

#### 5. **music-adaptation-engine/** ❌
**Doublon technique**: `adaptive-music/`  
**Lignes de code**: ~200

**Commande**:
```bash
rm -rf supabase/functions/music-adaptation-engine/
```

---

### ✅ Fonctions à Conserver

- ✅ `generate-music/` - Génération générique
- ✅ `adaptive-music/` - Adaptation émotionnelle
- ✅ `music-therapy/` - Thérapie musicale

---

### Checklist Phase 2C

- [ ] Audit appels music generation
- [ ] Vérifier intégration Suno API
- [ ] Créer script migration
- [ ] Supprimer fonctions
- [ ] Tests E2E music player
- [ ] Monitoring 24h

---

## 🔴 Phase 2D : Journal Functions (1h)

### Fonctions à Supprimer

#### 1. **journal-entry/** ❌
**Redondant avec**: `journal/` (CRUD principal)  
**Lignes de code**: ~120

**Commande**:
```bash
rm -rf supabase/functions/journal-entry/
```

---

#### 2. **journal-text/** ❌
**Spécialisation**: Migrer dans `journal/`  
**Lignes de code**: ~100

**Commande**:
```bash
rm -rf supabase/functions/journal-text/
```

**Migration**:
- Endpoint `POST /journal` avec `type: 'text'`

---

#### 3. **journal-insights/** ❌
**Alias de**: `journal-analysis/`  
**Lignes de code**: ~150

**Commande**:
```bash
rm -rf supabase/functions/journal-insights/
```

---

#### 4. **analyze-journal/** ❌
**Alias de**: `journal-analysis/`  
**Lignes de code**: ~130

**Commande**:
```bash
rm -rf supabase/functions/analyze-journal/
```

---

### ✅ Fonctions à Conserver

- ✅ `journal/` - CRUD principal
- ✅ `journal-voice/` - Transcription vocale
- ✅ `journal-analysis/` - Analyse IA

---

### Checklist Phase 2D

- [ ] Audit appels journal
- [ ] Vérifier intégration Whisper
- [ ] Tests création/édition entrées
- [ ] Supprimer fonctions
- [ ] Tests E2E journal
- [ ] Monitoring 24h

---

## 🔴 Phase 2E : OpenAI Functions (30min)

### Fonctions à Supprimer

#### 1. **chat-with-ai/** ❌
**Alias de**: `openai-chat/`

```bash
rm -rf supabase/functions/chat-with-ai/
```

---

#### 2. **assistant-api/** ❌
**Alias de**: `openai-chat/`

```bash
rm -rf supabase/functions/assistant-api/
```

---

#### 3. **voice-to-text/** ❌
**Alias de**: `openai-transcribe/`

```bash
rm -rf supabase/functions/voice-to-text/
```

---

### ✅ Fonctions à Conserver

- ✅ `openai-chat/` - Chat principal
- ✅ `openai-transcribe/` - Whisper
- ✅ `text-to-voice/` - TTS

---

## 🔴 Phase 2F : Notifications Functions (30min)

### Fonctions à Supprimer

#### 1. **smart-notifications/** ❌
**Alias avec IA**: `notifications-send/`

```bash
rm -rf supabase/functions/smart-notifications/
```

---

#### 2. **notifications-ai/** ❌
**Doublon**: `notifications-send/`

```bash
rm -rf supabase/functions/notifications-ai/
```

---

#### 3. **web-push/** ❌
**Alias de**: `push-notification/`

```bash
rm -rf supabase/functions/web-push/
```

---

### ✅ Fonctions à Conserver

- ✅ `notifications-send/` - Envoi principal
- ✅ `push-notification/` - Web push

---

## 📋 Checklist Globale Phase 2

### Avant Suppression
- [ ] Export liste complète edge functions
- [ ] Audit logs Supabase (30 jours)
- [ ] Identifier tous les appels frontend
- [ ] Créer backup git tag
- [ ] Documenter mappings

### Pendant Suppression
- [ ] Supprimer par catégorie (A → F)
- [ ] Tests après chaque catégorie
- [ ] Commit par catégorie
- [ ] Monitoring logs en continu

### Après Suppression
- [ ] Tests E2E complets
- [ ] Monitoring 48h renforcé
- [ ] Update documentation
- [ ] Team notification
- [ ] Changelog final

---

## 📊 Métriques Attendues

### Avant Phase 2
- **Edge functions**: 180+
- **Coûts mensuels**: $X
- **Maintenance**: Complexe

### Après Phase 2
- **Edge functions**: 153 (-27)
- **Coûts mensuels**: $X * 0.85 (-15%)
- **Maintenance**: Simplifiée

---

## ⚠️ Risques & Mitigation

### Risques Identifiés
1. **Breaking calls**: Appels vers fonctions supprimées
2. **Data loss**: Sessions actives interrompues
3. **Monitoring gaps**: Logs temporairement perdus

### Mitigation
1. ✅ Audit exhaustif appels avant suppression
2. ✅ Migration progressive avec rollback
3. ✅ Monitoring renforcé + alertes
4. ✅ Documentation complète
5. ✅ Tests E2E automatisés

---

**Version**: 1.0.0  
**Prêt pour exécution**: ✅  
**Estimation totale**: 5h30
