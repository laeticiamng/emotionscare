# OpenAPI & Typage des APIs

## Sources
- Specs situées dans `openapi/assess.yaml` et `openapi/b2b.yaml`.
- Toute modification passe par PR avec revue produit + data.

## Génération des types
```
npm run gen:openapi
npm run type-check
```
- Le script produit `src/api/types.gen.ts` (ne pas éditer manuellement).
- Les clients utilisent `src/api/client.ts` qui consomme automatiquement ces types.

## Conventions
- Réponses textuelles uniquement (pas de chiffres exposés côté front).
- Utiliser des tags de tonalité (`tone`, `signal`, `label`) pour guider l’UI.
- Pas de `any` : préférer `ExtractResponseBody`/`ExtractRequestBody` via le client fourni.

## Tests contrats
- MSW alimente les tests (`src/mocks/handlers/assessHandlers.ts`).
- CI : `npm run test:api` garantit que les handlers respectent le schéma.
- Playwright vérifie les scénarios critiques (assessments, rapports B2B) avec mocks alignés sur OpenAPI.

## Process de mise à jour
1. Modifier les fichiers `.yaml`.
2. Générer les types (`npm run gen:openapi`).
3. Mettre à jour ou créer les handlers MSW/tests.
4. Documenter l’endpoint dans la PR + `docs/ENV.md` / `docs/ARCHITECTURE.md` si nécessaire.
