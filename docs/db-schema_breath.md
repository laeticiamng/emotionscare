# Schéma des tables Breathwork

Ce document décrit les tables **flow_walk** et **glow_mug** utilisées pour les rituels Flow‑Field Walk et Glow‑Pulse Mug. Des triggers PL/pgSQL calculent les indicateurs dérivés et les politiques RLS restreignent l'accès aux utilisateurs concernés.

```mermaid
erDiagram
    flow_walk {
        uuid id PK
        text user_id_hash
        timestamptz ts
        int steps
        int cadence_spm
        real breath_rate_rpm
        real coherence_pct
        int hrv_pre
        int hrv_post
        int rmssd_delta
        real mvpa_min
        int duration_s
    }
    glow_mug {
        uuid id PK
        text user_id_hash
        timestamptz ts
        real hr_drop_bpm
        int hr_pre
        int hr_post
        int calm_score
        real sms1
        text mood_emoji
    }
```

Les triggers `calc_flow_walk` et `calc_glow_mug` remplissent respectivement `coherence_pct`, `rmssd_delta`, `mvpa_min`, `hr_drop_bpm` et `sms1` avant insertion. Les politiques RLS utilisent le claim `user_hash` du JWT pour filtrer les lignes.
