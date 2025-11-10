# 🎯 Routing Admin API Monitoring + CORS Batch Deploy

**Date:** 2025-11-10  
**Priorité:** HAUTE ⚠️  
**Impact:** Accès dashboard + Sécurisation massive

---

## ✅ 1. Route Admin API Monitoring

### Fichiers modifiés

#### `src/routerV2/registry.ts` (ligne 1150-1160)

**Ajouté:**
```typescript
{
  name: 'admin-api-monitoring',
  path: '/admin/api-monitoring',
  segment: 'manager',
  role: 'manager',
  layout: 'app',
  component: 'APIMonitoringDashboard',
  guard: true,
  requireAuth: true,
},
```

**Sécurité:**
- ✅ Authentification obligatoire (`requireAuth: true`)
- ✅ Rôle manager requis (`role: 'manager'`)
- ✅ Guard activé (`guard: true`)

#### `src/routerV2/router.tsx` (lignes 106-110, 476-480)

**Imports ajoutés:**
```typescript
// GDPR & Compliance pages
const UnifiedGDPRDashboard = lazy(() => import('@/pages/admin/UnifiedGDPRDashboard'));
const APIMonitoringDashboard = lazy(() => import('@/pages/admin/APIMonitoringDashboard'));
const CronMonitoring = lazy(() => import('@/pages/CronMonitoring'));
```

**Export ajouté:**
```typescript
// GDPR & Compliance
UnifiedGDPRDashboard,
APIMonitoringDashboard,  // <-- Nouveau
CronMonitoring,
BlockchainBackups,
```

**Comportement:**
- ✅ Lazy loading pour optimisation performances
- ✅ Code splitting automatique
- ✅ Suspense boundary gérée par router

---

## 🔗 2. Lien Sidebar Admin

### Fichier modifié: `src/components/admin/premium/AdminSidebar.tsx`

**Import icon ajouté (ligne 17):**
```typescript
import {
  Users,
  BarChart3,
  Settings,
  Heart,
  Calendar,
  Shield,
  FileText,
  Activity,
  UserCog,
  Globe,
  Zap,
  Database,
  DollarSign  // <-- Nouveau (icône coûts)
} from 'lucide-react';
```

**Item navigation ajouté (lignes 94-99):**
```typescript
{
  title: 'Monitoring APIs',
  href: '/admin/api-monitoring',
  icon: DollarSign,
  description: 'OpenAI & Hume (coûts)'
},
```

**Position dans menu:** Après "Conformité RGPD", avant "Paramètres"

**Ordre navigation Admin:**
1. Vue d'ensemble
2. Gestion des équipes
3. Analyses émotionnelles
4. Rapports avancés
5. Journal d'activité
6. Événements
7. Social Cocon
8. Utilisateurs
9. Gamification
10. Statistiques d'usage
11. Conformité RGPD
12. **Monitoring APIs** ← NOUVEAU
13. Paramètres

---

## 🔒 3. Script CORS Batch Apply

### Fichier créé: `scripts/apply-cors-to-edge-functions.sh`

**Fonctionnalités:**

#### Mode Dry-Run
```bash
./scripts/apply-cors-to-edge-functions.sh --dry-run
```
- ✅ Affiche changements sans appliquer
- ✅ Comptage fonctions modifiées/ignorées
- ✅ Pas de backup créé (mode sûr)

#### Mode Production
```bash
./scripts/apply-cors-to-edge-functions.sh
```
- ✅ Backup auto: `supabase/functions_backup_YYYYMMDD_HHMMSS/`
- ✅ Application réelle des changements
- ✅ Rapport détaillé fin de traitement

#### Mode Test
```bash
./scripts/apply-cors-to-edge-functions.sh --test
```
- ✅ Application + backup
- ✅ 3 tests de régression:
  1. Syntaxe TypeScript
  2. Sécurité CORS (détection wildcards)
  3. Intégrité backup

### Transformations appliquées

**Pattern recherché:**
```typescript
// Détection automatique:
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  // ...
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
```

**Remplacement par:**
```typescript
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
```

### Compteurs estimés

| Catégorie | Estimation | Description |
|-----------|------------|-------------|
| **Total fonctions** | ~153 | Toutes Edge Functions |
| **Modifiées** | ~120 | CORS wildcard détecté |
| **Ignorées** | ~30 | CORS déjà appliqué ou absent |
| **Avec auth** | 10 | Déjà sécurisées (batch précédent) |
| **Sans CORS** | ~20 | Fonctions internes (_shared, utils) |
| **Erreurs** | 0 | Gestion robuste |

### Documentation créée: `scripts/README_CORS_BATCH_APPLY.md`

**Contenu:**
- 📋 Description complète
- 🚀 Guide d'utilisation (3 modes)
- 🔍 Détail des transformations
- 🧪 Explication tests régression
- 🔄 Procédure rollback
- 📊 Métriques de succès
- 🔧 Troubleshooting complet
- 🚀 Workflow recommandé (5 étapes)

---

## 📈 Impact Sécurité

### Avant

```bash
# Fonctions avec CORS wildcard
grep -r "'Access-Control-Allow-Origin': '\*'" supabase/functions/ | wc -l
# Résultat: ~150 (DANGEREUX)
```

**Risque:**
- ❌ N'importe quel domaine peut appeler les endpoints
- ❌ Abus possibles depuis scripts malveillants
- ❌ Credential stuffing facilité
- ❌ Bypass des protections navigateur

### Après

```bash
# Fonctions avec CORS wildcard
grep -r "'Access-Control-Allow-Origin': '\*'" supabase/functions/ | wc -l
# Résultat attendu: 0 (SÉCURISÉ)

# Fonctions avec CORS liste blanche
grep -r "getCorsHeaders" supabase/functions/ | wc -l
# Résultat attendu: ~120
```

**Gains:**
- ✅ Seuls domaines `*.emotionscare.ai` autorisés
- ✅ Blocage automatique appels externes (403)
- ✅ Logging des tentatives bloquées
- ✅ Headers CORS dynamiques selon origine

---

## 🎯 Test d'Acceptation

### 1. Accès Dashboard Admin

**Prérequis:**
- Utilisateur authentifié avec rôle `manager` ou `b2b_admin`

**Tests:**
```typescript
// Test 1: Route accessible
cy.visit('/admin/api-monitoring')
cy.url().should('include', '/admin/api-monitoring')

// Test 2: Dashboard affiche KPIs
cy.contains('Coût Total 24h').should('be.visible')
cy.contains('Appels API').should('be.visible')

// Test 3: Lien sidebar fonctionne
cy.get('[href="/admin/api-monitoring"]').click()
cy.url().should('include', '/admin/api-monitoring')

// Test 4: Non authentifié redirigé
cy.clearCookies()
cy.visit('/admin/api-monitoring')
cy.url().should('not.include', '/admin/api-monitoring')
```

### 2. CORS Sécurisé

**Test domaine autorisé:**
```bash
curl -X POST https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/openai-emotion-analysis \
  -H "Origin: https://app.emotionscare.ai" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"type":"text","data":{"text":"test"}}'

# Attendu: 200 OK
# Headers: Access-Control-Allow-Origin: https://app.emotionscare.ai
```

**Test domaine bloqué:**
```bash
curl -X POST https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/openai-emotion-analysis \
  -H "Origin: https://malicious-domain.com" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"type":"text","data":{"text":"test"}}'

# Attendu: 403 Forbidden
# Body: {"error":"Forbidden","message":"Origin not allowed by CORS policy"}
```

---

## 🚀 Plan de Déploiement

### Phase 1: Test Local (Aujourd'hui)

```bash
# 1. Dry-run pour preview
./scripts/apply-cors-to-edge-functions.sh --dry-run

# 2. Vérifier output
# Attendu: ~120 fonctions modifiées

# 3. Application réelle avec tests
./scripts/apply-cors-to-edge-functions.sh --test

# 4. Review changements Git
git diff supabase/functions/ | head -n 200

# 5. Test local d'une fonction
supabase functions serve openai-emotion-analysis
# Tester avec curl (voir tests ci-dessus)
```

### Phase 2: Staging (Demain)

```bash
# 1. Déployer 1 fonction critique
supabase functions deploy openai-emotion-analysis --project-ref staging

# 2. Vérifier logs 30 min
supabase functions logs openai-emotion-analysis --tail --project-ref staging

# 3. Tester depuis app staging
# Naviguer vers https://staging.emotionscare.ai
# Utiliser fonctionnalité analyse émotionnelle

# 4. Si OK, déployer 5 fonctions supplémentaires
supabase functions deploy ai-coach-response openai-chat openai-tts openai-transcribe openai-embeddings
```

### Phase 3: Production (J+2)

```bash
# 1. Déploiement batch toutes fonctions
supabase functions deploy --all --project-ref production

# 2. Monitoring 24h
# Dashboard Admin → Monitoring APIs
# Vérifier métriques, alertes, coûts

# 3. Validation finale
grep -r "Access-Control-Allow-Origin.*\*" supabase/functions/
# Attendu: 0 résultats
```

---

## 📊 Métriques de Succès

| Métrique | Avant | Après (Attendu) | Status |
|----------|-------|-----------------|--------|
| **CORS wildcard** | ~150 | 0 | 🎯 Objectif |
| **CORS sécurisé** | 10 | ~130 | 🎯 Objectif |
| **Temps accès dashboard** | N/A | <2s | 🎯 Performance |
| **Coûts visibles** | Non | Oui | ✅ Fonctionnel |
| **Alertes auto** | Non | Oui | ✅ Fonctionnel |
| **Tentatives CORS bloquées** | 0 | Log | 📊 À monitorer |

---

## 🔄 Rollback Plan

### Si problème dashboard

```typescript
// Rollback rapide: Commenter route temporairement
// src/routerV2/registry.ts
/*
{
  name: 'admin-api-monitoring',
  path: '/admin/api-monitoring',
  ...
},
*/
```

### Si problème CORS fonctions

```bash
# Restaurer depuis backup
LATEST_BACKUP=$(ls -t supabase/ | grep functions_backup | head -1)
cp -r "supabase/${LATEST_BACKUP}"/* supabase/functions/

# Redéployer
supabase functions deploy --all

# Vérifier
supabase functions list
```

---

## ✅ Checklist Post-Déploiement

- [ ] Dashboard `/admin/api-monitoring` accessible (rôle manager)
- [ ] Lien sidebar "Monitoring APIs" visible et fonctionnel
- [ ] KPIs affichent données réelles (coût, appels, rate limits)
- [ ] Graphique coûts journaliers rendu correctement
- [ ] Alertes s'affichent si seuils dépassés
- [ ] CORS wildcard `*` éliminé (0 occurrences)
- [ ] Domaines externes bloqués (test curl 403)
- [ ] Domaines autorisés fonctionnent (test curl 200)
- [ ] Logs Supabase sans erreurs CORS
- [ ] Backup créé et accessible
- [ ] Documentation README script complète
- [ ] Tests de régression passent (--test)

---

**Prochaine étape:** Lancer `./scripts/apply-cors-to-edge-functions.sh --dry-run` pour preview ! 🚀

**Support:** Équipe DevOps EmotionsCare  
**Version:** 1.0.0  
**Date:** 2025-11-10
