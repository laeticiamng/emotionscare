# Audit de la page d'accueil et du routage

Ce court rapport récapitule la vérification de la route `/` et de la page de sélection de mode.

## Schéma de routage

```mermaid
flowchart TD
    A[Accueil /] -->|Particulier| B[/b2c/login]
    A -->|Entreprise| C[/b2b/selection]
    C -->|Collaborateur| D[/b2b/user/login]
    C -->|Administration| E[/b2b/admin/login]
```

## Accessibilité

- La route racine `/` est définie comme publique dans `src/router.tsx` et rend le composant `ImmersiveHome` sans protection `ProtectedRoute`.
- Le hook `usePreferredAccess` vérifie explicitement qu'aucune redirection n'est appliquée lorsqu'un utilisateur non authentifié accède à `/`.

## Sélection de mode B2C/B2B

- Le composant `ImmersiveHome` contient deux boutons menant à `/b2c/login` et `/b2b/selection`.
- La page `B2BSelectionPage` gère ensuite l'orientation vers les espaces "Collaborateur" ou "Administration".

## Typage centralisé

- Les chemins principaux sont définis dans `src/types/navigation.ts`. Le fichier expose maintenant la propriété `landing` pour `/` et `home` pour `/home`.
- Toutes les constantes sont réexportées via `src/types/index.ts` pour des imports simplifiés.

## Context providers utilisés

- `AppProviders` agrège `ThemeProvider`, `AuthProvider`, `UserPreferencesProvider`, `UserModeProvider` et d'autres contextes globaux.
- Aucun provider ne force la redirection vers une route protégée lors de l'accès à `/`.

## Tests

- Un test `routerPublicAccess.test.ts` vérifie la présence de la route publique et le mapping vers `B2BSelectionPage`.
- L'exécution des tests dans cet environnement échoue faute de dépendances, mais le script `npm test` a bien été lancé.

## Points d'amélioration identifiés

- Mise en place du lazy loading pour `ImmersiveHome` et `B2BSelectionPage` afin de réduire le temps de chargement initial.
- Détection automatique de la langue via le `PreferencesProvider` pour préparer la future internationalisation.

