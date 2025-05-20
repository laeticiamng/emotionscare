# Audit "Logique d'accès unifiée et expérience adaptative"

Ce rapport détaille la structure actuelle de la gestion des accès et des redirections sur la plateforme **EmotionsCare**. Il complète les audits existants en se concentrant sur la robustesse, la centralisation et l'adaptabilité selon le rôle utilisateur et le contexte.

## 1. Contexte global et providers

- `AppProviders` injecte les contextes globaux dans un ordre unique : `ThemeProvider`, `AuthProvider`, `UserPreferencesProvider`, `UserModeProvider`, `MusicProvider`, `OptimizationProvider`, `ExtensionsProvider`, `OrchestrationProvider`.
- `AuthContext` gère l'état de session et expose `login`, `logout`, `register`. Le rôle de l'utilisateur est sauvegardé dans `localStorage` via `AuthProvider`.
- `UserModeContext` conserve le mode sélectionné (`b2c`, `b2b_user`, `b2b_admin`) et le restaure depuis `localStorage`.
- `OnboardingContext` permet d'afficher un parcours d'accueil différent selon le rôle ou la progression.

## 2. Mapping des routes et droits d'accès

- Les chemins publics et privés sont centralisés dans `src/types/navigation.ts` au sein de la constante `ROUTES`.
- Le fichier `src/router.tsx` (alias `src/router/index.tsx`) importe ces composants et protège chaque espace via `ProtectedRoute`.
- `ProtectedRoute` vérifie l'authentification et compare le rôle de l'utilisateur à `requiredRole`. En cas de rôle incorrect il redirige vers le tableau de bord adapté.
- Le hook `usePreferredAccess` effectue une redirection immédiate pour les utilisateurs authentifiés accédant à `/b2b/selection`.

## 3. Flux de connexion et redirections

1. L'utilisateur choisit son mode (B2C ou B2B) sur la landing ou la sélection B2B.
2. Après authentification, `AuthContext` stocke les informations de session et `UserModeContext` enregistre le mode dans `localStorage`.
3. L'utilisateur est redirigé vers son tableau de bord : `/b2c/dashboard`, `/b2b/user/dashboard` ou `/b2b/admin/dashboard`.
4. Les préférences (thème, langue, etc.) sont gérées par `UserPreferencesContext` et peuvent être persistées via `useLocalStorage` (hook `usePreferences`).

## 4. Adaptativité et expérience personnalisée

- `UserModeContext` permet de basculer dynamiquement entre les modes sans nécessiter de déconnexion.
- `OnboardingContext` expose des étapes pouvant être configurées par rôle : un administrateur voit un tutoriel différent d'un collaborateur ou d'un utilisateur B2C.
- Les hooks (`useDashboardMonitor`, `usePreferredAccess`) apportent des ajustements contextuels et des messages UX friendly lors d'erreurs ou de redirections.

## 5. Stockage et restitution des choix

- `AuthContext` et `UserModeContext` utilisent `localStorage` pour mémoriser la session et le dernier mode utilisé.
- Le hook `usePreferences` stocke les préférences dans `localStorage` via `useLocalStorage` afin de restaurer les réglages à chaque visite.

## 6. Tests et vérifications

- Des tests unitaires existent (`src/tests`) pour vérifier l'export des contextes et la présence des routes publiques (`routerPublicAccess.test.ts`).
- Les commandes `npm run test` et `npm run type-check` doivent s'exécuter sans erreur afin de valider la logique de routage et de typage.

## 7. Points d'amélioration proposés

- **Unification totale du router** : maintenir un seul fichier `src/router/index.tsx` et supprimer les doublons pour éviter les divergences.
- **Génération dynamique des routes** à partir du mapping `ROUTES` afin de simplifier l'ajout de nouveaux rôles ou modules.
- **Persistance sécurisée** : stocker le rôle et la session dans un cookie `httpOnly` côté serveur en production.
- **Logs d'accès** : prévoir un `AccessLogContext` pour tracer chaque tentative d'accès et faciliter la conformité RGPD.
- **Support multi‑session** : synchroniser le contexte utilisateur entre plusieurs appareils (prévoir une architecture temps réel).
- **Tests end‑to‑end** : couvrir les scénarios complets de changement de rôle, d'accès non autorisé et d'onboarding personnalisé.

---

Cette analyse confirme que la plateforme dispose déjà d'une logique d'accès centralisée et extensible. Les améliorations ci‑dessus permettront d'accroître la robustesse et la scalabilité de l'expérience adaptative.
