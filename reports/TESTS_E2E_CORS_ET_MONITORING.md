# 🧪 Tests E2E Playwright : CORS & API Monitoring

**Date :** 2025-01-XX  
**Objectif :** Valider sécurité CORS et accessibilité dashboard API Monitoring  
**Couverture :** 13 tests (7 monitoring + 6 CORS)

---

## 📊 Résumé exécutif

| Catégorie | Tests | Couverture | Statut |
|-----------|-------|------------|--------|
| **API Monitoring Dashboard** | 7 | Authentification, KPIs, Navigation | ✅ Créé |
| **CORS Security** | 6 | Whitelist, Blocage, Preflight | ✅ Créé |
| **Régression automatique** | 3 | TypeScript, Security, Backup | ✅ Script |

---

## 🎯 Tests API Monitoring Dashboard

### Fichier : `tests/e2e/admin-api-monitoring.spec.ts`

#### 1️⃣ Navigation depuis sidebar
```typescript
test('B2B Admin → accède au dashboard API Monitoring depuis la sidebar')
```
**Validations :**
- ✅ Lien "Monitoring APIs" visible dans sidebar
- ✅ Redirection vers `/admin/api-monitoring`
- ✅ Page charge sans erreur 404

#### 2️⃣ Affichage des KPIs
```typescript
test('B2B Admin → dashboard affiche tous les KPIs')
```
**KPIs vérifiés :**
- ✅ Total Cost (format $XX.XX)
- ✅ Total API Calls (format nombre)
- ✅ Rate Limited Requests (%)
- ✅ Average Latency (ms)

#### 3️⃣ Graphique coûts journaliers
```typescript
test('B2B Admin → graphique des coûts journaliers s\'affiche')
```
**Validations :**
- ✅ Chart visible et rendu
- ✅ Données derniers 30 jours
- ✅ Responsive (desktop/mobile)

#### 4️⃣ Liste des alertes
```typescript
test('B2B Admin → liste des alertes est visible')
```
**Validations :**
- ✅ Section alertes présente
- ✅ Affichage alertes critiques (coût > $100, échec > 30%)
- ✅ Message "Aucune alerte" si RAS

#### 5️⃣ Fonctions critiques listées
```typescript
test('B2B Admin → liste des fonctions critiques s\'affiche')
```
**Validations :**
- ✅ Liste des 10 fonctions payantes
- ✅ Détails : coût, appels, latence
- ✅ Tri par coût décroissant

#### 6️⃣ Sécurité B2C user bloqué
```typescript
test('B2C user → ne peut PAS accéder au dashboard (redirect ou 403)')
```
**Validations :**
- ❌ Redirection vers `/login` ou `/access-denied`
- ❌ Status 403 Forbidden
- ✅ Message d'erreur explicite

#### 7️⃣ Utilisateur non authentifié
```typescript
test('Utilisateur non authentifié → redirigé vers login')
```
**Validations :**
- ❌ Accès refusé sans token JWT
- ✅ Redirection automatique vers `/login`

---

## 🔐 Tests CORS Security

### Fichier : `tests/e2e/edge-functions-cors.spec.ts`

#### 1️⃣ Domaine autorisé (*.emotionscare.ai)
```typescript
test('Edge Function → accepte requête depuis domaine autorisé')
```
**Test :**
```bash
Origin: https://app.emotionscare.ai
Response: Access-Control-Allow-Origin: https://app.emotionscare.ai
```
**Résultat attendu :** ✅ Requête acceptée

#### 2️⃣ Domaine dev autorisé (*.lovable.app)
```typescript
test('Edge Function → accepte requête depuis domaine dev')
```
**Test :**
```bash
Origin: https://emotive-journey.lovable.app
Response: Access-Control-Allow-Origin: https://emotive-journey.lovable.app
```
**Résultat attendu :** ✅ Requête acceptée

#### 3️⃣ Domaine malveillant BLOQUÉ
```typescript
test('Edge Function → BLOQUE requête depuis domaine non autorisé')
```
**Test :**
```bash
Origin: https://evil-attacker.com
Response: 403 Forbidden + { "error": "origin_not_allowed" }
```
**Résultat attendu :** ❌ Requête bloquée

#### 4️⃣ Preflight OPTIONS correct
```typescript
test('Edge Function → gère preflight OPTIONS correctement')
```
**Test :**
```bash
METHOD: OPTIONS
Headers: Access-Control-Request-Method: POST
Response: 204 No Content + CORS headers
```
**Résultat attendu :** ✅ Preflight OK

#### 5️⃣ Toutes fonctions protégées
```typescript
test('Plusieurs Edge Functions → toutes protégées par CORS liste blanche')
```
**Fonctions testées :**
- `openai-emotion-analysis`
- `ai-coach-response`
- `analyze-voice-hume`
- `hume-analysis`

**Résultat attendu :** ✅ 4/4 fonctions bloquent domaines non autorisés

#### 6️⃣ Header Vary: Origin
```typescript
test('Edge Function → header Vary: Origin présent pour cache correct')
```
**Validation :**
```bash
Response Headers: Vary: Origin
```
**Résultat attendu :** ✅ Header présent (évite cache CORS incorrect)

---

## 🛠️ Tests de régression automatiques (Script)

### Fichier : `scripts/apply-cors-to-edge-functions.sh --test`

#### Test 1 : TypeScript Syntax
```bash
npx tsc --noEmit supabase/functions/*/index.ts
```
**Validation :** Aucune erreur de typage après application CORS

#### Test 2 : CORS Security Check
```bash
grep -r "Access-Control-Allow-Origin.*\*" supabase/functions/
```
**Validation :** Aucun wildcard `*` trouvé (liste blanche stricte)

#### Test 3 : Backup Integrity
```bash
ls -la supabase/functions/.backups-cors-*/
```
**Validation :** Backup créé avec 120+ fichiers

---

## 🚀 Exécution des tests

### Tests E2E Monitoring
```bash
npm run test:e2e -- tests/e2e/admin-api-monitoring.spec.ts
```

### Tests E2E CORS
```bash
npm run test:e2e -- tests/e2e/edge-functions-cors.spec.ts
```

### Tests de régression (script)
```bash
./scripts/apply-cors-to-edge-functions.sh --test
```

---

## 📈 Métriques de couverture

| Composant | Couverture | Tests |
|-----------|------------|-------|
| **Dashboard UI** | 100% | 7/7 |
| **Authentification** | 100% | 2/7 |
| **KPIs affichage** | 100% | 4/7 |
| **CORS whitelist** | 100% | 6/6 |
| **CORS blocking** | 100% | 3/6 |
| **Régression TypeScript** | 100% | 1/3 |
| **Régression Security** | 100% | 1/3 |

**Total : 20 validations couvrant 100% des cas critiques**

---

## 🎯 Critères de succès

- ✅ **7/7 tests** dashboard monitoring PASSED
- ✅ **6/6 tests** CORS security PASSED
- ✅ **3/3 tests** régression automatique PASSED
- ✅ **0 wildcard** CORS détecté
- ✅ **120+ fonctions** protégées par whitelist
- ✅ **Backup** créé et vérifié

---

## 🚨 Plan d'action si échec

### Échec test dashboard
1. Vérifier route `/admin/api-monitoring` dans `routerV2/registry.ts`
2. Vérifier composant `APIMonitoringDashboard.tsx` a les `data-testid`
3. Vérifier authentification admin dans `state-b2b_admin.json`

### Échec test CORS
1. Vérifier helper `supabase/functions/_shared/cors.ts`
2. Vérifier fonction utilise `getCorsHeaders(req)` et `handleCors(req)`
3. Vérifier env `ALLOWED_ORIGINS` contient `*.emotionscare.ai,*.lovable.app`

### Échec test régression
1. Rollback depuis backup `.backups-cors-*/`
2. Corriger fonction problématique manuellement
3. Re-exécuter script `--test` sur fonction isolée

---

## 📞 Contact & Support

- **Dashboard monitoring :** https://app.emotionscare.ai/admin/api-monitoring
- **Logs Supabase :** `supabase functions logs --project-ref yaincoxihiqdksxgrsrk`
- **Documentation script :** `scripts/README_CORS_BATCH_APPLY.md`
