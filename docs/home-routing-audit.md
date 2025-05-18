# Audit de la page d'accueil et du routage

Ce court rapport récapitule la vérification de la route `/` et de la page de sélection de mode.

## Accessibilité

- La route racine `/` est définie comme publique dans `src/router.tsx` et rend le composant `ImmersiveHome` sans protection `ProtectedRoute`.
- Le hook `usePreferredAccess` vérifie explicitement qu'aucune redirection n'est appliquée lorsqu'un utilisateur non authentifié accède à `/`.

## Sélection de mode B2C/B2B

- Le composant `ImmersiveHome` contient deux boutons menant à `/b2c/login` et `/b2b/selection`.
- La page `B2BSelectionPage` gère ensuite l'orientation vers les espaces "Collaborateur" ou "Administration".

## Typage centralisé

- Les chemins principaux sont définis dans `src/types/navigation.ts`. Le fichier expose maintenant la propriété `landing` pour `/` et `home` pour `/home`.
- Toutes les constantes sont réexportées via `src/types/index.ts` pour des imports simplifiés.

## Tests

- Un test `routerPublicAccess.test.ts` vérifie la présence de la route publique et le mapping vers `B2BSelectionPage`.
- L'exécution des tests dans cet environnement échoue faute de dépendances, mais le script `npm test` a bien été lancé.

