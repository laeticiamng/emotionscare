# Flux d'authentification B2C

Ce document décrit la logique de connexion, d'inscription et de gestion de session pour les utilisateurs particuliers.

## Contexte global
- Toute la logique d'authentification repose sur `AuthContext` (`src/contexts/AuthContext.tsx`).
- Le contexte expose l'état utilisateur (`user`), l'indicateur `isAuthenticated` et les méthodes `login`, `logout`, `register`.
- Les informations utilisateur comprennent l'id, l'email, le rôle et les préférences chargées depuis Supabase.

## Processus
1. **Inscription** : `authService.signUp` crée l'utilisateur dans Supabase et enregistre les métadonnées (nom, rôle, préférences). A la réussite, le listener d'état d'authentification hydrate le `AuthContext`.
2. **Connexion** : `authService.signIn` vérifie les identifiants. Après succès, le listener d'auth récupère le profil complet et met à jour `user`.
3. **Redirection** : après une connexion réussie, l'utilisateur est redirigé vers `/b2c/dashboard`.
4. **Déconnexion** : `authService.signOut` révoque la session Supabase puis le listener nettoie l'état local.

## Routage sécurisé
- Les pages sous `/b2c/*` utilisent le composant `ProtectedRoute` pour empêcher l'accès sans authentification.
- Les routes publiques `b2c/login` et `b2c/register` restent accessibles à tous.

## Stockage
- Supabase persiste la session dans `localStorage`. Les tokens sont accessibles via `AuthContext` pour d'éventuels appels API sécurisés.

## Erreurs
- Les erreurs provenant du backend sont capturées dans le contexte et peuvent être affichées par l'UI via les toasts.

