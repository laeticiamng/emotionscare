# Schéma des tables Scan XR

Ce document décrit les tables créées pour les widgets temps-réel **Aura-Ink Live**, **Mirror-Glimmer Filter** et **Whisper-Morph Gif**. Chaque ligne correspond à une session utilisateur et des triggers PL/pgSQL calculent immédiatement certains indicateurs.

```mermaid
erDiagram
    scan_face {
        uuid id PK
        text user_id_hash
        timestamptz ts
        int duration_s
        real[] valence_series
        real[] arousal_series
        real valence_avg
        real arousal_sd
        text img_url
        boolean share_bool
    }
    scan_glimmer {
        uuid id PK
        text user_id_hash
        timestamptz ts
        real[] joy_series
        int delay_ms
        real joy_avg
        text gif_url
        boolean share_bool
    }
    scan_voice {
        uuid id PK
        text user_id_hash
        timestamptz ts
        text word
        real valence_voice
        real arousal_voice
        real vad_valence
        real lex_sentiment
        int expressive_len
        text mp4_url
        boolean share_bool
    }
```

Les politiques RLS restreignent l'accès à chaque utilisateur via `user_id_hash`. Les fonctions `calc_scan_face`, `calc_scan_glimmer` et `calc_scan_voice` mettent à jour les colonnes dérivées avant insertion.
