# Music Raw Tables

Ce module ajoute deux tables pour stocker les sessions des widgets **BioTune** et **Neon-Route Walk**.
Les valeurs calculées sont générées via des triggers avant l'insert.

## biotune_sessions
- **rmssd_delta** : différence entre `hrv_post` et `hrv_pre`.
- **coherence** : 100 moins 5 points par battement d'écart entre `bpm_target` et la fréquence cardiaque finale (borné entre 0 et 100).

## neon_walk_sessions
- **mvpa_min** : estimation des minutes d'activité modérée à soutenue calculée à partir du nombre de pas et de la cadence moyenne.

Les politiques RLS limitent la lecture et l'écriture à l'utilisateur propriétaire via le claim `user_hash` du JWT.
