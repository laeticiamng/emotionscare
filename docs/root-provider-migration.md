# Migration des Providers Racine

Cette refactorisation introduit un **RootProvider** unique afin de simplifier l'arbre des providers et garantir une configuration cohérente. Les principaux contextes (authentification, thème, cache, musique, etc.) sont désormais encapsulés dans ce composant, ce qui allège `App.tsx` et facilite les tests.

## Points clés
- Centralisation de `QueryClientProvider`, `AuthProvider`, `ThemeProvider` et consorts.
- Suppression des providers spécifiques globaux (`InnovationProvider`, `EthicsProvider`). Ils seront déplacés au plus près des fonctionnalités concernées.
- Ajout d'un logger structuré afin d'uniformiser les traces techniques.

## Impacts
- Le code applicatif est maintenant en anglais conformément au guide de style.
- Les logs ne contiennent plus d'émojis ni de messages français.
- La future intégration de providers spécifiques se fera directement dans chaque feature.
