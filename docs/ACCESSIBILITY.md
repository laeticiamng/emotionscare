# Accessibilité AA – Checklist EmotionsCare

## Global
- Respect de `prefers-reduced-motion` (animations désactivées via `tokens.css`).
- Contraste minimal AA sur tout texte (vérifié via Storybook + axe).
- Police lisible (`Inter`) avec fallback accessibles.

## Navigation
- Lien d’évitement `SkipLink` vers `#main` sur chaque vue authentifiée.
- Focus visible constant (classe `ec-focus-ring`). Jamais de `outline: none`.
- Ordre de tabulation cohérent avec la hiérarchie visuelle.

## Composants
- **Button** : support `aria-pressed` pour les états toggles, textes actionnables.
- **Modal** : focus trap, fermeture via Échap, retour focus sur le déclencheur.
- **Form** : labels explicites, erreurs reliées via `aria-describedby`, ton bienveillant.
- **Alert** : `role="status"` par défaut, `role="alert"` pour le danger. Messages textuels sans chiffres.
- **Spinner** : libellé accessible via `VisuallyHidden`.
- **ChartA11yCaption** : associer chaque graphique à un descriptif textuel (`aria-describedby`).

## Tests automatiques
- `npm run test` inclut des suites `jest-axe` sur les composants du design system.
- `npm run e2e` déclenche Playwright + axe-core sur les pages clés (`/`, `/app/home`, `/app/scan`, `/b2b/reports`).
- Tout écart AA bloque la CI.

## Bonnes pratiques additionnelles
- Éviter les contenus clignotants ou auto-play agressifs.
- Préférer des phrases descriptives (“Ambiance sereine”) aux pourcentages.
- Documenter chaque composant dans Storybook avec section “A11y notes”.
