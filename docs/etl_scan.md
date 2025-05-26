# Scan ETL Weekly Views

Ces vues agrègent les données issues des tables `scan_face`, `scan_glimmer` et `scan_voice` par semaine.
Elles alimentent les KPI de l’application B2C ainsi que les rapports RH côté B2B.

```mermaid
erDiagram
    metrics_weekly_scan {
        text user_id_hash PK
        date week_start PK
        real valence_face_avg
        real arousal_sd_face
        real joy_face_avg
        real valence_voice_avg
        real lexical_sentiment_avg
        int  n_face_sessions
        int  n_voice_sessions
    }
    metrics_weekly_scan_org {
        int  org_id PK
        date week_start PK
        int  members
        real org_valence_face
        real org_arousal_sd
        real org_joy_face
        real org_valence_voice
        real org_lexical_sentiment
    }
```

La fonction `refresh_metrics_scan()` réactualise ces vues et est planifiée chaque nuit via **pg_cron**.
