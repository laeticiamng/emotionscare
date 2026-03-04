

## Triage des 8 tickets — État actuel et plan d'action

### Tickets DÉJÀ RÉSOLUS (aucune action requise)

| Ticket | Statut | Preuve |
|--------|--------|--------|
| **T1 — Hero desktop** | FAIT | `AppleHeroSection.tsx` utilise déjà `min-h-[80vh]`, `py-12 md:py-16`, `lg:text-7xl xl:text-8xl`. Confirmé visuellement lors de l'audit précédent. |
| **T2 — Cookie banner mobile** | FAIT | `SignupPage.tsx` a `pt-20 pb-40`. `CookieBanner.tsx` utilise `pointer-events-none` sur le wrapper fixe, `pointer-events-auto` sur le contenu, `max-h-[40vh]` sur mobile. |
| **T3 — Scroll signup mobile** | FAIT | Dernière correction appliquée : `min-h-[calc(100vh-4rem)]` + suppression de `overflow-y-auto` (diff confirmé). |
| **T7 — Vendor splitting** | FAIT | `vite.config.js` a déjà `manualChunks` pour react, recharts, framer-motion, lucide-react, radix, tanstack-query. |
| **T8 — Checklist QA** | FAIT | `docs/qa/release-checklist.md` existe avec toutes les sections requises (desktop, mobile, tunnel, console, Lighthouse, RGPD, tests). |

### Tickets À IMPLÉMENTER (3 restants)

#### T4 — Icône PWA : compression (P1)
**Problème :** L'icône `icon-144x144.png` dépasse potentiellement 50KB (contrainte mémoire project).
**Action :** Je ne peux pas compresser des images binaires. L'utilisateur doit compresser manuellement avec un outil comme Squoosh ou TinyPNG, puis remplacer le fichier dans `public/icons/`.
**Manifest :** `manifest.json` est déjà valide et complet.

#### T5 — Guard requêtes Supabase placeholder (P1)
**Problème :** `src/lib/env.ts` utilise `https://placeholder.supabase.co` comme fallback (lignes 97, 102). Si les env vars sont manquantes en preview, le client Supabase envoie des requêtes vers ce domaine inexistant.
**Action :** Ajouter un guard dans `src/lib/env.ts` qui détecte si l'URL contient "placeholder" et bloque les requêtes en loggant un warning au lieu de tenter la connexion.

| Fichier | Modification |
|---------|-------------|
| `src/lib/env.ts` | Ajouter un export `IS_PLACEHOLDER` basé sur `SUPABASE_URL.includes('placeholder')` |
| `src/integrations/supabase/client.ts` | Ajouter un guard qui retourne un client inerte si `IS_PLACEHOLDER` est true, ou logger un warning |

#### T6 — Tests E2E tunnel complet (P1)
**Problème :** Pas de tests E2E pour le tunnel signup → login → pricing → checkout.
**Action :** Créer 2 fichiers de tests Playwright avec mocking des API Supabase et Stripe via `page.route()`.

| Fichier | Contenu |
|---------|---------|
| `tests/e2e/tunnel-desktop.spec.ts` | 5 tests : signup, login, pricing display, checkout redirect, unauthenticated redirect. Viewport 1366x768. |
| `tests/e2e/tunnel-mobile.spec.ts` | 3 tests : signup scroll, pricing mobile, checkout mobile. Viewport 390x844. |

`playwright.config.ts` existe déjà avec les projects nécessaires.

### Résumé

- **5 tickets sur 8** sont déjà résolus par les travaux précédents
- **1 ticket (T4)** nécessite une action manuelle de l'utilisateur (compression image)
- **2 tickets (T5, T6)** sont implémentables : guard Supabase placeholder + tests E2E tunnel

