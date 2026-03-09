

# AUDIT TECHNIQUE V3 — EmotionsCare Platform

---

## 1. RÉSUMÉ EXÉCUTIF

**État global** : La plateforme est fonctionnellement riche (2749 lignes de registre de routes, ~250 edge functions, ~300+ pages) mais souffre de problèmes structurels récurrents qui empêchent un go-live confiant. Le travail d'audit V2 a corrigé beaucoup de dette, mais des problèmes critiques persistent.

**Niveau de préparation réel** : 65/100

**Verdict go-live** : **NON EN L'ÉTAT**

### Top 5 P0 — Bloquants critiques

1. **Anon key Supabase hardcodée dans le code source** (`src/lib/config.ts` ligne 19, `src/lib/monitoring.ts` ligne 137) — clé JWT visible en clair dans le bundle. Bien que publique par nature, le hardcoding en fallback dans config.ts ET son duplication dans monitoring.ts contournent la validation d'env et empêchent toute rotation.

2. **Route admin `/admin/platform-audit` accessible avec role `consumer`** — Le registre (ligne 2615-2627) définit `segment: 'consumer', role: 'consumer'` pour une page d'audit système accessible à n'importe quel utilisateur authentifié au lieu de `manager`/`admin`.

3. **~55 fichiers de pages critiques encore en `@ts-nocheck`** — dont des pages B2B d'authentification (`LoginPage.tsx`, `RegisterPage.tsx`), des pages de gestion de données sensibles (GDPR, Research Export, Institutional Report, Teams) et des pages de billing. Type safety absente sur du code sensible.

4. **Toutes les fonctionnalités B2B/institutional (5 nouveaux modules) utilisent exclusivement des données simulées (Math.random, hardcoded arrays)** — TeamWellbeingDashboard, InterventionsLibrary, ResearchExport, InstitutionalReport, BurnoutAssessment affichent des DemoBanner mais ces pages sont présentées comme "stable" dans le registre des routes (`status: 'stable'`). Incohérence entre le marquage et la réalité.

5. **AuthContext récupère `getSession()` AVANT le listener `onAuthStateChange`** — L'ordre est inversé dans l'implémentation : le listener est bien enregistré en premier (ligne 107), mais le pattern `getInitialSession` (ligne 84) est ensuite appelé. Cependant, le listener synchrone met `isLoading=false` dans le callback, ce qui peut créer une race condition si le callback `onAuthStateChange` se déclenche avant que `getInitialSession` ait terminé, causant un flash de contenu authentifié/non-authentifié.

### Top 5 P1 — Très importants

1. **`verify_jwt = false` sur toutes les edge functions** — 67 fonctions listées dans config.toml avec JWT désactivé. La validation JWT manuelle est documentée comme pattern mais non confirmable pour chaque fonction depuis l'interface.

2. **~24 pages utilisent Math.random() pour simuler des données métier** sans que le statut ne soit "beta" ou "demo" dans le registre — AnalyticsPage, B2BDashboardAnalytics, B2CActivitePage, B2CBubbleBeatPage, etc.

3. **`useCoachHandlers.ts` (740 lignes)** utilise encore localStorage pour `coach-handlers-data`, `coach-emotion-history`, `coach-favorites` — données de coaching non persistées côté serveur.

4. **Route `/b2b/wellness` est `guard: false`** (ligne 278-282) — un hub B2B wellness accessible sans authentification.

5. **2 fichiers console.error non structurés** restent dans `VRGalaxyPage.tsx` — violations des règles projet (pas de console.log en production).

---

## 2. TABLEAU D'AUDIT COMPLET

| Prio | Domaine | Page/Route/Fonction | Problème | Symptôme | Risque | Recommandation | Faisable maintenant ? |
|------|---------|---------------------|----------|----------|--------|----------------|----------------------|
| P0 | Security | `src/lib/config.ts:19` | Anon key JWT hardcodée en fallback | Clé visible dans bundle | Rotation impossible, mauvaise pratique | Supprimer le fallback hardcodé, exiger env var | Oui |
| P0 | Security | `src/lib/monitoring.ts:137` | Anon key dupliquée en dur | Hardcoded dans fetch headers | Même problème, doublon | Utiliser import depuis `env.ts` | Oui |
| P0 | Auth/RLS | `/admin/platform-audit` | `role: 'consumer'` au lieu de `'manager'` | Tout user auth accède à l'audit admin | Fuite d'informations | Changer segment/role en `manager` | Oui |
| P0 | TypeScript | 55 pages avec `@ts-nocheck` | Dont LoginPage B2B, RegisterPage, GDPR, Teams | Erreurs runtime silencieuses | Bugs non détectés | Retirer progressivement, priorité auth/billing | Partiellement |
| P0 | UX/Intégrité | 5 modules institutional | `status: 'stable'` mais données 100% mockées | Confusion utilisateur | Promesse produit trompeuse | Changer status en `'demo'` ou brancher Supabase | Oui (status) |
| P1 | Security | config.toml | 67 fonctions `verify_jwt = false` | Pas de validation JWT Supabase native | Dépend de la validation manuelle dans chaque fn | Auditer chaque edge function | Non confirmé |
| P1 | Auth | AuthContext | Race condition potentielle isLoading | Flash UI possible | UX dégradée au login | Confirmer test manuel | Oui (test) |
| P1 | Security | `/b2b/wellness` | `guard: false` sur hub B2B | Accessible sans auth | Données B2B potentiellement exposées | Ajouter `guard: true, requireAuth: true` | Oui |
| P1 | Data | useCoachHandlers.ts | 3 clés localStorage non migrées | Données perdues si changement device | Perte data coach | Migrer vers Supabase | Partiellement |
| P1 | UX | 24+ pages avec Math.random() | Données métier simulées sans DemoBanner | Fonctionnalité trompeuse | Confiance utilisateur | Ajouter DemoBanner ou brancher backend | Partiellement |
| P1 | Performance | Homepage | 9 sections lazy-loadées | Waterfall de chunks | FCP impacté | Précharger les 2 sections visibles | Oui |
| P2 | Code quality | VRGalaxyPage.tsx | `console.error` en production | Violation règles projet | Bruit console | Remplacer par logger | Oui |
| P2 | SEO | Pages B2B institutional | Pas de structured data JSON-LD | Indexation limitée | Visibilité réduite | Ajouter JSON-LD | Oui |
| P2 | Accessibility | InstitutionalFeaturesSection | Pas de `aria-labelledby` entre icône et titre | WCAG AA incomplet | Score a11y réduit | Ajouter attributs ARIA | Oui |
| P2 | i18n | 5 pages institutional | Textes français uniquement hardcodés | Pas de clés i18n | Blocage multilingue | Extraire vers fichiers i18n | Plus tard |
| P3 | DX | registry.ts | 2749 lignes, TODO ligne 1 | Maintenabilité difficile | Risque erreur humaine | Splitter en modules | Plus tard |

---

## 3. DÉTAIL PAR CATÉGORIE

### Frontend & Rendu
- **Fonctionne** : Router V2 solide, guards AuthGuard/RoleGuard/ModeGuard corrects, layout adaptatif (marketing/app/simple), 404 fallback, error boundaries.
- **Cassé** : Route `/admin/platform-audit` avec role consumer (P0).
- **Douteux** : `/b2b/wellness` sans guard, `/app/activity` en segment public sans auth.
- **Non confirmé** : Responsive mobile sur les 5 nouvelles pages institutional (pas de session replay).

### Auth & Autorisations
- **Fonctionne** : AuthContext suit le bon pattern (listener avant getSession), signUp avec emailRedirectTo, resetPassword avec redirectTo, refresh session, friendly errors.
- **Cassé** : Rien de bloquant confirmé.
- **Douteux** : La race condition isLoading est théorique mais réelle. TEST_MODE.BYPASS_AUTH est désactivé (bon).
- **Non confirmé** : Comportement exact des RoleGuard sur toutes les 60+ routes admin/manager.

### APIs & Edge Functions
- **Fonctionne** : Architecture super-router (8 routeurs), router-adapter.ts pour redirection.
- **Cassé** : Rien de confirmé.
- **Douteux** : Les 5 pages institutional ne font AUCUN appel API — 100% frontend mock. ResearchExport fait un `setTimeout(r, 2000)` pour simuler un export.
- **Non confirmé** : Validation JWT manuelle dans chacune des 67 edge functions.

### Database & RLS
- **Fonctionne** : RLS check SQL test existe, verification_results restreint aux authenticated.
- **Non confirmé depuis l'interface** : État réel des RLS sur toutes les tables (consents, assessments, org_*, etc.).

### Sécurité
- **Fonctionne** : SafeHtml/DOMPurify pour XSS, ESLint rule `ec/no-raw-innerhtml`, pas de `dangerouslySetInnerHTML` hors SafeHtml.
- **Cassé** : Anon key hardcodée dans 2 fichiers (config.ts, monitoring.ts) — rotation impossible.
- **Douteux** : CORS `*` sur les edge functions (acceptable pour anon key mais risqué si des endpoints sont sensibles).

### Paiement & Billing
- **Fonctionne** : PremiumPage redirige vers /pricing (pas de page Premium trompeuse), SubscribePage existe.
- **Non confirmé** : Stripe checkout réellement fonctionnel, webhooks traités, état abonnement reflété.

### Performance
- **Fonctionne** : Lazy loading extensif, SectionSkeleton pour fallbacks, chunk splitting.
- **Douteux** : 9 sections lazy sur la homepage = waterfall potentiel.

### SEO
- **Fonctionne** : usePageSEO sur les pages institutional, sitemap, robots.txt, hreflang.
- **Manquant** : JSON-LD sur les 5 nouvelles pages institutional.

### Accessibilité
- **Fonctionne** : Skip link sur homepage, aria-labelledby sur les sections principales.
- **Manquant** : Vérification WCAG sur les 5 nouvelles pages.

### i18n
- **Fonctionne** : Infrastructure i18next en place.
- **Manquant** : Les 5 pages institutional sont entièrement en français hardcodé (pas de clés i18n).

### Observabilité & Go-live
- **Fonctionne** : Logger structuré, Sentry conditionné au consentement, DemoBanner sur 25+ pages mock.
- **Manquant** : Health endpoint frontend, status page publique.
- **Problème** : `status: 'stable'` sur des fonctionnalités 100% mockées = déclaration trompeuse dans le registre.

---

## 4. PLAN D'ACTION PRIORISÉ

### Correctifs immédiats P0 (faisables maintenant)
1. Supprimer la clé anon hardcodée de `config.ts` et `monitoring.ts` → utiliser `SUPABASE_ANON_KEY` depuis `env.ts`
2. Corriger le role de `/admin/platform-audit` : `consumer` → `manager`
3. Changer `status: 'stable'` → `status: 'demo'` pour les 5 modules institutional (burnout, team-wellbeing, interventions, research-export, institutional-report) dans registry.ts

### Correctifs rapides P1
4. Ajouter `guard: true, requireAuth: true` sur `/b2b/wellness`
5. Remplacer `console.error` par `logger.error` dans `VRGalaxyPage.tsx`
6. Retirer `@ts-nocheck` des pages auth B2B (`LoginPage.tsx`, `RegisterPage.tsx`)

### Améliorations P2
7. Ajouter DemoBanner sur les pages simulées sans banner (AnalyticsPage, B2BDashboardAnalytics, etc.)
8. Ajouter JSON-LD structuré sur les pages institutional
9. Audit ARIA des composants InstitutionalFeaturesSection

### Polish P3
10. Splitter registry.ts en modules par segment
11. Extraire les textes des pages institutional vers i18n
12. Précharger les 2 premières sections homepage

---

## 5. IMPLÉMENTATION IMMÉDIATE

Les corrections suivantes seront appliquées directement :

1. **`src/lib/config.ts`** : Supprimer le fallback JWT hardcodé de `ANON_KEY`
2. **`src/lib/monitoring.ts`** : Remplacer la clé hardcodée par import de `SUPABASE_ANON_KEY` depuis `env.ts`
3. **`src/routerV2/registry.ts`** : Corriger role de `platform-audit` (`consumer` → `manager`), changer status des 5 modules institutional (`stable` → `demo`)
4. **`src/routerV2/registry.ts`** : Ajouter `guard: true, requireAuth: true` sur `/b2b/wellness`
5. **`src/pages/app/VRGalaxyPage.tsx`** : Remplacer `console.error` par `logger.error`

Ces corrections ne nécessitent aucun secret, accès externe, ou décision produit. Elles sont toutes sûres et rétrocompatibles.

