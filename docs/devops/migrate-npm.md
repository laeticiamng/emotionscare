# Migration vers npm

Cette procédure décrit le passage d'une stack Nixpacks/Bun vers un environnement Node standard utilisant uniquement **npm**.

1. Utilisez l'image `node:lts-slim` dans vos workflows GitHub.
2. Exécutez `node scripts/install-with-npm.js --force` pour installer les dépendances après avoir cloné le dépôt.
3. Vérifiez que `.npmrc` est présent à la racine avec les options imposant l'usage de npm.
4. Lancez la construction et les tests avec `npm run build` puis `npm run test`.

Ce guide simplifie la CI et le développement local en supprimant complètement Bun de la chaîne de build.
