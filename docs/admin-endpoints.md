# Endpoints Admin

Ce document liste les principaux appels back utilisés par le dashboard administration.

## Gestion des équipes

| Action | Endpoint Supabase | Description |
|-------|------------------|-------------|
| Lister les équipes | `team-management` action `list` | Retourne l'ensemble des équipes disponibles. |
| Créer une équipe | `team-management` action `create` | Ajoute une nouvelle équipe. |
| Mettre à jour une équipe | `team-management` action `update` | Modifie les informations d'une équipe. |
| Supprimer une équipe | `team-management` action `delete` | Supprime l'équipe ciblée. |

Chaque appel est protégé par `authorizeRole` et nécessite le rôle `b2b_admin` ou `admin`. Les opérations sont journalisées dans la table `admin_logs`.
