# AUDIT COMPLET — EmotionsCare

**Date :** 14 février 2026
**Version :** 1.2.0
**Auditeur :** Claude (Audit automatisé)
**Périmètre :** Audit technique et non technique de l'ensemble de la plateforme

---

## TABLE DES MATIÈRES

1. [Résumé exécutif](#1-résumé-exécutif)
2. [AUDIT TECHNIQUE](#2-audit-technique)
   - 2.1 Sécurité
   - 2.2 Qualité du code
   - 2.3 Dépendances
   - 2.4 Performance
   - 2.5 Architecture
3. [AUDIT NON TECHNIQUE](#3-audit-non-technique)
   - 3.1 UX/UI
   - 3.2 Accessibilité (A11Y)
   - 3.3 SEO
   - 3.4 Contenu
   - 3.5 Conformité légale / RGPD
   - 3.6 Internationalisation (i18n)
4. [Synthèse des constats](#4-synthèse-des-constats)
5. [Plan de remédiation](#5-plan-de-remédiation)

---

## 1. RÉSUMÉ EXÉCUTIF

### Chiffres clés du projet

| Métrique | Valeur |
|----------|--------|
| Lignes de TypeScript | 225 959 |
| Modules fonctionnels | 37 (tous production-ready) |
| Pages / Routes | 225+ |
| Composants React | 1 926 |
| Hooks personnalisés | 558 |
| Services API | 148 |
| Edge Functions (Supabase/Deno) | 261+ |
| Tables PostgreSQL | 723+ (toutes avec RLS) |
| Migrations SQL | 312 |
| Tests | 294+ (unitaires, intégration, E2E, charge) |
| Fichiers de documentation | 400+ |
| APIs IA intégrées | 11 (OpenAI, Hume, Suno, ElevenLabs, Perplexity, etc.) |

### Verdict global

| Domaine | Note | Statut |
|---------|------|--------|
| **Sécurité** | 6/10 | Vulnérabilités critiques dans les dépendances, stockage JWT à risque |
| **Qualité du code** | 6/10 | 95+ fichiers avec `@ts-nocheck`, 488 console.log, 200+ dépendances circulaires |
| **Dépendances** | 5/10 | 21 vulnérabilités npm (18 high, 3 moderate) |
| **Performance** | 7/10 | Bon code splitting, lazy loading, mais optimisations possibles |
| **Architecture** | 7/10 | Feature-first solide, mais dépendances circulaires et incohérences |
| **UX/UI** | 8/10 | Design system complet, états vides/chargement bien gérés |
| **Accessibilité** | 8/10 | WCAG 2.1 AA testé, skip links, ARIA, focus management |
| **SEO** | 7/10 | Meta tags sur 151 pages, mais images OG incorrectes |
| **Conformité RGPD** | 9/10 | Implémentation exemplaire avec audit trail complet |
| **i18n** | 5/10 | FR/EN complets, mais ES/DE déclarés sans traductions |

**Score global : 6.8 / 10 — Plateforme fonctionnelle avec des corrections critiques nécessaires avant mise en production.**

---

## 2. AUDIT TECHNIQUE

### 2.1 Sécurité

#### 2.1.1 Vulnérabilités des dépendances — CRITIQUE

**Sévérité : CRITIQUE**

`npm audit` révèle **21 vulnérabilités** :

| Paquet | Sévérité | Vulnérabilité | Impact |
|--------|----------|---------------|--------|
| `fastify` ≤ 5.7.2 | HIGH | DoS via unbounded memory (sendWebStream) + bypass Content-Type | Déni de service, contournement de validation |
| `xlsx` (toute version) | HIGH | Prototype Pollution + ReDoS | Exécution de code arbitraire sur l'export de données |
| `qs` ≤ 6.14.1 | HIGH | arrayLimit bypass (2 vulnérabilités) | DoS via parsing de paramètres |
| `cross-spawn` < 6.0.6 | HIGH | ReDoS | DoS dans le pipeline imagemin |
| `semver-regex` ≤ 3.1.3 | HIGH | ReDoS | DoS transitif |
| `http-cache-semantics` < 4.1.1 | HIGH | ReDoS | DoS transitif |
| `esbuild` ≤ 0.24.2 | MODERATE | MITM sur le dev server | Requêtes arbitraires en développement |

**Fichier concerné :** `package.json`, `node_modules/`

**Recommandation :**
1. Exécuter `npm audit fix` immédiatement
2. Mettre à jour `fastify` vers ≥ 5.7.4
3. Remplacer `xlsx` par une alternative sécurisée (SheetJS Community ou exceljs)
4. Évaluer le remplacement de `imagemin-webp` par `squoosh`

---

#### 2.1.2 Stockage des tokens JWT — HIGH

**Sévérité : HIGH**
**Fichier :** `src/lib/security/apiClient.ts:47`

Le token d'authentification est stocké dans `localStorage`, vulnérable aux attaques XSS :

```typescript
localStorage.getItem('supabase.auth.token')
```

**Risque :** Tout script malveillant injecté peut voler le token.

**Recommandation :**
- Migrer vers des cookies `httpOnly` via Supabase Auth middleware
- À défaut, utiliser `sessionStorage` (expire à la fermeture du navigateur)

---

#### 2.1.3 XSS — `dangerouslySetInnerHTML` — HIGH

**Sévérité : HIGH**
**14 fichiers** utilisent `dangerouslySetInnerHTML` :

| Fichier | Contexte |
|---------|----------|
| `src/components/ai/AIWellnessAssistant.tsx` | Rendu de réponses IA |
| `src/pages/journal/PanasSuggestionsCard.tsx` | Suggestions de journal |
| `src/components/ui/chart/ChartStyle.tsx` | Injection de styles dynamiques |
| `src/components/analytics/AIInsightsEnhanced.tsx` | Rendu d'analytiques |
| `src/components/animations/MicroInteractions.tsx` | HTML d'animations |
| + 9 autres fichiers | Divers |

**Mitigation partielle :** `DOMPurify` et `sanitize-html` sont dans les dépendances, mais leur utilisation systématique avant `dangerouslySetInnerHTML` n'est pas vérifiée.

**Recommandation :**
1. Auditer les 14 usages et s'assurer que `DOMPurify.sanitize()` est appelé avant chaque rendu
2. Créer une règle ESLint custom interdisant `dangerouslySetInnerHTML` sans sanitization

---

#### 2.1.4 Chiffrement côté client — HIGH

**Sévérité : HIGH**
**Fichier :** `src/lib/secureStorage.ts`

Le chiffrement AES-GCM côté client utilise une **clé déterministe** dérivée du hostname :

```typescript
encoder.encode(window.location.hostname + '_emotionscare_v1')
```

**Problèmes :**
- Clé identique pour tous les utilisateurs du même domaine
- Inutile contre XSS (le script malveillant peut déchiffrer)
- Faux sentiment de sécurité pour les données de santé

**Note :** Le fichier documente correctement ces limitations (lignes 265-280).

**Recommandation :** Réserver ce stockage aux données non sensibles (préférences UI). Les données de santé doivent rester protégées côté serveur par RLS.

---

#### 2.1.5 CORS — OK

**Sévérité : LOW**
**Fichier :** `supabase/functions/_shared/cors.ts`

Configuration correcte :
- Utilisation d'une **allowlist** (pas de wildcard `*`)
- Origines contrôlées par variable d'environnement `ALLOWED_ORIGINS`
- Validation du header `Origin`

**Verdict :** CONFORME

---

#### 2.1.6 CSP (Content Security Policy) — MEDIUM

**Sévérité : MEDIUM**
**Fichiers :** `_headers`, `src/lib/security/headers.ts`

**Problèmes identifiés :**
1. `'unsafe-inline'` dans `style-src` (nécessaire pour Tailwind mais augmente le risque XSS)
2. Wildcard `https://*.supabase.co` trop permissif
3. **Double définition** : CSP défini à la fois dans `_headers` et `headers.ts` (risque de désynchronisation)

**Recommandation :**
1. Centraliser la CSP dans un seul fichier
2. Restreindre les URLs Supabase à la région spécifique
3. Évaluer le remplacement de `unsafe-inline` par des nonces

---

#### 2.1.7 RLS (Row Level Security) — OK avec réserves

**Sévérité : MEDIUM**

**Points positifs :**
- RLS actif sur les 723+ tables
- Fonctions `is_authenticated()`, `is_owner()`, `is_admin()`, `has_role()` en place
- Migrations récentes corrigent les requêtes directes à `auth.users`

**Points d'attention :**
- Sous-requêtes dans les politiques RLS (risque N+1)
- Pas d'audit RLS automatisé dans la CI/CD
- Le fichier `supabase/tests/rls_check.sql` existe mais sa couverture n'est pas vérifiée

**Recommandation :**
1. Ajouter un test automatisé vérifiant que toutes les tables sensibles ont du RLS
2. Optimiser les politiques RLS en évitant les sous-requêtes

---

#### 2.1.8 Secrets et variables d'environnement — OK

**Sévérité : LOW**

- `.env` et `.env.*` dans `.gitignore` : OUI
- `.env.example` contient uniquement des placeholders : OUI
- Aucune clé API codée en dur dans le code source : OUI
- Secrets backend dans Supabase Vault : OUI
- 57 variables d'environnement documentées

**Verdict :** CONFORME

---

### 2.2 Qualité du code

#### 2.2.1 Contournements TypeScript — MEDIUM

| Indicateur | Nombre | Sévérité |
|-----------|--------|----------|
| `@ts-nocheck` | 95+ fichiers | MEDIUM |
| `@ts-ignore` | Inclus dans le total | MEDIUM |
| Usage de `any` | ~31 400 occurrences | MEDIUM |

**Fichiers critiques avec `@ts-nocheck` :**
- `src/lib/security/apiClient.ts` (ligne 1) — **fichier de sécurité !**
- `supabase/functions/_shared/cors.ts` (ligne 1) — **fichier de sécurité !**
- Multiples handlers d'edge functions

**Recommandation :**
1. Supprimer `@ts-nocheck` des fichiers de sécurité en priorité
2. Ajouter un hook pre-commit rejetant les nouveaux `@ts-nocheck`
3. Remplacer `any` par `unknown` avec type guards (objectif : -50%)

---

#### 2.2.2 Console.log en production — MEDIUM

**488 occurrences** de `console.log/warn/error` dans **151 fichiers**.

**Risques :**
- Fuite d'état interne dans la console
- Données utilisateur potentiellement loguées
- Impact performance en production

**Mitigation existante :** Un logger abstrait existe (`src/lib/logger.ts`) mais n'est pas utilisé partout.

**Recommandation :**
1. Règle ESLint `no-console` (sauf dans logger.ts)
2. Suppression automatique au build avec un plugin Vite
3. Utiliser Sentry pour le suivi d'erreurs en production

---

#### 2.2.3 Commentaires TODO/FIXME/HACK — MEDIUM

**99 occurrences** dans **39 fichiers**.

**Fichier le plus touché :** `src/services/coachService.ts` (10 occurrences)

**Recommandation :**
1. Convertir chaque FIXME en issue GitHub
2. Traiter les FIXME dans le code de sécurité comme des bloquants

---

#### 2.2.4 Gestion d'erreurs — MEDIUM

- **4 155 blocs try-catch** (couverture raisonnable)
- Plusieurs catch blocks vides (pattern de dégradation gracieuse)
- 10 implémentations d'Error Boundary (devrait être consolidé)

**Recommandation :**
1. Documenter les catch blocks vides
2. S'assurer que tous les Error Boundaries reportent à Sentry
3. Consolider en un seul ErrorBoundary configurable

---

### 2.3 Dépendances

#### 2.3.1 Vulnérabilités npm — CRITIQUE

Voir section 2.1.1 — **21 vulnérabilités** identifiées.

#### 2.3.2 Dépendances redondantes — LOW

| Doublon | Recommandation |
|---------|---------------|
| `cypress` + `playwright` | Garder uniquement Playwright |
| `puppeteer` + `playwright` | Garder uniquement Playwright |
| `date-fns` + `dayjs` | Choisir une seule librairie |
| `recharts` + `chart.js` | Évaluer la consolidation |

#### 2.3.3 Dépendances critiques à surveiller

| Paquet | Version | Risque |
|--------|---------|--------|
| `xlsx` | Toute version | Prototype Pollution — pas de fix disponible |
| `@huggingface/transformers` | 3.7.2 | Bundle très volumineux |
| `three` | 0.160.1 | Bundle volumineux, à lazy-loader |

---

### 2.4 Performance

#### 2.4.1 Code Splitting & Lazy Loading — GOOD

- **435+ usages** de `lazy()` pour le chargement différé
- **488+ usages** de `useMemo`/`useCallback`
- `React.memo` utilisé sur les composants coûteux
- Fichier `src/lib/lazy-components.ts` centralise le lazy loading

**Points d'amélioration :**
- Pas de route-level splitting explicite dans la config Vite
- Les librairies lourdes (Three.js, Transformers.js) devraient être chargées dans des Web Workers

#### 2.4.2 Core Web Vitals (déclarés)

| Métrique | Valeur | Cible |
|----------|--------|-------|
| FCP | 1.2s | < 1.8s OK |
| LCP | 2.1s | < 2.5s OK |
| CLS | 0.05 | < 0.1 OK |

#### 2.4.3 Optimisation d'images — MEDIUM

- `sharp` et `imagemin-webp`/`imagemin-avif` présents mais vulnérables
- Recommandation : migrer vers `squoosh` ou `sharp` seul

---

### 2.5 Architecture

#### 2.5.1 Structure Feature-First — GOOD

```
src/
├── features/       → 37 modules métier
├── components/     → 1 926 composants réutilisables
├── hooks/          → 558 hooks personnalisés
├── services/       → 148 services API
├── pages/          → 225+ pages routées
├── routerV2/       → Système de routage avancé
├── lib/            → Utilitaires et configuration
├── contexts/       → Providers React
└── stores/         → État global (Zustand)
```

#### 2.5.2 Dépendances circulaires — HIGH

**200+ dépendances circulaires** documentées dans `.dependency-cruiser-known-violations.json`.

**Exemple de cycle :**
```
routerV2/index.tsx → routerV2/router.tsx → pages/NavigationPage.tsx
→ components/debug/AccessDiagnostic.tsx → routerV2/index.tsx
```

**Impact :**
- Risque de problèmes d'ordre de chargement des modules
- Difficulté de refactoring
- Fuites mémoire potentielles

**Recommandation :**
1. Créer un plan de déscyclage progressif
2. Commencer par le routeur (cycles les plus critiques)
3. Extraire les utilitaires partagés dans des modules sans cycle

#### 2.5.3 Incohérences de nommage — MEDIUM

- `modules/` vs `features/` vs `services/` — frontières floues
- Certains composants accèdent directement à Supabase (au lieu de passer par les services)
- Certains hooks combinent logique métier et appels API

**Recommandation :** Documenter les responsabilités de chaque couche et enforcer avec `dependency-cruiser`.

---

## 3. AUDIT NON TECHNIQUE

### 3.1 UX/UI

#### 3.1.1 Design System — EXCELLENT

**Design tokens HSL** complets dans `tailwind.config.ts` :
- Couleurs : primary, secondary, accent, destructive, success, warning, error, info
- 13 animations (fade-in, slide, scale, shimmer, pulse-glow, etc.)
- Ombres multiples (premium, glow)
- Effets glassmorphism
- Espacements fluides (fluid-1, fluid-2, fluid-4, fluid-8)
- Typographie fluide responsive

**Mode sombre :** Correctement implémenté avec CSS variables et `prefers-color-scheme`.

#### 3.1.2 États de chargement — GOOD

Composants de skeleton screens bien implémentés :
- `WeeklyBarsSkeleton.tsx`
- `GlowGaugeSkeleton.tsx`
- `LoadingSkeleton.tsx`
- `LazyComponentLoader.tsx` avec fallback skeleton

#### 3.1.3 États vides — GOOD

Composants d'états vides bien designés :
- `empty-state.tsx` — État vide principal (3 variants : default, minimal, illustrated)
- `unified-empty-state.tsx` — État unifié
- `AdminEmptyState.tsx` — Spécifique admin
- `EmptyModuleState.tsx` — Spécifique modules
- Animations d'entrée avec Framer Motion

#### 3.1.4 Formulaires — GOOD

Système de formulaires robuste :
- React Hook Form + Zod validation
- `enhanced-form.tsx` avec résolution Zod automatique
- Feedback d'erreur au niveau du champ
- Gestion d'état via `useFormField()` context

#### 3.1.5 Fragmentation CSS — MEDIUM

Les tokens de design sont répartis dans **4 fichiers** :
- `tailwind.config.ts`
- `src/theme/theme.css`
- `src/styles/design-system.css`
- `src/styles/enhanced-design.css`

**Risque :** Incohérences possibles entre les fichiers.

**Recommandation :** Consolider en une seule source de vérité.

---

### 3.2 Accessibilité (A11Y)

#### Conformité WCAG 2.1 AA — VERY GOOD

| Critère | Statut | Détails |
|---------|--------|---------|
| **Textes alternatifs** | PASS | 144 attributs alt, aucune image sans alt détectée |
| **Labels ARIA** | PASS | Implémentation exhaustive sur tous les composants interactifs |
| **Navigation clavier** | PASS | Composants Radix UI avec support natif |
| **Gestion du focus** | PASS | `FocusManager.tsx`, indicateurs visuels personnalisés (`outline: 2px solid #9333ea`) |
| **Contraste couleurs** | PASS | Tests E2E avec axe-core (WCAG AA), ratio 4.5:1+ |
| **Lecteurs d'écran** | PASS | `ScreenReaderOnly.tsx`, HTML sémantique, rôles ARIA |
| **Skip links** | PASS | `SkipToContent.tsx` — "Aller au contenu principal" |
| **HTML sémantique** | PASS | 290 éléments sémantiques (nav, main, section, article) |
| **Mouvement réduit** | PASS | Support `prefers-reduced-motion` dans Tailwind |
| **Mode contraste élevé** | PASS | Supporté |

**Tests automatisés :** Tests E2E avec `axe-core` vérifiant la conformité WCAG 2.1 AA (`tests/e2e/system-health.spec.ts`).

---

### 3.3 SEO

#### 3.3.1 Meta Tags — EXCELLENT

- **151 pages** utilisent le hook `usePageSEO` pour des meta tags dynamiques
- `index.html` : title, description, keywords, author, viewport, theme-color

#### 3.3.2 Open Graph — PARTIAL

```html
<meta property="og:image" content="/og-image.jpg" />
```

**Problème :** Le fichier est `/og-image.svg` (pas `.jpg`). Même problème pour Twitter Card.

**Impact :** Les images de partage social seront potentiellement cassées.

#### 3.3.3 Robots.txt — GOOD

Configuration bien structurée :
- Pages privées bloquées (`/app/`, `/dashboard/`, `/admin/`, `/b2b/admin/`, `/dev/`, `/api/`)
- GPTBot bloqué
- Crawl-delay défini
- Sitemap référencé

#### 3.3.4 Sitemap — GOOD

26 URLs listées avec priorités et fréquences de modification. Date de dernière modification à rafraîchir.

#### 3.3.5 URLs canoniques — ABSENT

Aucune balise `<link rel="canonical">` détectée dans le HTML de base.

**Recommandation :** Ajouter des URLs canoniques dynamiques via `usePageSEO`.

#### 3.3.6 Données structurées — ABSENT

Aucun balisage Schema.org/JSON-LD détecté.

**Recommandation :** Ajouter des données structurées pour améliorer la visibilité dans les moteurs de recherche.

---

### 3.4 Contenu

#### 3.4.1 Contenu placeholder — MEDIUM

Valeurs placeholder dans les services backend (non visible par l'utilisateur) :

| Fichier | Problème |
|---------|----------|
| `src/services/emotionAnalysis.service.ts` | `Math.random()` pour stability_score |
| `src/services/analyticsService.ts` | `predictionAccuracy: 87` codé en dur |
| `src/services/breathApi.ts` | `Math.random()` pour hrv_stress_idx |
| `src/modules/ambition-arcade/components/Leaderboard.tsx` | `Math.random()` pour streaks |
| `src/modules/discovery/hooks/useDiscovery.ts` | `Math.max(streak, 7)` placeholder |

**Impact :** Données artificielles présentées comme réelles à l'utilisateur.

#### 3.4.2 Mélange de langues — OK

Le contenu est correctement séparé par le système i18n. Les textes sont principalement en français avec support anglais complet.

---

### 3.5 Conformité légale / RGPD

#### 3.5.1 RGPD — EXCELLENT

| Droit | Implémentation | Fichier |
|-------|---------------|---------|
| **Droit d'accès** | Export de données (JSON) | `src/modules/privacy/privacyService.ts` |
| **Droit de rectification** | Modification profil | Formulaires utilisateur |
| **Droit à l'effacement** | Suppression avec délai 30 jours | `requestAccountDeletion()` |
| **Droit à la portabilité** | Export JSON/CSV | `requestDataExport()` |
| **Droit d'opposition** | Opt-out analytiques | `getPrivacyPreferences()` |
| **Consentement** | Opt-in explicite par catégorie | `src/lib/consent.ts` |
| **Audit trail** | Historique des consentements | Table `privacy_consents` |
| **DPO** | Contact documenté | support@emotionscare.app |

#### 3.5.2 Politique de confidentialité — EXCELLENT

**Fichier :** `src/pages/legal/PrivacyPage.tsx`

Couverture complète :
1. Données collectées (identification, santé/émotionnelles, techniques)
2. Finalités du traitement
3. Protection des données de santé (TLS 1.3, AES-256, hébergement UE)
4. Droits des utilisateurs (tous les droits RGPD)
5. Cookies (essentiels et analytiques)
6. Sous-traitants (Supabase, OpenAI)
7. Durées de conservation (compte actif : illimité, post-suppression : 30 jours, logs : 12 mois)
8. Mineurs (restriction 15+, consentement parental 15-18)
9. Procédure CNIL

#### 3.5.3 Consentement cookies — VERY GOOD

**Fichier :** `src/lib/consent.ts`

- Séparation `functional` (obligatoire) / `analytics` (opt-in)
- Versioning des consentements
- Listeners de changement
- Persistance locale avec fallback

#### 3.5.4 Disclaimer médical — EXCELLENT

**Fichier :** `src/components/medical/MedicalDisclaimerDialog.tsx`

Conforme à l'article L4113-9 du Code de la Santé Publique :
- Mention explicite : "Pas un dispositif médical certifié"
- Avertissement : "Ne remplace pas un suivi médical professionnel"
- Numéro d'urgence (SAMU 15)
- Double case à cocher avant utilisation
- Obligatoire pour : scan émotionnel, évaluations, coaching IA, journal, intégrations santé

#### 3.5.5 HDS (Hébergeur de Données de Santé) — PARTIEL

- Framework technique en place (chiffrement, RLS, hébergement UE)
- **Certification HDS non obtenue** — nécessaire si manipulation de données de santé à caractère personnel
- Plan Q3 2026 pour certification

#### 3.5.6 Conservation et suppression — GOOD

| Donnée | Durée | Mécanisme |
|--------|-------|-----------|
| Compte actif | Illimité | — |
| Post-suppression | 30 jours (soft delete) | `requestAccountDeletion()` |
| Après 30 jours | Suppression définitive | Job `purge_deleted_users` |
| Logs anonymisés | 12 mois max | Purge automatique |

---

### 3.6 Internationalisation (i18n)

#### 3.6.1 Couverture des traductions

| Langue | Fichiers | Statut |
|--------|----------|--------|
| Français (fr) | 12 fichiers de traduction | COMPLET |
| Anglais (en) | 11 fichiers de traduction | COMPLET |
| Espagnol (es) | 0 fichier | DÉCLARÉ MAIS ABSENT |
| Allemand (de) | 0 fichier | DÉCLARÉ MAIS ABSENT |

**PROBLÈME CRITIQUE :** L'interface propose l'espagnol et l'allemand dans les sélecteurs de langue (`LanguageSwitcher.tsx`, `B2CSettingsPage.tsx`, `FeaturesPage.tsx`) mais **aucun fichier de traduction n'existe** pour ces langues.

**Impact :** Sélectionner espagnol ou allemand provoquera un fallback en anglais ou des clés de traduction brutes affichées.

#### 3.6.2 Attribut HTML `lang` — PROBLÈME

**Fichier :** `public/index.html:2`

```html
<html lang="fr">
```

L'attribut `lang` est codé en dur en français. Il devrait être dynamique selon la langue sélectionnée par l'utilisateur.

**Impact :**
- Les lecteurs d'écran liront tout le contenu comme du français
- Impact SEO négatif pour le contenu en anglais

#### 3.6.3 Chaînes codées en dur — LOW

Quelques chaînes codées en dur dans les pages (noms d'exemple : "Jean Dupont", "Marie Laurent"), mais ce sont des données de démonstration acceptables.

#### 3.6.4 Formatage dates/nombres — OK

Utilisation correcte de `toLocaleDateString('fr-FR')` pour les dates. Librairies `date-fns` et `dayjs` disponibles.

---

## 4. SYNTHÈSE DES CONSTATS

### Constats CRITIQUES (à corriger immédiatement)

| # | Constat | Domaine | Fichier(s) |
|---|---------|---------|------------|
| C1 | 21 vulnérabilités npm (fastify, xlsx, qs, cross-spawn) | Sécurité | `package.json` |
| C2 | Langues ES/DE déclarées dans l'UI sans fichiers de traduction | i18n | `LanguageSwitcher.tsx` |
| C3 | Token JWT dans localStorage (vulnérable XSS) | Sécurité | `src/lib/security/apiClient.ts:47` |

### Constats HIGH (à corriger rapidement)

| # | Constat | Domaine | Fichier(s) |
|---|---------|---------|------------|
| H1 | 14 usages de `dangerouslySetInnerHTML` sans sanitization vérifiée | Sécurité | Multiples composants |
| H2 | 95+ fichiers avec `@ts-nocheck` (dont fichiers de sécurité) | Qualité | `apiClient.ts`, `cors.ts`, etc. |
| H3 | 200+ dépendances circulaires | Architecture | `.dependency-cruiser-known-violations.json` |
| H4 | Chiffrement client avec clé déterministe | Sécurité | `src/lib/secureStorage.ts` |
| H5 | 488 console.log en production | Qualité | 151 fichiers |

### Constats MEDIUM (à planifier)

| # | Constat | Domaine | Fichier(s) |
|---|---------|---------|------------|
| M1 | CSP avec `unsafe-inline` et double définition | Sécurité | `_headers`, `headers.ts` |
| M2 | Images OG/Twitter en .jpg mais fichiers en .svg | SEO | `index.html:19,26` |
| M3 | Attribut HTML `lang` codé en dur en français | i18n/A11Y | `index.html:2` |
| M4 | 99 TODO/FIXME dans le code | Qualité | 39 fichiers |
| M5 | Valeurs placeholder (Math.random()) dans les services | Contenu | 5 fichiers services |
| M6 | Pas d'URLs canoniques | SEO | — |
| M7 | Pas de données structurées Schema.org | SEO | — |
| M8 | Fragmentation CSS (4 fichiers de tokens) | UX | Multiples CSS |
| M9 | Certification HDS non obtenue | Légal | — |
| M10 | ~31 400 usages de `any` en TypeScript | Qualité | Global |

### Constats LOW (amélioration continue)

| # | Constat | Domaine |
|---|---------|---------|
| L1 | Dépendances redondantes (cypress+playwright, date-fns+dayjs) | Dépendances |
| L2 | Sitemap à rafraîchir automatiquement | SEO |
| L3 | Couverture de tests ~60% (cible 80%) | Tests |
| L4 | Pas de tests de sécurité dédiés (OWASP) | Sécurité |
| L5 | Changement de langue nécessite un rechargement | UX |

---

## 5. PLAN DE REMÉDIATION

### Phase 1 — Critique (Semaine 1)

| Action | Constat | Responsable |
|--------|---------|-------------|
| `npm audit fix` + mise à jour fastify ≥ 5.7.4 | C1 | DevOps |
| Remplacer ou supprimer `xlsx` | C1 | Backend |
| Retirer ES/DE des sélecteurs de langue OU créer les traductions | C2 | Frontend |
| Migrer token auth vers `sessionStorage` ou cookies httpOnly | C3 | Sécurité |
| Auditer et sanitizer les 14 `dangerouslySetInnerHTML` | H1 | Frontend |

### Phase 2 — High (Semaines 2-3)

| Action | Constat | Responsable |
|--------|---------|-------------|
| Supprimer `@ts-nocheck` des fichiers de sécurité | H2 | Backend |
| Hook pre-commit rejetant les nouveaux `@ts-nocheck` | H2 | DevOps |
| Règle ESLint `no-console` + suppression au build | H5 | DevOps |
| Plan de déscyclage des dépendances circulaires | H3 | Architecture |
| Documenter que secureStorage est pour données non sensibles | H4 | Documentation |

### Phase 3 — Medium (Semaines 4-6)

| Action | Constat | Responsable |
|--------|---------|-------------|
| Centraliser la CSP dans un seul fichier | M1 | Sécurité |
| Corriger les images OG/Twitter (.svg → .jpg ou mise à jour meta) | M2 | Frontend |
| Rendre `lang` dynamique selon la langue utilisateur | M3 | Frontend |
| Convertir les TODO/FIXME en issues GitHub | M4 | Équipe |
| Remplacer les valeurs placeholder par de vraies implémentations | M5 | Backend |
| Ajouter URLs canoniques et données structurées | M6, M7 | SEO |
| Consolider les fichiers CSS de design tokens | M8 | Frontend |
| Planifier la certification HDS | M9 | Direction |
| Campagne de réduction des `any` (-50%) | M10 | Équipe |

### Phase 4 — Amélioration continue

| Action | Constat | Fréquence |
|--------|---------|-----------|
| Audit npm mensuel + mise à jour dépendances | L1 | Mensuel |
| Régénération automatique du sitemap au déploiement | L2 | CI/CD |
| Augmenter la couverture de tests à 80% | L3 | Sprint |
| Ajouter suite de tests sécurité OWASP | L4 | Trimestriel |
| Implémenter changement de langue sans rechargement | L5 | Sprint |

---

## ANNEXES

### A. Checklist de conformité

| Exigence | Statut |
|----------|--------|
| RGPD — Consentement explicite | ✅ CONFORME |
| RGPD — Droit à l'effacement | ✅ CONFORME |
| RGPD — Droit à la portabilité | ✅ CONFORME |
| RGPD — Audit trail | ✅ CONFORME |
| RGPD — DPO désigné | ✅ CONFORME |
| Politique de confidentialité | ✅ CONFORME |
| CGU / CGV | ✅ CONFORME |
| Consentement cookies | ✅ CONFORME |
| Disclaimer médical (Art. L4113-9 CSP) | ✅ CONFORME |
| WCAG 2.1 AA | ✅ CONFORME |
| Robots.txt | ✅ CONFORME |
| Sitemap XML | ✅ CONFORME |
| Meta tags SEO | ✅ CONFORME |
| Open Graph / Twitter Cards | ⚠️ PARTIEL (format images) |
| URLs canoniques | ❌ ABSENT |
| Schema.org / JSON-LD | ❌ ABSENT |
| Support ES/DE | ❌ ABSENT (déclaré mais non implémenté) |
| HDS Certification | ⚠️ EN COURS |
| Tests sécurité OWASP | ❌ ABSENT |

### B. Stack technique complète

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript 5.4 (strict), Vite 5, TailwindCSS 3, shadcn/ui, Zustand, TanStack Query, Framer Motion, Three.js, React Three Fiber |
| **Backend** | Supabase (PostgreSQL 15, Edge Functions Deno, Auth, Storage, Realtime) |
| **IA** | OpenAI GPT-4, Whisper, Vision, Hume AI, Suno AI, ElevenLabs, Perplexity, Firecrawl, Google Gemini, Transformers.js |
| **Paiement** | Stripe, Shopify |
| **Communication** | Resend, Firebase Cloud Messaging |
| **Monitoring** | Sentry, Vercel Analytics |
| **CI/CD** | GitHub Actions (6 workflows), Vercel (déploiement) |
| **Tests** | Vitest, Playwright, axe-core, K6 |

---

*Fin du rapport d'audit — EmotionsCare — 14 février 2026*
