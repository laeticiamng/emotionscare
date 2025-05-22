# Auth Middleware

Le fichier `supabase/functions/_shared/auth.ts` centralise la vérification d'authentification pour toutes les fonctions Edge.

```ts
import { authorizeRole } from '../_shared/auth.ts';
```

## Fonction `authorizeRole`
- Combine l'authentification et la vérification du rôle.
- Retourne `{ user, status }` où `status` vaut `401` si la session est invalide ou `403` si le rôle est interdit.
- Toutes les tentatives refusées sont enregistrées via `logUnauthorizedAccess`.

## Fonction `logUnauthorizedAccess`
- Insère un log contenant l'IP, la route et le motif du refus.
- Permet un audit simple des accès non autorisés.

Toutes les fonctions du répertoire `supabase/functions/` utilisent `authorizeRole` afin de bloquer systématiquement les accès non autorisés.

## Vérifications automatiques

Un test situé dans `src/tests/edgeFunctionsAuth.test.ts` parcourt toutes les fonctions Edge et
s'assure que `authorizeRole` est bien appelé avant toute lecture du corps de la
requête (`req.json()` ou `req.text()`). Cela garantit qu'aucun traitement n'est
exécuté sans contrôle préalable des droits.
