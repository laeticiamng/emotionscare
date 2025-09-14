# Code Style Guidelines

Ce document définit les conventions de style utilisées dans le projet **EmotionsCare**. Ces règles permettent de garder un code cohérent et lisible pour toute l'équipe.

## Langue
- Le code (noms de variables, fonctions, classes, commentaires techniques) est écrit en **anglais**.
- La documentation produit reste en **français**.

## Nommage
- **Composants et classes** : `PascalCase`.
- **Fonctions et variables** : `camelCase`.
- **Fichiers** : `kebab-case`.
- Éviter toute terminologie clinique ou jargon dans l'interface utilisateur.

## Import et structure
- Utiliser des imports absolus lorsque des alias sont définis via `tsconfig` ou `vite`.
- Grouper les imports par ordre : bibliothèques externes, alias internes, chemins relatifs.
- Chaque dossier expose un `index.ts` regroupant les exports publics du domaine.

## Journaux
- Les logs sont structurés : `event` + `params` sous forme d'objet.
- Aucun émoji ni message technique en production.

## Commentaires
- Commenter uniquement ce qui n'est pas évident dans le code.
- Préférer les noms explicites à des commentaires inutiles.

## Messages de commit
- Utiliser l'impératif présent (`Add feature`, `Fix bug`).
- Mentionner le domaine concerné en préfixe si pertinent (`scan:`, `music:` …).

## Lint
- Exécuter `npm run lint` pour vérifier le respect des conventions.
- La CI bloque les PR ne respectant pas ces règles.

