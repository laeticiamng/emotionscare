# Guide de contribution — Imports locaux

## Anti-barrel : règle `no-index-barrel`

Pour limiter les cycles et les dépendances implicites, nous bannissons les imports locaux via `index.ts` / `index.tsx`.

- ✅ Importer directement le fichier dont vous avez besoin (`import { useFoo } from './useFoo'`).
- ❌ Importer un dossier ou un fichier `index` (`import { useFoo } from './index'`, `import * from '../index'`).

Une règle dependency-cruiser `no-index-barrel` fait échouer la CI dès qu'un import relatif vers `index` est détecté.

```bash
npx dependency-cruiser --config .dependency-cruiser.js src
```

Utilisez la commande ci-dessus pour vérifier localement avant de pousser vos changements.

### Besoin d'une exception ?

Les exceptions doivent rester rares et motivées (cas de compatibilité historique). Documentez-les et préférez lister explicitement les exports nécessaires plutôt que de réintroduire un `index.ts` massif.
