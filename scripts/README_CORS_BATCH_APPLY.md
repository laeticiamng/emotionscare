# 🔧 Script d'Application Batch CORS

## 📋 Description

Script bash pour appliquer automatiquement le helper CORS sécurisé (`_shared/cors.ts`) à toutes les Edge Functions Supabase (~150+ fonctions), avec tests de régression pour garantir aucune casse.

## 🎯 Objectif

**Remplacer** le CORS wildcard dangereux (`'Access-Control-Allow-Origin': '*'`) par une liste blanche stricte de domaines autorisés uniquement:
- `*.emotionscare.ai`
- `*.lovable.app` (dev/preview)
- `localhost` (dev local)

## 📦 Fichiers

- **Script principal:** `scripts/apply-cors-to-edge-functions.sh`
- **Helper CORS:** `supabase/functions/_shared/cors.ts`
- **Documentation:** Ce README

## 🚀 Usage

### Mode Dry-Run (Simulation)

Affiche les changements **sans les appliquer**:

```bash
chmod +x scripts/apply-cors-to-edge-functions.sh
./scripts/apply-cors-to-edge-functions.sh --dry-run
```

**Sortie exemple:**
```
╔════════════════════════════════════════════════════════╗
║  CORS Batch Application - EmotionsCare Edge Functions ║
╚════════════════════════════════════════════════════════╝

✅ Helper CORS détecté
📊 153 fonctions Edge détectées

🔧 Processing openai-emotion-analysis...
   [DRY RUN] Modifierait: supabase/functions/openai-emotion-analysis/index.ts
...

╔════════════════════════════════════════════════════════╗
║                    RÉSUMÉ                              ║
╚════════════════════════════════════════════════════════╝
✅ Modifiées:     120
⏭️  Ignorées:      33
❌ Erreurs:       0
📊 Total:         153
```

### Mode Production (Application réelle)

**⚠️ CRÉE UN BACKUP AUTOMATIQUE**

```bash
./scripts/apply-cors-to-edge-functions.sh
```

**Backup créé:** `supabase/functions_backup_YYYYMMDD_HHMMSS/`

### Mode Test (Avec régression)

Applique les changements **ET** lance les tests de régression:

```bash
./scripts/apply-cors-to-edge-functions.sh --test
```

**Tests lancés:**
1. ✅ **Syntaxe TypeScript** - Vérification imports CORS complets
2. ✅ **Sécurité CORS** - Détection wildcards `*` résiduels
3. ✅ **Intégrité backup** - Comptage fichiers backup vs actuel

## 🔍 Que fait le script ?

### Transformations appliquées

**AVANT:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ... logique fonction
```

**APRÈS:**
```typescript
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // ... logique fonction
```

### Logique de détection

**Fonctions MODIFIÉES:**
- ✅ Possède `corsHeaders = { ... }`
- ✅ Possède `if (req.method === 'OPTIONS')`
- ❌ Ne possède PAS déjà `getCorsHeaders` ou `handleCors`

**Fonctions IGNORÉES:**
- ⏭️ CORS déjà appliqué (détection `getCorsHeaders`)
- ⏭️ Pas de `corsHeaders` définis (fonction ne gérant pas CORS)
- ⏭️ `index.ts` absent

## 🧪 Tests de Régression

### Test 1: Syntaxe TypeScript

**Vérifie:** Tous les fichiers modifiés ont des imports CORS complets

```typescript
// ✅ VALIDE
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

// ❌ INVALIDE (import partiel)
import { getCorsHeaders } from '../_shared/cors.ts';
```

### Test 2: Sécurité CORS

**Vérifie:** Aucun wildcard `*` résiduel

```typescript
// ❌ DANGEREUX (détecté)
'Access-Control-Allow-Origin': '*'

// ✅ SÉCURISÉ
const corsHeaders = getCorsHeaders(req);
```

### Test 3: Intégrité Backup

**Vérifie:** Backup contient autant de fonctions que l'actuel

```bash
Backup:  153 fonctions
Actuel:  153 fonctions
Status:  ✅ Intègre
```

## 🔄 Rollback

En cas de problème, restaurer depuis le backup:

```bash
# Lister backups disponibles
ls -la supabase/ | grep functions_backup

# Restaurer backup
cp -r supabase/functions_backup_20251110_143022/* supabase/functions/

# Vérifier
git status supabase/functions/
```

## 📊 Statistiques attendues

| Catégorie | Nombre estimé | Raison |
|-----------|---------------|--------|
| **Modifiées** | ~120 | Fonctions avec CORS wildcard |
| **Ignorées** | ~30 | CORS déjà appliqué ou absent |
| **Erreurs** | 0 | Script robuste avec gestion erreurs |

## ⚙️ Configuration

### Variables d'environnement (optionnelles)

```bash
# Personnaliser répertoire backup
export CORS_BACKUP_DIR="/custom/backup/path"

# Désactiver création backup (⚠️ non recommandé)
export CORS_NO_BACKUP=true
```

### Exclure certaines fonctions

Éditer le script et ajouter au filtre:

```bash
# Ligne 52
FUNCTIONS=($(find "$BASE_DIR" -maxdepth 1 -type d \
  -not -name "_shared" \
  -not -name "functions" \
  -not -name "special-function-name" \  # <-- Ajouter ici
  | sed "s|$BASE_DIR/||" | grep -v "^\.$"))
```

## 🔧 Troubleshooting

### Erreur: `Permission denied`

**Solution:**
```bash
chmod +x scripts/apply-cors-to-edge-functions.sh
```

### Erreur: `Helper CORS introuvable`

**Vérification:**
```bash
ls -la supabase/functions/_shared/cors.ts
# Devrait afficher le fichier
```

**Si absent:**
```bash
# Le helper CORS doit être créé d'abord
# Voir: supabase/functions/_shared/cors.ts
```

### Erreur: `sed: command not found` (Windows Git Bash)

**Solution:** Utiliser WSL (Windows Subsystem for Linux):

```bash
wsl ./scripts/apply-cors-to-edge-functions.sh
```

### Modifications non appliquées

**Debug:**
```bash
# Activer mode verbose
bash -x scripts/apply-cors-to-edge-functions.sh --dry-run
```

## 📈 Métriques de Succès

### Avant application

```bash
# Compter fonctions avec CORS wildcard
grep -r "'Access-Control-Allow-Origin': '\*'" supabase/functions/ | wc -l
# Résultat: ~150
```

### Après application

```bash
# Compter fonctions avec CORS wildcard
grep -r "'Access-Control-Allow-Origin': '\*'" supabase/functions/ | wc -l
# Résultat attendu: 0

# Compter fonctions avec CORS sécurisé
grep -r "getCorsHeaders" supabase/functions/ | wc -l
# Résultat attendu: ~120
```

## 🚀 Workflow Recommandé

### Étape 1: Dry-Run + Revue

```bash
./scripts/apply-cors-to-edge-functions.sh --dry-run > cors_preview.txt
cat cors_preview.txt
# Vérifier liste fonctions modifiées
```

### Étape 2: Application + Tests

```bash
./scripts/apply-cors-to-edge-functions.sh --test
```

### Étape 3: Validation Git

```bash
git status
git diff supabase/functions/ | head -n 100
```

### Étape 4: Test Local d'une Fonction

```bash
# Tester une fonction critique
supabase functions serve openai-emotion-analysis

# Dans un autre terminal, tester avec curl depuis domaine externe
curl -X POST https://localhost:54321/functions/v1/openai-emotion-analysis \
  -H "Origin: https://malicious.com" \
  -H "Content-Type: application/json" \
  -d '{"type":"text","data":{"text":"test"}}'

# Attendu: 403 Forbidden
```

### Étape 5: Déploiement Progressif

```bash
# Déployer 1 fonction test
supabase functions deploy openai-chat

# Vérifier logs production
supabase functions logs openai-chat --tail

# Si OK, déployer toutes les fonctions
supabase functions deploy
```

## 📚 Ressources

- **Helper CORS:** `supabase/functions/_shared/cors.ts`
- **Documentation sécurité:** `reports/CORS_SECURISE_ET_DASHBOARD_MONITORING.md`
- **Edge Functions Supabase:** https://supabase.com/docs/guides/functions

## ⚠️ Avertissements

1. **Ne jamais exécuter en production sans dry-run préalable**
2. **Backup automatique créé, mais garder copie manuelle externe**
3. **Tester localement avant déploiement production**
4. **Déploiement progressif recommandé (1 fonction → toutes)**

## 🤝 Support

**Questions/Bugs:** Contacter équipe DevOps EmotionsCare

**Rollback urgent:**
```bash
cp -r supabase/functions_backup_[TIMESTAMP]/* supabase/functions/
supabase functions deploy
```

---

**Auteur:** Assistant Lovable AI  
**Version:** 1.0.0  
**Date:** 2025-11-10
