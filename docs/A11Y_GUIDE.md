# Guide d'accessibilité AA/AAA

Ce document rassemble la checklist interne pour garantir le respect des critères WCAG 2.1 niveau AA (minimum) et AAA sur les points critiques (contraste et alternatives non textuelles).

## Principes généraux

- Tous les composants interactifs doivent être accessibles au clavier, disposer d'un ordre de tabulation cohérent et afficher un focus visible (classe utilitaire `focus-visible` ou `enhanced-focus`).
- Les informations véhiculées par la couleur doivent être doublées d'un texte explicite ou d'une icône avec description accessible.
- Les mises à jour dynamiques de l'interface (toasts, résumés de mood, compteurs, etc.) doivent être annoncées via des régions `aria-live` adaptées.
- Les animations doivent respecter la préférence système `prefers-reduced-motion` **et** être désactivables depuis la barre d'accessibilité (`AccessibilityProvider`).

## Checklist AA (obligatoire)

| Domaine | Vérification |
| --- | --- |
| Navigation clavier | • Tous les boutons, liens et éléments cliquables possèdent `role`, `tabIndex` ou un élément natif.<br>• Les raccourcis claviers éventuels sont documentés et n'entrent pas en conflit avec ceux du navigateur. |
| Focus | • Les styles de focus sont visibles sur fond clair et sombre (contraste ≥ 3:1).<br>• Les focus ne sont jamais supprimés (`outline: none`) sans remplacement équivalent. |
| Structure | • Chaque page possède un `main` identifié (`id="main-content"`).<br>• Les titres sont hiérarchisés (`h1` unique, puis `h2`, etc.). |
| Formulaires | • Les `input` disposent d'un label relié (`<label for>` ou `aria-labelledby`).<br>• Les messages d'erreur utilisent `role="alert"` ou `aria-live="assertive"`. |
| ARIA | • Les icônes seules ont un `aria-label` ou un texte masqué (`sr-only`).<br>• Les composants complexes (tabs, accordions) suivent les patterns WAI-ARIA officiels. |
| Contraste | • Utiliser la palette Tailwind en vérifiant un ratio ≥ 4.5:1 pour le texte normal (outil recommandé : `npx @axe-core/cli color`). |

## Checklist AAA ciblée

- Contraste renforcé pour les CTA critiques (≥ 7:1).
- Descriptions textuelles pour toutes les animations décoratives (par ex. mood mixer, graphiques dynamiques).
- Temps de lecture estimé et compteur de caractères annoncés dans la zone de journalisation (`aria-live="polite"`).

## Gestion des animations

1. Respect de la préférence système : classes utilitaires `@media (prefers-reduced-motion: reduce)` et hook `useMotionPrefs`.
2. Désactivation manuelle : toggles exposés via l'`AccessibilityToolbar` mettent à jour `AccessibilityProvider` et ajoutent la classe `reduced-motion` sur `<html>`.
3. Vérification Playwright : `tests/e2e/a11y.spec.ts` contient un scénario qui émule `prefers-reduced-motion` et contrôle l'absence de transition (`transition-duration: 0s`).

## Tests automatisés

- **Analyse axe-core (52 routes)** :
  ```bash
  npm run e2e -- tests/e2e/a11y.spec.ts
  ```
  Le test `Scan axe-core des routes critiques` doit rapporter `0` violation critique.
- **Audit manuel** : lancer `npm run dev`, naviguer en mode clavier seulement et vérifier les focus visibles.
- **Contraste** : exécuter `npx @axe-core/cli --tags wcag2aa` sur les pages nouvellement créées avant livraison.

## Bonnes pratiques complémentaires

- Ajouter systématiquement des `aria-live="polite"` pour les résumés d'humeur, notifications silencieuses et compteurs évolutifs.
- Prévoir une alternative texte/aria pour chaque `canvas`, `video` ou animation 3D.
- Ne jamais masquer un élément via `display: none` lorsqu'il doit rester visible pour les technologies d'assistance ; utiliser `sr-only` lorsque nécessaire.
- Documenter dans la PR toute exception ou contournement WCAG et la dette associée.

## Ressources internes

- `src/hooks/useMotionPrefs.tsx` – Hook pour conditionner animations et transitions.
- `src/components/common/AccessibilityProvider.tsx` – Gestion des préférences utilisateur (contraste élevé, focus renforcé, réduction des animations).
- `tests/e2e/a11y.spec.ts` – Référence pour la couverture automatique axe-core.

> ⚠️ Lorsqu'une nouvelle page ou un nouveau module est créé, mettre à jour `ADDITIONAL_ROUTES` dans `tests/e2e/a11y.spec.ts` si la page n'est pas encore répertoriée dans `ROUTES_MANIFEST.json` afin de conserver le seuil de 52 routes scannées.
