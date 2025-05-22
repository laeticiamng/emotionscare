# Journalisation centralisée

Ce projet utilise désormais un module `logAccess` pour tracer tous les accès aux fonctions Edge sensibles. Le helper se trouve dans `supabase/functions/_shared/logging.ts` et écrit dans la table `audit_logs`.

Chaque enregistrement contient :

- `timestamp` : date ISO
- `user_id` : identifiant de l'utilisateur ou `null`
- `role` : rôle Supabase lorsqu'il est connu
- `route` : chemin appelé
- `action` : type d'action (ex. `access`, `send_invitation`)
- `result` : `success`, `denied` ou `error`
- `ip_address` et `user_agent`
- `details` optionnel

L'appel à `authorizeRole` journalise automatiquement les succès. Les refus sont historisés via `logUnauthorizedAccess`.

Pour consulter les logs, interroger simplement la table `audit_logs` depuis le tableau de bord Supabase ou via une fonction d'export.
