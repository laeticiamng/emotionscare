# SEO technique

## Contexte
`SeoHead` ajoute les balises `title`, `description` et Open Graph par page.

## Intégration
```tsx
import { SeoHead } from "@/COMPONENTS.reg";

<SeoHead title="Titre" description="Description" />
```

## Bonnes pratiques
- Utiliser des descriptions uniques par page.
- Garder les balises sociales (`og:`) pour le partage.

## Pièges à éviter
- Ne pas retirer les métadonnées existantes.
- Toujours importer via `COMPONENTS.reg`.
