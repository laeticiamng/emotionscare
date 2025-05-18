# Rapport QA - Page B2B Selection

## Constat
- Lors des tests, la page `/b2b/selection` restait accessible même pour les utilisateurs déjà authentifiés.
- L'absence de redirection entraînait un flux incohérent et la page pouvait être rendue en dehors du contexte global.

## Analyse
- La route était bien publique et aucun `ProtectedRoute` ne bloquait l'accès.
- Le hook `usePreferredAccess` ne couvrait pas ce chemin, ce qui permettait aux utilisateurs connectés d'y revenir manuellement.
- En rendant la page seule (sans `AppProviders`), le composant `Shell` générait une erreur de contexte.

## Correction
- Ajout d'une vérification d'authentification dans `B2BSelectionPage`.
- Les utilisateurs connectés sont automatiquement redirigés vers leur tableau de bord selon leur rôle.
- Vérification que la page reste publique pour les visiteurs non authentifiés.

## Résultat
- Navigation fluide entre l'accueil et la sélection d'espace.
- Les deux boutons de rôle s'affichent correctement pour les visiteurs.
- Aucune erreur en console lors des tests manuels.
