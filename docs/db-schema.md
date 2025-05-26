# Schéma des widgets bruts

Ce fichier décrit les tables créées pour collecter les données des nouveaux widgets **Instant Glow**, **Bubble-Beat Preview** et **Quick Silk Wallpaper**. Chaque table applique un RLS pour restreindre la lecture aux utilisateurs concernés et calcule certains indicateurs via des triggers.

| Table | Description |
|-------|-------------|
| `micro_breaks` | Données issues du widget Instant Glow avec delta HRV `rmssd_delta`. |
| `bubble_sessions` | Sessions Bubble‑Beat avec indices `breath_idx` et `joy_idx`. |
| `silk_wallpaper` | Mesures du widget Silk Wallpaper avec calcul `hr_drop`. |

Les migrations associées se trouvent dans `supabase/migrations/`.

# Schéma des widgets santé

Les tables suivantes collectent les données brutes des nouveaux widgets et calculent certains indicateurs via des triggers PL/pgSQL.

## micro_breaks
- **id** : identifiant unique
- **user_id_hash** : hash utilisateur
- **ts** : horodatage de l'insertion
- **hr_pre** / **hr_post** : fréquence cardiaque avant/après pause
- **rmssd_delta** : différence de HRV calculée par le trigger
- **valence_pre** / **valence_post** : valence ressentie
- **pss1** : item 1 de l'échelle PSS‑10

## bubble_sessions
- **bpm** : fréquence de respiration
- **smile_amp** : amplitude du sourire
- **hr_sdnn** : SDNN sur 15 s
- **breath_idx** : 6 – BPM (calculé)
- **joy_idx** : amplitude du sourire (copiée)
- **panas_pa** : score PANAS PA

## silk_wallpaper
- **hr_1min** : FC après 1 min
- **tap_len_ms** : durée du tap
- **sms1** : score SMS‑1
- **hr_drop** : différence avec la ligne de base (0 pour l'instant)

Les politiques RLS permettent uniquement la lecture des lignes appartenant à l'utilisateur courant (mode développement). Les triggers `calc_micro_break`, `calc_bubble_metrics` et `calc_silk_metrics` réalisent les calculs décrits dans le ticket.
