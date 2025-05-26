# Schéma des widgets bruts

Ce fichier décrit les tables créées pour collecter les données des nouveaux widgets **Instant Glow**, **Bubble-Beat Preview** et **Quick Silk Wallpaper**. Chaque table applique un RLS pour restreindre la lecture aux utilisateurs concernés et calcule certains indicateurs via des triggers.

| Table | Description |
|-------|-------------|
| `micro_breaks` | Données issues du widget Instant Glow avec delta HRV `rmssd_delta`. |
| `bubble_sessions` | Sessions Bubble‑Beat avec indices `breath_idx` et `joy_idx`. |
| `silk_wallpaper` | Mesures du widget Silk Wallpaper avec calcul `hr_drop`. |

Les migrations associées se trouvent dans `supabase/migrations/`.
