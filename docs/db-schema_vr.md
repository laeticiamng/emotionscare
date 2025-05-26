# Schéma des tables VR Raw

Ce document décrit les tables **vr_nebula_sessions** et **vr_dome_sessions** utilisées pour collecter les événements des espaces immersifs Bio‑Nebula et Glow‑Collective Dome. Les indicateurs scientifiques sont calculés via des triggers PL/pgSQL avant chaque insertion et les politiques RLS restreignent l'accès via `user_id_hash`.

```mermaid
erDiagram
    vr_nebula_sessions {
        uuid id PK
        text user_id_hash
        timestamptz ts_start
        int duration_s
        real resp_rate_avg
        int hrv_pre
        int hrv_post
        int rmssd_delta
        real coherence_score
        text client
    }
    vr_dome_sessions {
        uuid id PK
        uuid session_id
        text user_id_hash
        timestamptz ts_join
        timestamptz ts_leave
        real hr_mean
        real hr_std
        real valence_avg
        real group_sync_idx
        real team_pa
    }
```

- **rmssd_delta** : différence entre `hrv_post` et `hrv_pre`.
- **coherence_score** : 100 pts si la respiration moyenne est de 5–6 rpm, -10 pts par rpm d'écart.
- **group_sync_idx** : écart-type des `hr_mean` des participants au moment du départ.
- **team_pa** : valence moyenne du groupe lors du départ.
