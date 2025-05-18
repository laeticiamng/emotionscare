# Routes protégées

Ce fichier répertorie les routes de l'application nécessitant une authentification.
Chaque route utilise le composant `ProtectedRoute` qui vérifie la session Supabase
et le rôle de l'utilisateur avant de rendre la page.

| Chemin | Rôle requis |
|-------|-------------|
| `/settings` | authentifié |
| `/optimisation` | authentifié |
| `/extensions` | authentifié |
| `/b2c/*` | `b2c` |
| `/b2b/user/*` | `b2b_user` |
| `/b2b/admin/*` | `b2b_admin` |

Les appels vers les fonctions Edge (`supabase/functions`) exigent désormais un
token d'authentification via l'en-tête `Authorization`. Toute requête sans token
valide renvoie `401 Unauthorized`.
