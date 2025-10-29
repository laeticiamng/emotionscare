# Edge Functions Integration Tests

## Overview

Ces tests d'intégration vérifient le bon fonctionnement des edge functions Supabase du module `/app/scan`.

## Tests couverts

### `mood-camera.test.ts`
- ✅ Rejet des requêtes non authentifiées
- ✅ Validation des données d'entrée (frameData requis)
- ✅ Retour de valence/arousal pour frame valide
- ✅ Respect du rate limiting (10 req/min)

### `assess-submit.test.ts`
- ✅ Rejet des requêtes non authentifiées
- ✅ Validation des réponses SAM
- ✅ Rejet des instruments invalides
- ✅ Soumission depuis mode caméra
- ✅ Stockage dans `clinical_signals`

## Prérequis

1. Compte utilisateur test dans Supabase:
   - Email: `test@example.com`
   - Password: `testpassword123`

2. Variables d'environnement:
   ```bash
   VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
   ```

3. Edge functions déployées:
   ```bash
   supabase functions deploy mood-camera
   supabase functions deploy assess-submit
   ```

## Exécution

```bash
# Tous les tests edge functions
npm test tests/edge-functions

# Un fichier spécifique
npm test tests/edge-functions/mood-camera.test.ts

# Avec couverture
npm test tests/edge-functions -- --coverage
```

## Notes

- Les tests nécessitent une connexion réseau active
- Rate limiting peut ne pas se déclencher en environnement test
- Certains tests sont skippés si l'utilisateur test n'existe pas
- Les logs détaillés sont disponibles dans Supabase Dashboard

## Monitoring

Les edge functions sont monitorées via:
- Sentry (erreurs et performance)
- Supabase Logs (invocations et erreurs)
- Analytics custom (événements métier)

Liens utiles:
- [Logs mood-camera](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions/mood-camera/logs)
- [Logs assess-submit](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions/assess-submit/logs)
