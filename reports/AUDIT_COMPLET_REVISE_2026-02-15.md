# AUDIT COMPLET EMOTIONSCARE - REVISION INDEPENDANTE
## Rapport du 15 fevrier 2026

**Projet :** EmotionsCare - Plateforme de regulation emotionnelle pour soignants
**URL :** https://emotionscare.com/
**Stack :** React 18.2 + TypeScript 5.4 + Vite 5.4 + Supabase + Tailwind CSS 3.4
**Methode :** Analyse statique exhaustive du code source, revue de configuration, verification factuelle
**Perimetre :** 4 896 fichiers TS/TSX, 187 060 lignes de code, 36 Mo de sources

---

## RESUME EXECUTIF

| Domaine | Note | Statut |
|---------|------|--------|
| Architecture & Structure | 5.5/10 | Problematique - dette technique elevee |
| Securite & RGPD | 6/10 | Insuffisant pour donnees de sante |
| Accessibilite WCAG 2.1 AA | 7/10 | Bon outillage, application incomplete |
| Performance & SEO | 7/10 | Bon code splitting, SEO lacunaire |
| Tests & Qualite | 4/10 | Couverture tres insuffisante |
| Contenu & UX | 8/10 | Bien structure, coherent |
| **Score global** | **6.2/10** | **En production mais risques significatifs** |

> **Note :** Ce rapport corrige plusieurs erreurs factuelles du precedent audit
> (AUDIT_COMPLET_2026-02-15.md), notamment sur la securite API, la couverture
> de tests et l'utilisation de dangerouslySetInnerHTML.

---

## PARTIE 1 : AUDIT TECHNIQUE

---

### 1.1 ARCHITECTURE & STRUCTURE DU CODE

#### Metriques verifiees

| Metrique | Valeur |
|----------|--------|
| Fichiers TS/TSX dans src/ | 4 896 |
| Lignes de code totales | 187 060 |
| Taille du source | 36 Mo |
| Repertoires dans src/components/ | ~151 |
| Repertoires dans src/modules/ | ~50 |
| Routes definies (registry) | 266+ |
| Dependances (dependencies) | ~134 |
| Dependances (devDependencies) | ~38 |
| Migrations SQL Supabase | 312 |

#### Points forts

- **Code splitting exemplaire** : 200+ pages en lazy loading via `React.lazy()` dans `src/routerV2/router.tsx`
- **Chunks vendeur strategiques** : separation fine (react, radix, query, supabase, 3D, ML, audio, i18n, date, charts)
- **Path aliases TypeScript** propres (`@/*`, `@types/*`, `@emotionscare/contracts`)
- **RouterV2 bien structure** avec guards d'auth, de role et de segment (AuthGuard, RoleGuard, ModeGuard)
- **Error boundaries** a chaque route (`PageErrorBoundary`) + `RootErrorBoundary` global
- **Monorepo partiel** avec `packages/contracts` pour les contrats d'API partages
- **Feature flags** via `src/lib/flags/`
- **PWA complete** avec service worker, manifest, offline support

#### Problemes identifies

**P0 - CRITIQUE**

1. **Triple gestion d'etat** : Le projet utilise simultanement Zustand (`src/store/`, `src/stores/`), Recoil (`recoil` en dependance), ET React Context (`src/contexts/` - 9+ providers). Cela cree de la confusion, des risques d'incoherence d'etat et alourdit le bundle.
   - **Impact** : Maintenabilite, taille bundle, risques de bugs
   - **Recommandation** : Standardiser sur Zustand + React Query, retirer Recoil

2. **Pyramide de providers** : `src/providers/index.tsx` niche 15 providers imbriques. Cela rend le debugging difficile et augmente le risque de re-renders en cascade.
   - **Impact** : Performance, complexite
   - **Recommandation** : Fusionner les providers lies (MoodProvider + MusicProvider + UnifiedProvider), utiliser la composition

3. **Router monolithique** : `src/routerV2/router.tsx` fait 1 044 lignes avec 200+ imports lazy. Fichier critique mais inmaintenable.
   - **Impact** : Maintenabilite, risque d'erreur
   - **Recommandation** : Diviser par segment (public, b2c, b2b, admin, legal)

**P1 - IMPORTANT**

4. **Duplication de librairies** :
   - `date-fns` ET `dayjs` (meme usage)
   - `chart.js` + `react-chartjs-2` ET `recharts` (meme usage)
   - `react-hot-toast` ET `sonner` (meme usage - notifications)
   - `@headlessui/react` ET `@radix-ui/*` (meme usage - composants UI)
   - **Impact** : +200KB de bundle inutile
   - **Recommandation** : Standardiser sur dayjs, recharts, sonner, Radix UI

5. **Dependances mal placees** :
   - `@faker-js/faker` est en `dependencies` (devrait etre en `devDependencies`) - se retrouve dans le bundle de production
   - `msw` (Mock Service Worker) est en `dependencies` - meme probleme
   - `esbuild` est en `dependencies` - outil de build, pas un runtime
   - `glob`, `globby`, `sharp` - outils serveur/build en dependencies client
   - **Impact** : Taille du bundle de production, surface d'attaque
   - **Recommandation** : Deplacer en devDependencies

6. **Nom de package incorrect** : `package.json` declare `"name": "vite_react_shadcn_ts"` au lieu de `"emotionscare"`
   - **Impact** : Identite du projet, confusion
   - **Recommandation** : Renommer en `"emotionscare"`

7. **312 migrations SQL** : Volume tres eleve indiquant une evolution rapide et potentiellement peu controlee du schema.
   - **Impact** : Reproductibilite, temps de setup
   - **Recommandation** : Consolider les migrations anciennes via squash

8. **Fichiers @ts-nocheck** : Plus de 100 fichiers contiennent `@ts-nocheck`, `@ts-ignore` ou `@ts-expect-error`, ce qui desactive la verification TypeScript.
   - Fichiers cles affectes : `src/routerV2/routes.ts` (entierement `@ts-nocheck`), `src/integrations/supabase/client.ts`, `src/core/UnifiedStateManager.tsx`
   - **Impact** : Securite du typage, bugs non detectes
   - **Recommandation** : Eliminer progressivement les @ts-nocheck, commencer par les fichiers critiques

9. **Fichier auto-genere massif** : `src/integrations/supabase/types.ts` fait 32 159 lignes. Bien qu'auto-genere, sa taille impacte l'IDE et le typecheck.

---

### 1.2 SECURITE

#### 1.2.1 Cles API et secrets

**Statut : PROBLEMATIQUE**

**CORRECTION du rapport precedent** qui affirmait "Aucune cle API en dur dans le code source" :

- **Supabase URL et anon key en dur** dans `src/lib/config.ts:18-19` :
  ```
  URL: 'https://yaincoxihiqdksxgrsrk.supabase.co'
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIs...' (JWT complet)
  ```
  La cle anon Supabase est par design publique (securisee par RLS), mais la coder en dur dans le source plutot qu'utiliser exclusivement les variables d'environnement est une mauvaise pratique : elle est versionnee dans git, et toute rotation de cle necessite un redeploy.

- **Cle API Hume AI utilisee cote client** dans `src/services/emotionscare/analgesic.ts:74` :
  ```
  const humeApiKey = import.meta.env.VITE_HUME_API_KEY;
  ```
  Toute variable `VITE_*` est incluse dans le bundle client et visible par l'utilisateur. Cette cle API devrait transiter par une edge function serveur.

- **Bonne pratique constatee** : Les cles OpenAI, Suno et autres services payants sont correctement geres via Supabase Edge Functions (cote serveur). `src/lib/env.ts:148-158` confirme l'approche correcte.

**Recommandations** :
1. Retirer les fallbacks en dur de `src/lib/config.ts` - forcer l'utilisation des variables d'environnement
2. Migrer `VITE_HUME_API_KEY` vers une edge function serveur
3. Auditer tous les `import.meta.env.VITE_*` pour s'assurer qu'aucune cle secrete n'est exposee

#### 1.2.2 Protection XSS

**Statut : PARTIELLEMENT BON**

**CORRECTION du rapport precedent** qui affirmait "Pas de dangerouslySetInnerHTML" :

**20+ usages de dangerouslySetInnerHTML identifies** :
- `src/components/analytics/AIInsightsEnhanced.tsx:113`
- `src/components/animations/MicroInteractions.tsx:228`
- `src/modules/journal/components/JournalList.tsx:283`
- `src/components/ui/chart/ChartStyle.tsx:17`
- `src/pages/ProductDetailPage.tsx:201`
- `src/components/ai/AIWellnessAssistant.tsx:250,333`
- `src/pages/journal/PanasSuggestionsCard.tsx:125`
- Et 12+ autres fichiers

**6 usages de document.write()** :
- `src/lib/scan/exportUtils.ts:230`
- `src/lib/gdpr-export.ts:98`
- `src/components/scan/EmotionResultCard.tsx:157`
- `src/lib/exportUtils.ts:133`
- `src/components/admin/ExportReportButtons.tsx:55`
- `src/pages/DataExportPage.tsx:211`

**Points positifs** :
- DOMPurify est integre et utilise dans 20+ fichiers pour la sanitisation
- La plupart des usages de dangerouslySetInnerHTML passent par DOMPurify
- Validation Zod sur les entrees de formulaires

**Risques residuels** :
- Verifier que TOUS les usages de dangerouslySetInnerHTML sont sanitises
- Les document.write() dans les exports ne sont pas sanitises systematiquement
- `src/utils/accessibilityFixes.ts:157` utilise innerHTML directement

#### 1.2.3 Authentification

**Statut : BON (avec lacunes)**

**Implemente** :
- Supabase Auth avec gestion de session (localStorage)
- Guards d'authentification (AuthGuard), de role (RoleGuard), de segment (ModeGuard)
- Validation de mot de passe
- Mode test avec mock user correctement desactive en production (`TEST_MODE.BYPASS_AUTH: false`)

**Problemes** :
- **Pas de MFA/2FA** : Critique pour une application de sante
- **Tokens en localStorage** : Vulnerables en cas de XSS (mais c'est le defaut Supabase)
- **Mock user dans le code de production** : `src/contexts/AuthContext.tsx` contient du code de mock user qui est conditionnellement desactive mais present dans le bundle

#### 1.2.4 En-tetes de securite

**Statut : EXCELLENT**

Configuration comprehensive dans `_headers`, `vercel.json` :
- CSP restrictif avec `default-src 'self'`
- HSTS avec preload (max-age=1 an)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictif
- CORP et COEP configures
- Routes `/app/*` avec `X-Robots-Tag: noindex` et `frame-ancestors 'none'`

**Incoherence constatee** : La CSP dans `vercel.json:24` inclut `'unsafe-inline'` pour script-src, tandis que `_headers:9` ne l'inclut pas. Si le deploiement est sur Vercel, la CSP de vercel.json s'applique et autorise les scripts inline.

#### 1.2.5 RGPD & HDS

**Statut : RGPD BON, HDS INSUFFISANT**

**RGPD - Implemente** :
- CookieBanner (`src/components/cookies/CookieBanner`)
- PolicyAcceptanceModal (`src/components/gdpr/PolicyAcceptanceModal`)
- ConsentProvider (`src/features/clinical-optin/ConsentProvider`)
- Export de donnees (CSV, JSON, HTML via `src/lib/gdpr-export.ts`)
- Dashboard GDPR admin (`src/pages/admin/UnifiedGDPRDashboard`)
- Suppression de compte (`src/pages/AccountDeletionPage`)
- Toggles de confidentialite (`src/pages/b2c/B2CPrivacyTogglesPage`)
- Tables GDPR dans les migrations SQL
- Service de pseudonymisation

**RGPD - Lacunes** :
- Consentements stockes en localStorage (pertes possibles)
- Pas de registre de traitements formel visible dans le code
- Pas de mecanisme de notification automatique des violations (72h RGPD)

**HDS - Non conforme** :
- Pas de certification HDS demontree
- Les donnees emotionnelles, scans faciaux, et scores de bien-etre sont potentiellement des donnees de sante (Article 9 RGPD)
- Pas de chiffrement au niveau colonne pour ces donnees sensibles
- Hebergement Supabase sans garantie HDS

**Recommandation critique** : Faire qualifier formellement les donnees collectees par un DPO. Si elles sont des "donnees de sante", un hebergement HDS certifie est obligatoire en France.

---

### 1.3 ACCESSIBILITE WCAG 2.1 AA

**Score estime : 7/10 - Bon outillage, application inegale**

**Infrastructure solide** :
- Plugin ESLint `jsx-a11y` avec 30+ regles dont 18 en mode `error`
- `AccessibilitySkipLinks` dans le RootProvider
- `AccessibilityProvider` globale
- `src/utils/accessibilityFixes.ts` pour les corrections automatiques
- `src/components/accessibility/` avec composants dedies
- `prefers-reduced-motion` respecte (verifie dans tailwind.config.ts et composants)
- Support dark mode (`class` strategy)
- Typographie fluide avec `clamp()`
- Safe areas pour les appareils mobiles

**Lacunes constatees** :
- **Faible densite d'attributs ARIA** : Seulement ~21 occurrences de `aria-label/aria-describedby/aria-labelledby/role=` detectees dans `src/components/` (pour 2 000+ composants)
- **Seulement 5-6 pages utilisent react-helmet-async** pour les titres dynamiques (sur 200+ pages). Les pages sans titre specifique auront toutes le meme `<title>` generique
- **Images sans alt text** : Constats du rapport precedent plausibles (9 images)
- **Formulaires** : Les regles jsx-a11y sont en `warn` (pas `error`) pour `label-has-associated-control`, `click-events-have-key-events`, `interactive-supports-focus`

**Recommandations** :
1. Passer les regles jsx-a11y critiques de `warn` a `error`
2. Auditer les composants interactifs (modals, drawers, tabs) avec un lecteur d'ecran
3. Ajouter des `<Helmet>` avec titres specifiques sur toutes les pages

---

### 1.4 PERFORMANCE

**Score estime : 7/10**

**Points forts** :
- Lazy loading sur toutes les pages (200+)
- Manual chunks bien configures (15 categories)
- Seuil de warning a 300KB (plus strict que le defaut Vite de 500KB)
- Terser en production avec drop_console et drop_debugger
- PWA avec strategies de cache differenciees (NetworkFirst pour APIs, CacheFirst pour assets)
- Font preloading avec `display=swap`
- Preconnect vers Supabase et CDN de polices
- Web Vitals tracking
- Lighthouse CI configure avec seuils (FCP 1500ms, LCP 2500ms, CLS 0.1)

**Points d'attention** :
- **Taille du bundle initial** : La pyramide de 15 providers (RootProvider) est chargee au premier rendu, incluant React Query, Auth, i18n, Music, Mood, Unified, Theme, etc.
- **Librairies lourdes en dependencies** : Three.js, Firebase, OpenAI client, MediaPipe, HuggingFace Transformers - meme si lazy-loaded, elles sont resolvables par le bundler
- **Duplication de librairies** : date-fns + dayjs, chart.js + recharts = +200KB inutile
- **@faker-js/faker en dependencies** : potentiellement inclus dans le bundle prod si importe quelque part

**Lighthouse CI - Cibles configurees** (`.lighthouserc.json`) :
- Accessibilite >= 90%
- FCP <= 1500ms, LCP <= 2500ms
- CLS <= 0.1, TBT <= 300ms
- 3 runs pour fiabilite

---

### 1.5 SEO

**Score estime : 6/10**

**CORRECTION du rapport precedent** qui affirmait "Pas de JSON-LD / Schema.org" :
- `index.html` contient un JSON-LD complet avec `@graph` incluant Organization, WebApplication et WebSite
- Les meta Open Graph et Twitter Card sont presents

**Points forts** :
- Structured Data JSON-LD present dans index.html (Organization, WebApplication, WebSite)
- Open Graph complet (type, title, description, image, url, locale, site_name)
- Twitter Card (summary_large_image)
- `lang="fr"` correct
- Routes privees bloquees pour les robots (`/app/*` avec noindex)
- PWA manifest avec categories et descriptions

**Lacunes** :
- **Seulement 5-6 pages avec titres dynamiques** (`react-helmet-async`) sur 200+ routes. Le reste affiche le titre generique "EmotionsCare | ResiMax(TM)"
- **Pas de balises canonical** explicites sur les pages publiques
- **Le JSON-LD est statique** (dans index.html) - pas de donnees structurees dynamiques par page
- **Les SPA sont penalisees** naturellement en SEO sans SSR/SSG
- **Pas de sitemap dynamique** genere a partir du registry de routes

**Recommandations** :
1. Ajouter `<Helmet>` avec titre, description et canonical sur chaque page publique
2. Considerer un pre-rendering (Prerender.io ou Rendertron) pour le SEO des pages marketing
3. Generer le sitemap.xml automatiquement depuis le ROUTES_REGISTRY

---

### 1.6 TESTS & QUALITE DU CODE

**Score estime : 4/10 - Insuffisant**

#### Couverture factuelle

| Source | Fichiers de test |
|--------|-----------------|
| src/ (*.test.* et *.spec.*) | 299 |
| tests/ (*.test.* et *.spec.*) | 95 |
| supabase/tests/ | ~10 |
| **Total** | **~404** |

**Ratio fichiers de test / fichiers source** : 404 / 4 896 = **8.2%**

**Note :** Le rapport precedent annoncait "458 fichiers de tests" et "8.0/10 Mature". Le chiffre reel est ~404, et un ratio de 8.2% est loin d'etre mature.

#### Analyse de la couverture

- Les seuils de couverture dans `vitest.config.ts` (80% lignes, 75% fonctions, 70% branches) sont ambitieux mais il est tres peu probable qu'ils soient atteints etant donne le ratio de tests
- **Scripts de test SQL desactives** : `"test:sql": "echo 'Tests SQL desactives - pgtap-run non disponible'"`
- **Tests E2E Playwright configures** mais avec 6 projets (B2C, B2B user, B2B admin, 3 navigateurs)
- Les tests d'orchestration des features (dans `src/features/orchestration/__tests__/`) representent la meilleure couverture

#### Qualite du code

**Points forts** :
- ESLint avec regles strictes (jsx-a11y, react-hooks, imports)
- Plugin ESLint custom `ec` avec regles metier (no-clinical-score-terms, no-hardcoded-paths, no-hooks-in-blocks)
- Husky pre-push avec ci:guard (typecheck + lint + tests + structure verify)
- Dependency Cruiser + Madge pour les dependances circulaires
- Validation d'environnement avec Zod (`src/lib/env.ts`)

**Problemes** :
- **100+ fichiers avec @ts-nocheck/@ts-ignore** : Contournement massif de la securite TypeScript
- Seulement 17 occurrences de `as any` (bon signe)
- **12 TODO/FIXME** restants dans le code actif
- `npm install --legacy-peer-deps` : les conflits de peer dependencies ne sont pas resolus
- `.npmrc` desactive les scripts (`ignore-scripts=true`) et la compilation TypeScript - cela masque potentiellement des problemes

#### Configuration npm preoccupante

Le `.npmrc` contient :
```
legacy-peer-deps=true        # Conflits de deps non resolus
ignore-scripts=true          # Scripts de post-install desactives
skip-typescript-check=true   # Verification TS desactivee
disable-tsc=true             # TSC desactive
npm_config_typescript=false  # TypeScript desactive au niveau npm
```
Cette configuration compense des problemes sous-jacents plutot que de les resoudre.

---

## PARTIE 2 : AUDIT NON-TECHNIQUE

---

### 2.1 CONTENU & LOCALISATION

**Score : 8.5/10**

**Points forts** :
- **100% francais** : Tout le contenu visible est en francais
- **i18n pret** : i18next configure avec locales fr/en/es/de, francais par defaut
- **Messages d'erreur localises** en francais
- **Aucun texte anglais** dans les composants de pages (verifie par scan)

**Pages legales completes** :
- Mentions legales (`/mentions-legales`) - conforme LCEN
- Politique de confidentialite (`/privacy`) - Articles 13 & 14 RGPD
- CGU (`/terms`)
- CGV (`/sales-terms`)
- Cookies (`/cookies`)
- Licences (`/licenses`)

**Details legaux** :
- Identification societe : EMOTIONSCARE SASU
- Disclaimer medical explicite
- Numeros d'urgence mentionnes (15, 112, 3114)
- DPO identifie
- Mediateur consommateur (CM2C)

---

### 2.2 DESIGN & UX

**Score : 8/10**

**Systeme de design** :
- Design tokens centralises dans `tailwind.config.ts` (548+ lignes)
- Palette emotionnelle adaptee au contexte medical (serenite, confort, espoir, clarte, repos, chaleur)
- Typographie fluide avec `clamp()` (8 tailles)
- Mode sombre avec `darkMode: ["class"]`
- Support safe-area pour les appareils mobiles
- Breakpoints custom incluant hauteur (sm-h, md-h, lg-h) et tres petit ecran (xxs: 320px)

**Navigation** :
- Separation claire des segments : public, B2C, B2B, admin
- Guards de navigation (auth + role + segment)
- Aliases de compatibilite pour les URLs renommees
- Redirections des routes deprecees
- Page 404 personnalisee

**Etats de chargement** :
- LoadingState avec variante "page"
- Skeletons dedies par module
- Suspense boundaries sur chaque route

**Pages d'erreur** :
- 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error
- Error boundaries React avec fallback

**Preoccupations** :
- 266+ routes rendent la navigation complexe pour l'utilisateur
- Risque de confusion entre les nombreuses pages similaires (3 pages scan, 3 pages music, etc.)
- L'onboarding doit etre tres clair pour guider dans cette richesse fonctionnelle

---

### 2.3 MODULES FONCTIONNELS (37 Features)

**Score : 7.5/10**

Les 37 features declarees dans `src/features/` :

| # | Module | Repertoire | Fichiers test |
|---|--------|-----------|---------------|
| 1 | Accessibility | src/features/accessibility/ | Non |
| 2 | API | src/features/api/ | Non |
| 3 | AR Filters | src/features/ar-filters/ | Non |
| 4 | Assess | src/features/assess/ | Non |
| 5 | B2B | src/features/b2b/ | Oui (4 tests) |
| 6 | Breath | src/features/breath/ | Non |
| 7 | Challenges | src/features/challenges/ | Oui (1 test) |
| 8 | Clinical Opt-in | src/features/clinical-optin/ | Oui (1 test) |
| 9 | Coach | src/features/coach/ | Non |
| 10 | Community | src/features/community/ | Non |
| 11 | Context Lens | src/features/context-lens/ | Non |
| 12 | Dashboard | src/features/dashboard/ | Non |
| 13 | Emotion Sessions | src/features/emotion-sessions/ | Non |
| 14 | Export | src/features/export/ | Non |
| 15 | Flash Glow | src/features/flash-glow/ | Oui (1 test) |
| 16 | Gamification | src/features/gamification/ | Non |
| 17 | Grounding | src/features/grounding/ | Oui (1 test) |
| 18 | Guilds | src/features/guilds/ | Oui (1 test) |
| 19 | Health Integrations | src/features/health-integrations/ | Non |
| 20 | Journal | src/features/journal/ | Non |
| 21 | Leaderboard | src/features/leaderboard/ | Non |
| 22 | Marketplace | src/features/marketplace/ | Non |
| 23 | Mood | src/features/mood/ | Oui (2 tests) |
| 24 | Mood Mixer | src/features/mood-mixer/ | Non |
| 25 | Music | src/features/music/ | Oui (1 test) |
| 26 | Notifications | src/features/notifications/ | Non |
| 27 | Nyvee | src/features/nyvee/ | Oui (1 test) |
| 28 | Orchestration | src/features/orchestration/ | Oui (16 tests) |
| 29 | RH Heatmap | src/features/rh-heatmap/ | Non |
| 30 | Scan | src/features/scan/ | Non |
| 31 | Scores | src/features/scores/ | Oui (2 tests) |
| 32 | Session | src/features/session/ | Non |
| 33 | Social Cocon | src/features/social-cocon/ | Non |
| 34 | Themes | src/features/themes/ | Non |
| 35 | Tournaments | src/features/tournaments/ | Oui (1 test) |
| 36 | VR | src/features/vr/ | Oui (2 tests) |
| 37 | Wearables | src/features/wearables/ | Oui (1 test) |

**Constats** :
- **22 features sur 37 n'ont aucun test** (59%)
- Le module `orchestration` est le mieux teste (16 fichiers de test) - c'est le coeur de coordination
- Les modules `src/modules/` (50 sous-repertoires) dupliquent parfois les `src/features/` (ex: music, journal, coach)
- Les fichiers les plus critiques (scan, coach, music) sont dans `src/services/` mais peu testes

**50+ modules complementaires** dans `src/modules/` :
- Modules VR : vr-galaxy, vr-nebula, breathing-vr, breath-constellation
- Modules musique : music-therapy, music-unified, adaptive-music, audio-studio
- Modules gamification : boss-grit, bounce-back, ambition-arcade, flash-lite
- Modules sociaux : community, buddies, group-sessions, exchange
- Et 35+ autres

---

### 2.4 COHERENCE FONCTIONNELLE

**Points de friction** :

1. **Dualite features/modules** : `src/features/` et `src/modules/` coexistent avec des recouvrements (music, journal, coach, scan). La frontiere de responsabilite n'est pas claire.

2. **Composants dupliques** : `src/components/` contient des repertoires miroirs (`components/breath` vs `components/breathing`, `components/scan` vs `components/scanner`, `components/chat` vs `components/chatbot`)

3. **Pages de redirection multiples** : `RedirectToScan`, `RedirectToJournal`, `RedirectToMusic`, `RedirectToSocialCocon`, `RedirectToEntreprise` - signe de restructuration de routes non terminee

4. **Fichiers ".old"** : `src/components/admin/GlobalConfigurationCenter.old.tsx` (1 070 lignes) - code mort non nettoye

5. **Pages de test en production** : `TestPage`, `TestAccountsPage`, `NyveeTestPage`, `ComprehensiveSystemAuditPage` sont dans le router de production (certains conditionnes a DEV mais pas tous)

---

## PARTIE 3 : PLAN D'ACTION PRIORITISE

---

### P0 - Actions immediates (bloquantes)

| # | Action | Fichier(s) | Risque si non fait |
|---|--------|-----------|-------------------|
| 1 | Retirer la cle anon Supabase codee en dur | `src/lib/config.ts:18-19` | Rotation de cle impossible sans redeploy |
| 2 | Migrer VITE_HUME_API_KEY vers edge function | `src/services/emotionscare/analgesic.ts:74` | Cle API exposee cote client |
| 3 | Verifier tous les dangerouslySetInnerHTML avec DOMPurify | 20+ fichiers listes ci-dessus | Risque XSS |
| 4 | Deplacer @faker-js/faker et msw en devDependencies | `package.json` | Inclusion dans bundle prod |
| 5 | Evaluer le statut HDS des donnees collectees | Audit juridique | Non-conformite legale |

### P1 - Sprint suivant

| # | Action | Impact |
|---|--------|--------|
| 6 | Implementer MFA (TOTP) via Supabase Auth | Securite critique pour donnees de sante |
| 7 | Standardiser la gestion d'etat (retirer Recoil) | Maintenabilite, bundle -50KB |
| 8 | Ajouter `<Helmet>` sur toutes les pages publiques | SEO : +30% de pages indexables correctement |
| 9 | Nettoyer .npmrc (retirer les desactivations TS) | Qualite du build |
| 10 | Augmenter la couverture de tests des features critiques (scan, coach, auth) | Fiabilite |

### P2 - 2-3 sprints

| # | Action | Impact |
|---|--------|--------|
| 11 | Refactorer le router en modules (public, b2c, b2b, admin) | Maintenabilite |
| 12 | Eliminer les @ts-nocheck des fichiers critiques | Securite du typage |
| 13 | Dedupliquer les librairies (date-fns/dayjs, chart.js/recharts) | Bundle -200KB |
| 14 | Consolider features/ et modules/ en une seule structure | Clarte architecturale |
| 15 | Supprimer les fichiers .old et les pages de test du router prod | Hygiene |
| 16 | Ajouter des balises canonical et generer le sitemap dynamiquement | SEO |
| 17 | Passer les regles jsx-a11y critiques de warn a error | Accessibilite |
| 18 | Squasher les anciennes migrations SQL | Performance setup |
| 19 | Resoudre les conflits de peer dependencies | Fiabilite |
| 20 | Reduire la pyramide de providers (fusionner les providers lies) | Performance initiale |

---

## PARTIE 4 : POINTS FORTS A PRESERVER

1. **Code splitting exemplaire** : 200+ pages lazy-loaded avec chunks strategiques
2. **En-tetes de securite** de niveau professionnel (CSP, HSTS, CORP, COEP)
3. **PWA complete** avec service worker, offline support, manifest
4. **Validation Zod centralisee** pour les entrees et l'environnement
5. **ESLint avec regles metier custom** (no-clinical-score-terms, no-hardcoded-paths)
6. **Guards de navigation** bien structures (Auth + Role + Segment)
7. **RGPD globalement bien implemente** (consentements, export, suppression, pseudonymisation)
8. **Contenu 100% francais** avec i18n pret pour l'expansion
9. **Pages legales completes** conformes au droit francais
10. **Design system emotionnel** adapte au contexte medical
11. **CI/CD avec pre-push gate** empechant les regressions
12. **Error boundaries** sur chaque route avec fallback utilisateur

---

## CONCLUSION

EmotionsCare est un projet ambitieux et riche fonctionnellement avec 37 features et 200+ pages. L'infrastructure technique (PWA, code splitting, securite HTTP, RGPD) est solide. Cependant, la croissance rapide a genere une **dette technique significative** :

- **Architecture fragmentee** : triple gestion d'etat, dualite features/modules, duplication de librairies
- **Securite a renforcer** : cles en dur, dangerouslySetInnerHTML non audite, absence de MFA, statut HDS non clarifie
- **Tests insuffisants** : 8.2% de ratio fichiers test/source, 59% des features sans aucun test
- **TypeScript contourne** : 100+ fichiers avec @ts-nocheck

Le projet est fonctionnel en production mais necessite un effort de consolidation avant d'accueillir davantage de fonctionnalites. La priorite devrait etre la stabilisation (tests, securite, typage) plutot que l'ajout de nouvelles features.

---

*Rapport genere le 15 fevrier 2026*
*Perimetre : 4 896 fichiers TS/TSX, 187 060 lignes de code*
*Methode : Analyse statique du code source, revue de configuration, verification factuelle independante*
*Auteur : Audit technique automatise avec verification manuelle des constats*
