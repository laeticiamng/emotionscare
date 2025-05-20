# Point 10 - Logique d'accès unifiée et expérience adaptative

Ce document complète `docs/unified-access-adaptive-audit.md` et détaille la logique actuelle de gestion des accès sur EmotionsCare.

## 1. Centralisation de l'accès

- Les contextes globaux sont injectés via `AppProviders` (ordre défini lignes 20-29 de `src/providers/AppProviders.tsx`).
- `AuthContext` gère l'état de session (`login`, `logout`, `register`) et enregistre le rôle de l'utilisateur.
- `UserModeContext` conserve le mode B2C ou B2B choisi et le persiste dans `localStorage`.

## 2. Mapping des routes

Les chemins publics et privés sont listés dans `src/types/navigation.ts`.
```ts

export const ROUTES: RouteConfig = {
  b2c: {
    home: '/b2c',
    login: '/b2c/login',
    register: '/b2c/register',
    dashboard: '/b2c/dashboard',
    journal: '/b2c/journal',
    scan: '/b2c/scan',
    music: '/b2c/music',
    coach: '/b2c/coach',
    vr: '/b2c/vr',
    settings: '/b2c/settings',
    gamification: '/b2c/gamification',
    marketplace: '/b2c/marketplace',
    cocon: '/b2c/cocon',
    preferences: '/b2c/preferences',
    extensions: '/extensions'
  },
  b2bUser: {
    home: '/b2b/user',
    login: '/b2b/user/login',
    register: '/b2b/user/register',
    dashboard: '/b2b/user/dashboard',
    journal: '/b2b/user/journal',
    scan: '/b2b/user/scan',
    music: '/b2b/user/music',
    coach: '/b2b/user/coach',
    vr: '/b2b/user/vr',
    teams: '/b2b/user/teams',
    settings: '/b2b/user/settings',
    gamification: '/b2b/user/gamification',
    cocon: '/b2b/user/cocon',
    preferences: '/b2b/user/preferences',
    extensions: '/extensions'
  },
  b2bAdmin: {
    home: '/b2b/admin',
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    journal: '/b2b/admin/journal',
    scan: '/b2b/admin/scan',
    music: '/b2b/admin/music',
    coach: '/b2b/admin/coach',
    vr: '/b2b/admin/vr',
    teams: '/b2b/admin/teams',
    reports: '/b2b/admin/reports',
    events: '/b2b/admin/events',
    settings: '/b2b/admin/settings',
    optimisation: '/b2b/admin/optimisation',
    extensions: '/extensions'
  },
  common: {
    landing: '/',
    home: '/home',
    b2bSelection: '/b2b/selection',
    unauthorized: '/unauthorized',
    notFound: '/not-found'
  }
};
```

Chaque section (`b2c`, `b2bUser`, `b2bAdmin`, `common`) permet de savoir quelles routes sont accessibles selon le rôle.

## 3. Protection et redirections

- `ProtectedRoute` vérifie l'authentification et le rôle avant d'afficher la page ciblée (voir `src/components/ProtectedRoute.tsx`).
- `usePreferredAccess` redirige automatiquement un utilisateur connecté vers son tableau de bord si besoin.
- Les pages non autorisées affichent `UnauthorizedAccess` avec message UX friendly.

## 4. Onboarding et expérience adaptative

`OnboardingContext` expose des étapes configurables. Les rôles peuvent ainsi suivre un parcours d'accueil personnalisé lors de la première connexion.

## 5. Persistance et préférences

Les choix de mode et de préférences utilisateur sont stockés dans `localStorage` via `AuthContext`, `UserModeContext` et `usePreferences`.

## 6. Tests et vérifications

Les tests unitaires se trouvent dans `src/tests` et la commande `npm run test` s'exécute sans erreur. Un `tsc --noEmit` assure la cohérence des types.

---

Cette vérification confirme la présence d'une logique d'accès centralisée et extensible. Des améliorations restent possibles (logs d'accès, support multi‑session), mais la base est solide pour une expérience utilisateur adaptative.
