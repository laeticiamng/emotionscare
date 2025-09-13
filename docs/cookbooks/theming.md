# Theming & Dark mode

## Contexte
Le thème utilise `ThemeProvider` pour appliquer des variables CSS et gérer le mode sombre.

## Intégration
```tsx
import { ThemeProvider, ThemeToggle } from "@/COMPONENTS.reg";

<ThemeProvider>
  <App />
</ThemeProvider>
```
Placer `ThemeToggle` dans l'interface pour permettre le changement de thème.

## Bonnes pratiques
- Respecter `prefers-color-scheme` via l'option "system".
- Garder les textes accessibles (contraste suffisant).

## Pièges à éviter
- Ne pas renommer ou supprimer les exports existants.
- Toujours importer via `COMPONENTS.reg`.
