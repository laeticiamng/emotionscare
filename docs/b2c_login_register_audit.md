# Point 2 - Audit B2C Connexion / Inscription

Ce document synthétise l'état actuel des pages `/b2c/login`, `/b2c/register` et la transition post‑login.

## Architecture générale

- **Routing** : les routes sont définies dans `src/router/index.tsx` et `src/AppRouter.tsx`. Les chemins `/b2c/login` et `/b2c/register` y sont explicitement déclarés et exposent respectivement `B2CLoginPage` et `B2CRegisterPage`.
- **Contexte d'authentification** : l'unique provider `AuthProvider` (fichier `src/contexts/AuthContext.tsx`) gère la session, l'utilisateur courant et expose les méthodes `login`, `register` et `logout`.
- **Services** : la logique basse niveau repose sur `authService` (`src/services/auth-service.ts`) qui encapsule les appels Supabase.
- **Types** : `User`, `AuthUser` et `AuthContextType` sont centralisés dans `src/types`.
- **Redirections** : après succès, les pages de login et de register déclenchent `PostLoginTransition` puis naviguent vers `/b2c/dashboard`.

## Sécurité et persistance de session

- Lors d'une connexion sans option "se souvenir de moi", `AuthContext` transfère le token de `localStorage` vers `sessionStorage` (lignes 61‑69) afin que la session soit détruite à la fermeture du navigateur.
- Le token est supprimé à la déconnexion avec `authService.signOut()` et `localStorage.removeItem('userMode')` (lignes 110‑120).
- Un mécanisme de protection contre le bruteforce est présent dans `src/utils/security.ts` (`MAX_LOGIN_ATTEMPTS`, `LOGIN_LOCK_TIME_MS`) et testé par `src/tests/loginThrottle.test.ts`.

## Expérience post‑login

- Les pages `Login.tsx` et `Register.tsx` déclenchent `setShowTransition(true)` à la réussite, ce qui affiche le composant `PostLoginTransition` (animation de bienvenue) avant la navigation définitive.
- `sessionStorage.setItem('just_logged_in', 'true')` est utilisé pour rejouer la transition en cas de rechargement de page immédiatement après la connexion.

## Couverture de tests

- Des tests unitaires minimalistes valident la présence des exports dans `AuthContext` et `authService`.
- `loginThrottle.test.ts` vérifie la mise en place du verrouillage après trop de tentatives.
- `routerPublicAccess.test.ts` confirme que la route racine et la route de sélection B2B sont accessibles sans authentification.

## Points d'amélioration proposés

- **Multi‑provider** : prévoir l'extension du `AuthProvider` pour supporter OAuth / SSO et la révocation de sessions multiples.
- **Refresh automatique** : intégrer la récupération d'un refresh token via Supabase pour renouveler la session sans interaction utilisateur.
- **Centralisation des messages d'erreur** : créer un fichier de mapping des codes d'erreurs (`src/utils/authErrorMessages.ts`) pour faciliter la traduction et la maintenance.
- **Audit RGPD** : ajouter un service dédié à l'anonymisation ou la purge des données sur demande, ainsi qu'un historique des connexions.
- **Tests complémentaires** : simuler des cas d'échec/expiration de session et vérifier que les routes protégées redirigent correctement sans fuite de données.
- **Documentation** : mettre à jour le `README.md` (routes obsolètes) et renforcer la documentation des flux premium (lien magique, biométrie).
