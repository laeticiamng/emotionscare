# 🗺️ Routing – RouterV2

La navigation de l'app s'appuie sur **RouterV2** (`src/routerV2`). Cette section détaille les sources d'autorité, les alias, les guards et la gestion B2C/B2B.

## 📚 Source unique de vérité
- `src/routerV2/registry.ts` contient la liste exhaustive des routes (`ROUTES_REGISTRY`).
- Chaque entrée décrit : `name`, `path`, `segment` (`public`, `consumer`, `employee`, `manager`…), rôle, layout, composant chargé.
- Les alias et redirections historiques sont attachés via `aliases` (ex. `/dashboard` → `/app/home`).

### Helpers
- `src/lib/routes.ts` expose des helpers typés (`routes.public.home()`, `routes.b2c.scan()`, etc.).
- `src/routerV2/routes.ts` conserve la compatibilité avec l'ancien `Routes.xxx()` tout en déléguant à `lib/routes`.
- Toujours importer ces helpers plutôt que des strings hardcodés → ESLint (`ec/no-legacy-routes-helpers`) l'impose.

## 🔐 Guards & segments
- Chaque route protégée définit `segment` & `role`. RouterV2 applique :
  - **Auth guard** : vérifie la session via `AuthProvider`.
  - **Role guard** : compare `UserModeProvider` (`consumer`, `employee`, `manager`).
  - **Feature flags** : certains modules (VR, Community) vérifient `useFlags().has('FF_...')`.
- Les pages `401`, `403`, `404`, `503` sont centralisées dans `src/pages/errors` et référencées dans la registry (même layout marketing).

## 🔄 Alias & redirections
- `src/routerV2/aliases.tsx` mappe les anciens chemins (`/emotions`, `/flash-glow`, `/social-cocon`, etc.) vers leurs équivalents RouterV2.
- `LegacyRedirect` ajoute un breadcrumb Sentry (`route:alias`) et fusionne query/hash.
- Toute nouvelle migration de route doit être déclarée dans `ROUTE_ALIASES` + `aliases` côté registry pour garder la trace.

## 🔀 B2C / B2B switch
- `UserModeProvider` sélectionne le mode selon `auth.user.user_metadata.role` (consumer, employee, manager).
- RouterV2 lit ce mode pour diriger `/app` :
  - consumer → `/app/home`
  - employee → `/app/collab`
  - manager → `/app/rh`
- Les helpers `Routes.consumerHome()`, `Routes.managerHome()` encapsulent cette logique.

## 🧭 Structure du router
- `src/routerV2/router.tsx` instancie `createBrowserRouter` avec :
  - Suspense/Lazy boundaries (lazy import des pages).
  - `withErrorBoundary` (alias `ErrorContext`).
  - `PerformanceGuard` (log Sentry, measure).
- `RouterV2/index.tsx` connecte le router à React Router (`RouterProvider`).

## 🧱 Layouts & providers
- Layout marketing vs app sont définis dans la registry (`layout: 'marketing' | 'app' | 'simple'`).
- `AppLayout` applique les providers UI (sidebar, topbar) selon le segment.
- Les pages dev (`/validation`, `/dev/system-audit`) ne sont montées qu'en `import.meta.env.DEV` (voir registry).

## 📄 Pages d'état uniformisées
- `/401`, `/403`, `/404`, `/503` partagent la même charte (CTA retour, i18n, logs Sentry).
- `*` (catch-all) est résolu vers `UnifiedErrorPage` – ne jamais créer un fallback custom hors registry.

## ✅ Checklist lors de l'ajout d'une route
1. Ajouter la route dans `ROUTES_REGISTRY` (avec alias éventuels, layout, guard, segment).
2. Exporter le composant depuis `src/pages/index.ts` si besoin (lazy import auto).
3. Mettre à jour `docs/PAGES_LISTING.md` + `docs/MODULES_LISTING.md`.
4. Ajouter/adapter les tests (unitaires router + e2e Playwright si parcours critique).
5. Vérifier `ROUTE_ALIASES` si migration.

> _RouterV2 est la vérité absolue. Aucune route ne doit être définie directement dans les modules sans passer par la registry._
