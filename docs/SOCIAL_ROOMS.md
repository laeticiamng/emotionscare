# Social Cocon – Rooms privées & pauses planifiées

## Tables & RLS

| Table | Description | RLS | Notes |
|-------|-------------|-----|-------|
| `social_rooms` | Métadonnées des rooms privées (nom, thème, mode audio, `soft_mode_enabled`, `invite_code`). | **Activée** : seule la personne hôte (`host_id`) et les membres présents dans `room_members` peuvent lire ou mettre à jour une room. | Pas de contenu sensible. Stockage audio strictement limité à des métadonnées (durée, présence). |
| `room_members` | Liste des personnes invitées/présentes dans une room. | **Activée** : chaque membre ne peut voir que ses propres lignes et celles de la room qu’il a rejointe. Insertion contrôlée par policies (host + membre invité). | Champs `preferences` (audio/texte) et `display_name` uniquement. |
| `social_room_breaks` | Mini-pauses planifiées (10–15 min) + rappels. | **Activée** : lecture et suppression réservées à l’hôte de la room ou aux membres actifs. | Colonne `invitees` (JSON) = liste anonymisée (id interne ou email). |
| `social_room_events` | Journaux anonymisés (create/join/leave). | **Activée** : insertion libre par edge function, lecture réservée à l’équipe support. | `room_ref` = hash tronqué, aucune donnée personnelle. |
| `quiet_hours_settings` | Quiet hours B2B (start/end UTC). | **Activée** : lecture limitée aux comptes de l’organisation. | Utilisé pour bloquer les rappels pendant les plages silencieuses. |
| `assessment_summaries` | Résumés anonymisés MSPSS. | **Activée** : lecture autorisée uniquement si le membre a opté pour MSPSS. | Jamais affiché tel quel dans l’UI (utilisé pour prioriser le CTA). |

## Rôles & flux

* **Host** : crée la room (`social:create`), gère les invitations, peut activer le mode très doux (mute auto-FX, latence tolérante) et fermer la session en douceur.
* **Guest** : rejoint via lien interne (non public) ou invitation. Peut quitter à tout moment via le bouton « quitter en douceur ».
* **Edge function `social-cocon-invite`** : envoie les invitations (Resend/email ou notification in-app) et loggue l’événement.
* **Edge function `social-cocon-log` (optionnelle)** : centralise l’écriture dans `social_room_events` si l’on souhaite éviter toute exposition directe du client.

## Quiet hours & rappels

* `quiet_hours_settings.start_utc` et `end_utc` sont stockés en UTC (`HH:mm`).
* Le client vérifie systématiquement que le créneau choisi n’empiète pas sur les quiet hours avant d’insérer dans `social_room_breaks`.
* Les rappels (10 minutes avant) respectent également ces quiet hours (si le rappel tombe pendant la plage silencieuse, il n’est pas déclenché).

## Observabilité

* Breadcrumbs Sentry :
  * `social:create` lors de la création d’une room.
  * `social:join` (et `social:leave` côté client) pour suivre les sessions.
* Tag `mspss_hint_used` positionné à `true` lorsque l’utilisateur clique sur une suggestion de créneau déclenchée par un score MSPSS bas.
* `social_room_events` conserve uniquement des identifiants hashés (SHA-256 tronqué) pour éviter toute donnée personnelle.

## Anti-lien public

* `invite_code` est uniquement valide pour des liens internes (`/app/social-cocon?room=<code>`). Aucune URL publique n’est générée.
* RLS bloque toute lecture d’une room sans appartenance au groupe correspondant.
* Les invitations email utilisent Resend avec un lien authentifié (session Supabase requise) et expirent après usage.

## Notes de mise en production

* Limiter la durée des captures audio à 5 minutes ; ne stocker que `duration_seconds`, `started_at` et `ended_at` dans Supabase.
* Répliquer les policies RLS en staging + tests unitaires via `supabase/tests` pour garantir qu’un membre ne peut pas lire une room dont il n’est pas partie prenante.
* Edge functions doivent valider l’opt-in MSPSS avant toute priorisation du CTA côté API.
* Prévoir des métriques (dashboard observability) sur `social_room_events` (taux de création, ratio host/guest, usage mode doux).
