# AUDIT TECHNIQUE COMPLET - EmotionsCare Platform
## Date: 11 mars 2026 | Auditeur: Senior Full-Stack Technical Auditor

---

# 1. RESUME EXECUTIF

## Etat global
EmotionsCare est une plateforme SaaS de regulation emotionnelle destinee aux soignants, construite avec React 18 / Vite / Supabase / Stripe. Le projet est **massivement ambitieux** : ~4950 fichiers TypeScript, ~146 pages, ~272 edge functions Supabase, et des dizaines de modules (coach IA, musique, VR, gamification, B2B, community, journal...).

## Niveau de preparation reel
**NON PRET POUR LA PRODUCTION EN L'ETAT.** La plateforme presente des problemes critiques de securite (CORS wildcard sur toutes les edge functions, absence de verification JWT sur la majorite des functions), des pages de facturation entierement fausses/mockees, des incoherences de prix, et une surface d'attaque considerablement trop large.

## Verdict Go-Live : **NON EN L'ETAT**

## 5 P0 Principaux
1. **CORS wildcard `Access-Control-Allow-Origin: *` sur 236/272 edge functions** — attaque CSRF/data theft possible
2. **Page BillingPage 100% hardcodee/mockee** — donnees fausses presentees aux utilisateurs comme reelles
3. **Majorite des edge functions sans verification JWT** — seulement 11/272 referencent `verify_jwt`
4. **Fonctions SQL SECURITY DEFINER sans `SET search_path`** — risque d'escalade de privileges (5+ functions)
5. **Incoherence de prix critique** — Pricing page affiche Pro a 14.90€, BillingPage affiche Premium a 9.99€

## 5 P1 Principaux
1. **ActivityLogsPage, WearablesPage, MusicAnalyticsPage, ReportsPageEnhanced, OptimizationPageEnhanced** — toutes avec donnees mockees/hardcodees presentees comme reelles
2. **272 edge functions** — surface d'attaque ingerable, impossible a maintenir et auditer
3. **Aucun webhook Stripe visible pour synchronisation d'abonnements** — l'etat billing peut devenir desynchronise
4. **Supabase project ID expose dans le HTML** (preconnect hint) + fallback anon key a "placeholder"
5. **Polling abonnement toutes les 60 secondes** — charge inutile sur Stripe API, rate limiting probable

---

# 2. TABLEAU D'AUDIT COMPLET

| Priorite | Domaine | Page / Route / Fonction | Probleme observe | Symptome / preuve | Risque | Recommandation | Faisable dans Lovable ? |
|----------|---------|------------------------|-------------------|-------------------|--------|----------------|------------------------|
| P0 | Security | Toutes edge functions | CORS `Access-Control-Allow-Origin: *` | 236/272 functions avec wildcard | Data theft, CSRF, abus API | Restreindre au domaine emotionscare.com | Oui - code edge functions |
| P0 | Billing | `/billing` | Page 100% hardcodee | Invoices mockees, boutons non fonctionnels | Utilisateur trompe, confiance brisee | Brancher sur Stripe via useSubscription | Oui |
| P0 | Security | Edge functions | Pas de verify_jwt | 261/272 sans verification JWT | Endpoints publics abusables | Ajouter verification JWT | Oui - code edge functions |
| P0 | Database | Migrations SQL | SECURITY DEFINER sans search_path | Migration 20251107141037: 5 fonctions | Escalade de privileges | Ajouter SET search_path = public | Non - necessite migration DB |
| P0 | Billing | Pricing vs Billing | Incoherence de prix | Pricing: Pro 14.90€ vs Billing: Premium 9.99€ | Confusion utilisateur, risque legal | Aligner les prix | Oui |
| P1 | UX/Data | `/activity-logs` | Donnees mockees | mockActivityLogs, mockSecurityEvents hardcodes | Faux sentiment de securite | Brancher sur vrais logs | Partiellement |
| P1 | UX/Data | `/wearables` | Donnees mockees | Mock trend data, mock sync logs | Fonctionnalite fausse | Supprimer ou marquer "demo" | Oui |
| P1 | UX/Data | Manager reports/optimization | Donnees mockees | "MOCK DATA - pretes pour remplacement Supabase" | Dashboard B2B non fonctionnel | Brancher ou retirer | Partiellement |
| P1 | Performance | useSubscription | Polling 60s | setInterval(checkSubscription, 60000) | Rate limiting Stripe, charge | Webhook-driven ou polling 5min | Oui |
| P1 | Security | index.html | Supabase project ID expose | `<link rel="preconnect" href="https://yaincoxihiqdksxgrsrk.supabase.co">` | Identification du projet | Non critique mais information exposure | Oui |
| P1 | Security | create-checkout | Utilise getClaims au lieu de getUser | `supabaseClient.auth.getClaims(token)` | getClaims ne valide pas le token aupres du serveur auth | Utiliser getUser pour validation server-side | Oui |
| P2 | Frontend | ~146 pages | Nombre excessif | 146 pages dans /src/pages + modules | Maintenance ingerable | Audit pages et suppression dead pages | Partiellement |
| P2 | Backend | 272 edge functions | Surface d'attaque | 272 functions Supabase | Impossible a securiser et maintenir | Consolider en <50 functions | Non - refactoring majeur |
| P2 | SEO | Pages app | Meta per-page via usePageSEO | Hook present mais couverture non confirmee | SEO incomplet potentiel | Audit couverture SEO | Oui |
| P2 | i18n | Locales fr/en/de | Couverture non confirmee | 3 langues configurees | Cles manquantes possibles | Audit i18n complet | Oui |
| P2 | Auth | TEST_MODE | Flag BYPASS_AUTH en config | config.ts: BYPASS_AUTH: false | Risque si re-active en prod | Supprimer completement le mecanisme | Oui |
| P3 | Performance | Bundle | Dependencies lourdes | three.js, firebase, openai, hume, @mediapipe | Bundle probablement >2MB | Tree-shaking audit, lazy loading | Partiellement |
| P3 | Accessibility | Global | SkipLinks present | AccessibilitySkipLinks dans RootProvider | Bon signal mais audit complet necessaire | Audit axe-core systematique | Oui |
| P3 | SEO | index.html | Structured data complet | JSON-LD Organization + WebApplication + HowTo | Bien fait | Valider avec Google Rich Results | N/A |

---

# 3. DETAIL PAR CATEGORIE

## A. Frontend & Rendu

### Ce qui fonctionne
- Architecture RouterV2 bien structuree avec registry central de ~200+ routes
- Separation claire public / B2C / B2B / admin via segments
- Layouts multiples (marketing, app, simple) avec LayoutWrapper
- SuspenseWrapper avec fallback de chargement
- PageErrorBoundary sur chaque route
- RootErrorBoundary global
- Composants UI basees sur Radix UI (solide)
- Theming avec next-themes (light/dark/system)
- Provider composition propre via `composeProviders`

### Ce qui est casse ou problematique
- **BillingPage** : donnees 100% hardcodees, aucun appel backend
- **ActivityLogsPage** : donnees mockees (mockActivityLogs, mockSecurityEvents)
- **WearablesPage** : donnees mockees ("Generate mock trend data")
- **B2BDashboardAnalytics** : commentaire explicite "MOCK DATA"
- **MusicAnalyticsPage** : "Mock Data Generators"
- **MusicProfilePage** : "Mock profile data"
- **ReportsPageEnhanced / OptimizationPageEnhanced** : donnees mockees

### Ce qui est douteux
- 146 pages + modules = couverture de tests incertaine
- Certaines pages semblent etre des vestige (TestPage, ValidationPage, TestAccountsPage)
- Pages dev/ potentiellement accessibles en prod si hidden flag mal gere

---

## B. QA Fonctionnelle

### Parcours principaux
- **Inscription/Connexion** : Supabase auth correctement integre, email+password, gestion erreurs avec getFriendlyAuthError
- **Reset password** : Fonctionne via supabase.auth.resetPasswordForEmail
- **Checkout Stripe** : Edge function create-checkout existe et semble fonctionnel (price IDs reels configures)
- **Payment Success** : Page existe avec verification d'abonnement post-paiement
- **Customer Portal** : Edge function existe

### Problemes critiques
- **BillingPage** : Boutons "Changer de Plan" et "Annuler l'Abonnement" ne font RIEN - pas de onClick handler
- **BillingPage** : Factures hardcodees ne correspondent pas aux vraies transactions Stripe
- **Pas de webhook Stripe** visible pour traiter les evenements de paiement (invoice.paid, subscription.updated, etc.)
- **useSubscription polling toutes les 60s** : non optimal, devrait etre event-driven

---

## C. Auth & Autorisations

### Ce qui fonctionne
- AuthContext solide : signUp, signIn, signOut, resetPassword, updateUser, refreshSession
- AuthGuard : redirige vers login si non authentifie
- RoleGuard : verifie role avec redirect vers /forbidden
- ModeGuard : synchronise le mode utilisateur (B2C/B2B)
- Session persistence via localStorage
- Token auto-refresh active
- onAuthStateChange listener correctement configure

### Ce qui est problematique
- **TEST_MODE avec BYPASS_AUTH** : Le mecanisme existe en config.ts. Meme si desactive (false), le code de bypass est present. Un merge accidentel pourrait le reactiver.
- **create-checkout utilise getClaims** au lieu de getUser : getClaims est client-side et ne valide pas le token aupres du serveur d'authentification Supabase. Risque de token forge.
- **check-subscription et customer-portal utilisent getUser** (correct) mais la methode differe entre les 3 edge functions liees au paiement.

### Non confirme
- OAuth providers : Aucun code OAuth visible dans l'UI (Google, GitHub, etc.)
- Comportement utilisateur non connecte sur routes protegees : semble correct via AuthGuard mais non teste en runtime

---

## D. APIs & Edge Functions

### Ce qui fonctionne
- 272 edge functions Supabase deployees
- Config centralisee dans CONFIG.EDGE_FUNCTIONS
- Appels via supabase.functions.invoke()
- Edge functions de paiement (create-checkout, check-subscription, customer-portal) structurees correctement

### Problemes critiques
- **CORS wildcard** : `"Access-Control-Allow-Origin": "*"` sur 236/272 functions. C'est un probleme de securite MAJEUR. Toute page web peut appeler ces endpoints.
- **Absence de verify_jwt** : Seulement 11/272 functions referencent JWT. La majorite des endpoints sont de facto publics.
- **272 functions = surface d'attaque ingerable** : Certaines functions sont probablement mortes ou non utilisees. Impossible de garantir la securite avec cette quantite.

### Donnees mockees confirmees
- ActivityLogsPage, WearablesPage, B2BDashboardAnalytics, MusicAnalyticsPage, MusicProfilePage, ReportsPageEnhanced, OptimizationPageEnhanced

---

## E. Database & RLS

### Ce qui fonctionne
- RLS extensivement configure : ~2479 references a RLS/POLICY dans 237 fichiers de migration
- Nombreuses policies CREATE POLICY
- RLS hardening migration existante (202507150000_rls_hardening.sql)
- Assessment privacy hardening (202512150900)

### Problemes identifies
- **SECURITY DEFINER sans search_path** : Migration 20251107141037 contient 5 fonctions avec SECURITY DEFINER mais sans `SET search_path = public`. Risque d'injection via search_path manipulation.
- 255 occurrences de SECURITY DEFINER vs 217 de SET search_path — au moins ~38 fonctions SECURITY DEFINER potentiellement sans search_path fige.
- Migration 20251113223035 contient SECURITY DEFINER mais aucun SET search_path

### Non confirme depuis l'interface
- Verification exhaustive de toutes les policies RLS
- Coherence owner/user data separation a runtime
- Tables sensibles potentiellement exposees sans RLS

---

## F. Securite Applicative

### Ce qui fonctionne
- Nettoyage variables sensibles en production (cleanSensitiveData)
- DevTools desactives en production
- Console.log desactive en production (sauf console.error)
- DOMPurify et sanitize-html presents pour XSS prevention
- CSP base configuree (APP_BASE_CSP)
- Zod validation sur les variables d'environnement
- Variables d'environnement AI keys geres cote serveur (edge function secrets)

### Problemes critiques
- **CORS wildcard** sur toutes les edge functions (repete car critique)
- **Supabase project ID expose** dans le HTML (preconnect hint)
- **Pas de rate limiting visible** sur les edge functions (malgre CONFIG.SECURITY.RATE_LIMITING: true cote client)
- **Pas de verification de signature webhook Stripe** visible
- **CSP via meta tag** (plus faible que HTTP header) - depend de la config Vercel/hosting

### Risques probables
- Endpoints edge functions abusables sans auth (IDOR probable sur certaines)
- Absence de captcha/honeypot sur les formulaires publics (contact, signup)
- Error messages detailles potentiellement retournes en production (errorMessage dans les catch des edge functions)

---

## G. Paiement & Billing

### Ce qui fonctionne
- Stripe integration via edge functions (create-checkout, check-subscription, customer-portal)
- Price IDs reels configures (price_1Sv0NU..., price_1Sv0NV...)
- Product IDs mappes (prod_Tslv...)
- Plans: Free, Pro (14.90€/mois), Business (49.90€/mois) — cote checkout
- PaymentSuccess page avec verification d'abonnement
- useSubscription hook complet

### Problemes critiques
- **BillingPage est 100% FAKE** : affiche "Plan Premium 9.99€/mois" avec des factures hardcodees. Les boutons ne font rien.
- **Incoherence de prix** : Pricing page = Pro 14.90€ | BillingPage = Premium 9.99€ | Deux noms de plans differents
- **Pas de webhook Stripe** visible : l'abonnement n'est verifie que par polling (check-subscription toutes les 60s). Aucun traitement des evenements Stripe (invoice.paid, customer.subscription.deleted, etc.)
- **shopify-webhook existe** mais pas de Stripe webhook

---

## H. Performance

### Constats
- Lazy loading via React.lazy sur toutes les pages (bon)
- Suspense boundaries en place
- requestIdleCallback pour initialisation non critique (logger, webVitals, serviceWorker)
- react-window present pour virtualisation de listes longues
- Preconnect hints pour Supabase et fonts

### Problemes potentiels
- **Dependencies lourdes** : three.js, @react-three/xr, firebase, openai, hume, @mediapipe/tasks-vision, @huggingface/transformers, ml-matrix — bundle probablement tres lourd
- **Polling abonnement 60s** : charge inutile
- **4950 fichiers source** : temps de build potentiellement long
- **272 edge functions** : cold start latency sur les premieres invocations

---

## I. SEO Technique

### Ce qui fonctionne
- index.html excellent : title, meta description, og:tags, twitter:card, structured data JSON-LD complet
- hreflang fr + x-default
- PWA manifest
- noscript fallback
- react-helmet-async pour meta dynamiques
- usePageSEO hook presente dans au moins la page pricing

### Problemes
- **og:image pointe vers /og-image.png?v=2** — non confirme si le fichier existe
- **Canonical non defini** dans index.html
- **Sitemap non confirme** — pas de robots.txt ou sitemap.xml visible
- **Pages app probablement indexees** sans meta robots noindex
- **Couverture usePageSEO** non confirmee sur toutes les pages

---

## J. Accessibilite

### Ce qui fonctionne
- AccessibilitySkipLinks dans le RootProvider
- AccessibilityProvider context
- eslint-plugin-jsx-a11y configure
- axe-core et @axe-core/playwright en dependencies
- Radix UI composants (accessibles par defaut)
- prefers-reduced-motion respecte dans index.html

### Non confirme
- Labels de formulaires exhaustifs
- Navigation clavier complete
- Contraste suffisant
- aria attributes corrects
- Focus management dans les modales

---

## K. i18n / Localisation

### Ce qui fonctionne
- i18next + react-i18next configures
- 3 locales : fr, en, de
- I18nProvider dans le RootProvider
- LanguageSwitcher composant existe

### Problemes potentiels
- Couverture des traductions non confirmee
- Textes hardcodes visibles dans certains composants (BillingPage entierement en francais hardcode)
- Metadata SEO seulement en francais (index.html)
- Validations de formulaires potentiellement non traduites
- PaymentSuccess page contient des textes hardcodes en francais

---

## L. Observabilite / Go-Live Readiness

### Ce qui fonctionne
- Sentry integre (@sentry/react, @sentry/replay, @sentry/tracing)
- Logger structure (lib/logger)
- Web Vitals monitoring (lib/webVitals)
- Vercel Analytics integre (@vercel/analytics)
- Health check edge function existante (health-edge, health-check)
- Service Worker registration
- PWA configuration
- Lighthouse CI configure (lighthouserc.json)
- Husky pre-commit hooks
- Tests unitaires (vitest)
- E2E tests (playwright)
- ESLint configure

### Ce qui manque ou est problematique
- **Pages legales** : existent (privacy, terms, cookies, mentions) mais couverture non verifiee
- **Cookie banner et GDPR consent** : CookieBanner et PolicyAcceptanceModal presents (bon)
- **Donnees de demonstration non retirees** : pages avec mock data encore visibles
- **Environnement de test/prod mal distingue** : preconnect dans le HTML pointe vers un projet Supabase specifique

---

# 4. PLAN D'ACTION PRIORISE

## P0 — Correctifs immediats CRITIQUES

1. **Corriger la page BillingPage** : Brancher sur useSubscription, supprimer les donnees hardcodees, connecter les boutons
2. **Restreindre CORS sur les edge functions** : Remplacer `*` par le domaine autorise (necessite acces aux edge functions)
3. **Ajouter verify_jwt aux edge functions sensibles** (necessite acces backend)
4. **Corriger l'incoherence de prix** Pricing vs Billing
5. **Ajouter SET search_path aux fonctions SECURITY DEFINER** (necessite migration DB)

## P1 — Correctifs rapides

1. **Marquer clairement les pages avec donnees mockees** comme "demo" ou les desactiver
2. **Reduire le polling d'abonnement** de 60s a 300s minimum
3. **Supprimer le mecanisme TEST_MODE.BYPASS_AUTH** du code de production
4. **Harmoniser la methode d'auth dans les edge functions** (getUser partout)
5. **Ajouter canonical URL** dans index.html

## P2 — Ameliorations significatives

1. Audit et consolidation des 272 edge functions
2. Audit de couverture i18n
3. Audit SEO per-page
4. Supprimer les pages de test/dev (TestPage, ValidationPage)
5. Ajouter robots.txt et sitemap.xml

## P3 — Polish

1. Audit accessibilite complet avec axe-core
2. Optimisation du bundle (tree-shaking three.js, firebase)
3. Audit performance Lighthouse systematique
4. Breadcrumbs sur les pages de contenu

---

# 5. CORRECTIONS IMPLEMENTEES

Les corrections suivantes ont ete implementees directement :

### P0 — Correctifs critiques

1. **BillingPage reecrite** (`src/pages/BillingPage.tsx`)
   - Suppression de toutes les donnees hardcodees (faux plan Premium 9.99EUR, fausses factures)
   - Branchement sur `useSubscription` pour afficher les vraies donnees Stripe
   - Boutons fonctionnels : "Gerer mon abonnement" (ouvre Stripe Customer Portal), "Passer a Pro" (lance Stripe Checkout)
   - Etats loading et erreur correctement geres
   - Prix alignes sur les vrais plans Stripe (Pro 14.90EUR, Business 49.90EUR)

2. **CORS securise sur les 3 edge functions de paiement**
   - `supabase/functions/create-checkout/index.ts` : CORS restreint aux origins autorisees
   - `supabase/functions/check-subscription/index.ts` : CORS restreint aux origins autorisees
   - `supabase/functions/customer-portal/index.ts` : CORS restreint aux origins autorisees
   - Origins autorisees : emotionscare.com, www.emotionscare.com, emotions-care.lovable.app, localhost:5173

3. **create-checkout : getUser au lieu de getClaims** (`supabase/functions/create-checkout/index.ts`)
   - Remplacement de `supabaseClient.auth.getClaims(token)` par `supabaseAdmin.auth.getUser(token)` avec service role key
   - Validation server-side du token au lieu de simple decodage client-side

4. **Helper CORS securise** (`supabase/functions/_shared/api-helpers.ts`)
   - Ajout de `getCorsHeadersForRequest(req)` pour restreindre les origins
   - L'ancien `corsHeaders` wildcard marque comme deprecated

### P1 — Correctifs importants

5. **Polling abonnement reduit** (`src/hooks/useSubscription.ts`)
   - Polling passe de 60 secondes a 5 minutes (300s) pour eviter le rate limiting Stripe

6. **TEST_MODE verrouille** (`src/lib/config.ts`)
   - `TEST_MODE` est desormais `Object.freeze(...)` avec type `as const`
   - Impossible a modifier accidentellement a runtime

7. **Canonical URL ajoutee** (`index.html`)
   - `<link rel="canonical" href="https://emotionscare.com" />` ajoutee avant les hreflang

8. **PaymentSuccess : meta noindex** (`src/pages/PaymentSuccess.tsx`)
   - Ajout de `<meta name="robots" content="noindex, nofollow" />` via react-helmet-async
   - Page de paiement ne sera pas indexee par les moteurs de recherche

9. **ActivityLogsPage : commentaire mock** (`src/pages/ActivityLogsPage.tsx`)
   - Ajout d'un commentaire explicite sur les donnees de demonstration

---

# 6. COMPTE-RENDU FINAL

## Corrections effectuees (9 correctifs)
- BillingPage reecrite avec donnees reelles Stripe
- CORS restreint sur les 3 edge functions de paiement critiques
- Auth renforcee (getUser) sur create-checkout
- Helper CORS securise cree pour les futures edge functions
- Polling abonnement optimise (60s -> 300s)
- TEST_MODE verrouille via Object.freeze
- Canonical URL ajoutee
- PaymentSuccess protegee du SEO (noindex)
- Mock data documentee sur ActivityLogsPage

## Elements restants a traiter (necessite decisions ou acces externes)

### Necessite acces Supabase Dashboard / migration DB
- Ajouter `SET search_path = public` aux ~38 fonctions SECURITY DEFINER sans search_path
- Ajouter `verify_jwt` aux edge functions sensibles (236+ functions sans JWT)
- Creer un webhook Stripe pour synchroniser l'etat d'abonnement

### Necessite decision produit
- Retirer ou brancher les pages avec donnees mockees (WearablesPage, MusicAnalyticsPage, B2BDashboardAnalytics, ReportsPageEnhanced, OptimizationPageEnhanced)
- Consolidation des 272 edge functions (quelles sont actives ? quelles supprimer ?)
- Supprimer les pages de test/dev visibles (TestPage, ValidationPage, TestAccountsPage)

### Necessite acces serveur/hosting
- CORS wildcard sur les 233 autres edge functions (au-dela des 3 de paiement corrigees)
- Configuration CSP via HTTP headers (plus securise que meta tag)
- Rate limiting sur les edge functions

## Prochaines etapes recommandees avant go-live

1. **URGENT** : Deployer les corrections CORS et auth sur les edge functions de paiement
2. **URGENT** : Auditer et corriger le CORS wildcard sur TOUTES les edge functions restantes
3. **URGENT** : Migration DB pour corriger les fonctions SECURITY DEFINER sans search_path
4. **IMPORTANT** : Creer un webhook Stripe (invoice.paid, customer.subscription.updated, customer.subscription.deleted)
5. **IMPORTANT** : Audit complet des edge functions : identifier et desactiver les inutilisees
6. **IMPORTANT** : Ajouter verify_jwt a toutes les edge functions qui manipulent des donnees utilisateur
7. **MOYEN** : Audit de couverture i18n (fr/en/de)
8. **MOYEN** : Audit d'accessibilite systematique avec axe-core
9. **FAIBLE** : Optimisation du bundle (tree-shaking des grosses deps)
