# Auth Middleware

Le fichier `supabase/functions/_shared/auth.ts` centralise la vérification d'authentification pour toutes les fonctions Edge.

```ts
import { requireAuth } from '../_shared/auth.ts';
```

## Fonction `requireAuth`
- Récupère le token d'authentification depuis l'en-tête `Authorization` ou le cookie `sb-access-token`.
- Valide le token via Supabase Auth.
- Si la session est invalide ou absente, la tentative est enregistrée dans la table `auth_attempts` via `logUnauthorizedAccess`.
- Retourne l'utilisateur authentifié ou `null`.

## Fonction `logUnauthorizedAccess`
- Insère un log contenant l'IP, la route et le motif du refus.
- Permet un audit simple des accès non autorisés.

Toutes les fonctions du répertoire `supabase/functions/` utilisent `requireAuth` pour empêcher l'accès aux tableaux de bord ou aux API sans session valide.
