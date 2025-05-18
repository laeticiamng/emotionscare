# Audit du module B2B

Ce document synthétise l'audit et les ajustements réalisés sur la partie B2B de l'application (connexion, inscription et dashboards utilisateur/administrateur).

## Gestion des rôles et contextes

- Le `AuthContext` centralise l'authentification et expose l'objet `user` contenant la propriété `role`.
- Le `UserModeContext` conserve le mode sélectionné (B2C, B2B utilisateur, B2B admin) dans `localStorage` pour restaurer l'expérience.
- Le routage sécurisé s'appuie sur `ProtectedRoute` qui vérifie `user.role` et redirige vers le dashboard adapté.

## ProtectedRoute

- La route protégée s'assure qu'un utilisateur non authentifié est redirigé vers la page de connexion correspondante.
- En cas de rôle incorrect, l'utilisateur est redirigé vers son propre dashboard.

## Typage centralisé

- Les types liés aux utilisateurs et aux dashboards sont désormais exportés dans `types/user.ts` et `types/dashboard.ts` afin d'être utilisés partout dans le projet.
- Les définitions initiales restent dans `src/types` mais sont réexportées pour une meilleure visibilité.

## Flux d'inscription et de connexion

- Les pages `src/pages/b2b/user/Login.tsx` et `src/pages/b2b/admin/Login.tsx` utilisent le `AuthContext` pour authentifier puis vérifient le rôle avant de rediriger sur `/b2b/user/dashboard` ou `/b2b/admin/dashboard`.
- L'inscription côté collaborateur (`Register.tsx`) reste limitée à une demande d'accès et redirige vers la connexion après soumission.

## Sécurité et persistance

- Les sessions sont gérées via Supabase avec écoute d'état dans `AuthContext`.
- `UserModeContext` garantit la persistance du mode utilisateur sans exposer d'informations sensibles.

## Tests et couverture

- Très peu de tests sont présents. Il est recommandé d'ajouter des tests unitaires sur `AuthContext`, `ProtectedRoute` et les pages de connexion.
- Des tests end‑to‑end devraient couvrir le parcours complet sélection → connexion → dashboard.

## Documentation complémentaire

- Ce fichier décrit le schéma global du module B2B. Pour plus de détails sur les rôles et routes, consulter `src/router.tsx` et `src/utils/userModeHelpers.ts`.
