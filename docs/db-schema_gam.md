# Schéma des tables Gamification

Ce document décrit les tables **Echo-Crystal NFT**, **Bubble-Beat Chain Badge** et **Neon-Route Challenge** utilisées pour stocker les sessions brutes. Des triggers PL/pgSQL calculent immédiatement certains indicateurs.

```mermaid
erDiagram
    echo_crystal {
        uuid id PK
        text user_id_hash
        timestamptz ts
        real joy_idx
        real arousal_voice
        real laugh_db
        real laugh_pitch
        text crystal_type
        char(7) color_hex
        real sparkle_level
        text mesh_url
        boolean minted_bool
        real pos_affect
        boolean genuine_flag
    }
    bb_chain {
        uuid id PK
        text user_id_hash
        timestamptz ts
        uuid parent_id
        int depth
        int share_count
    }
    neon_challenge {
        uuid id PK
        text user_id_hash
        timestamptz ts
        int steps
        real km
        real joy_idx
        real mvpa_min
        boolean streak_flag
    }
```

Les politiques RLS restreignent l'accès via `user_id_hash`. Les fonctions `calc_echo_metrics`, `calc_bb_depth` et `calc_nc_metrics` pré-remplissent respectivement `pos_affect`, `genuine_flag`, `depth`, `mvpa_min` et `streak_flag` avant insertion.
