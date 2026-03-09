

# Plan de correction des éléments restants — Audit V2

## Etat actuel

Les corrections précédentes ont couvert :
- ✅ SessionContext supprimé (plus aucun import trouvé)
- ✅ SocialCoconContext migré vers Supabase (localStorage en fallback uniquement)
- ✅ UnifiedCoachContext migré vers Supabase
- ✅ DemoBanner ajouté sur 21 pages identifiées (B2B, B2C, Manager, Music, Admin)
- ✅ verification_results RLS restreint aux authenticated
- ✅ ~35 fichiers nettoyés de @ts-nocheck (hooks, services, contexts)

## Ce qui reste à corriger (par priorité)

### Batch 1 — DemoBanner manquant sur 4 pages mock restantes (P0)

Ces pages utilisent Math.random() pour simuler des données **sans DemoBanner** :

| Page | Problème |
|------|----------|
| `src/pages/SupportChatbotPage.tsx` | Chatbot entièrement simulé (setTimeout + réponses scriptées) |
| `src/pages/admin/UnifiedGDPRDashboard.tsx` | Métriques edge functions simulées (Math.random) |
| `src/pages/gamification/AchievementsPage.tsx` | weeklyData simulé (Math.random) |
| `src/pages/WeeklyReportPage.tsx` | wellnessScore avec Math.random() |

**Action** : Ajouter `DemoBanner` avec message contextuel sur chacune.

### Batch 2 — useCoachHandlers localStorage (P1)

Le fichier `src/contexts/coach/useCoachHandlers.ts` (740 lignes) utilise encore `localStorage` pour :
- `coach-handlers-data`
- `coach-emotion-history`  
- `coach-favorites`

**Action** : Ce fichier est trop complexe pour un nettoyage complet en une passe. Plan :
1. Supprimer le `@ts-nocheck`
2. Corriger les erreurs de type les plus critiques
3. Migrer les 3 clés localStorage vers Supabase si les tables existent, sinon documenter

### Batch 3 — @ts-nocheck sur fichiers critiques restants (P1-P2)

Avec ~1450 fichiers restants (782 components + 306 hooks + 213 lib + 96 services + 58 pages), un nettoyage total est impossible en une passe. 

**Stratégie** : Cibler les fichiers les plus critiques pour la sécurité et la stabilité :
- Pages d'authentification (`src/pages/b2c/login/`, `src/pages/b2b/user/LoginPage.tsx`, `src/pages/b2b/user/RegisterPage.tsx`)
- Pages admin (`src/pages/admin/`)
- Composants d'auth/accès (`src/components/access/`, `src/components/account/`)
- Services de sécurité restants (`src/services/auth/`, `src/lib/security/`)
- Router/guards (`src/lib/routerV2/`)

**Action** : Retirer @ts-nocheck et corriger les types sur ~15-20 fichiers critiques supplémentaires.

### Batch 4 — Composants avec Math.random() décoratif vs trompeur (P2-P3)

155 composants utilisent Math.random(). La majorité sont des animations visuelles (particules, backgrounds, transitions) — **pas trompeur**. Quelques cas sont problématiques :
- `SmartNotificationSystem.tsx` : génère de fausses notifications aléatoires
- `EmotionScannerPremium.tsx` : scan mock avec Math.random() pour valence/arousal
- `WorldMapView.tsx` : clusters émotionnels factices

**Action** : Ajouter DemoBanner uniquement sur les composants qui **simulent des fonctionnalités métier**, pas sur les animations décoratives.

## Résumé du plan d'implémentation

| # | Action | Fichiers | Priorité |
|---|--------|----------|----------|
| 1 | DemoBanner sur 4 pages mock restantes | 4 fichiers | P0 |
| 2 | Nettoyage useCoachHandlers (partiel) | 1 fichier | P1 |
| 3 | Retrait @ts-nocheck sur fichiers auth/sécurité/admin | ~15 fichiers | P1 |
| 4 | DemoBanner sur composants métier trompeurs | ~3 fichiers | P2 |

