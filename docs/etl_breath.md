# ETL Breathwork

Ces vues matérialisées consolident les exercices **Flow‑Field Walk** et **Glow‑Pulse Mug** de manière hebdomadaire.

```mermaid
flowchart TD
    A[flow_walk] --> C(metrics_weekly_breath)
    B[glow_mug] --> C
    C --> D(metrics_weekly_breath_org)
```

```mermaid
sequenceDiagram
    participant Cron
    participant DB
    Cron->>DB: CALL refresh_metrics_breath()
    DB-->>Cron: refresh done
```

La fonction `refresh_metrics_breath()` est planifiée chaque nuit via **pg_cron**.
