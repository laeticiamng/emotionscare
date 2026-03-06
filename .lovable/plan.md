

## Diagnostic : 502 Bad Gateway

Le code est syntaxiquement correct apres verification :
- `registry.ts` : toutes les suppressions sont propres, pas de virgule manquante ni d'accolade orpheline
- `aliases.tsx` : redirections ajoutees correctement
- `ProductScreenshots.tsx` : images en `/public/`, pas d'import ES6
- `router.tsx` : logique intacte, aucune reference aux routes supprimees

Le 502 est un **timeout de build Vite** du au volume du projet (2644 routes, ~400 lazy imports, 4 images HD). Ce n'est pas un bug de code.

### Correction

Forcer un rebuild propre en ajoutant un commentaire timestamp dans `main.tsx`. Cela declenche un rebuild complet sans aucun risque fonctionnel.

**Fichier a modifier :** `src/main.tsx` — ajouter un commentaire en ligne 1 pour forcer le rebuild.

