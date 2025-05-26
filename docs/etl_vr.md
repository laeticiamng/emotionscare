# ETL VR Weekly Views

Ces vues matérialisées consolident les sessions **Bio‑Nebula** et **Glow‑Collective** sur une base hebdomadaire.

```mermaid
flowchart TD
    A[vr_nebula_sessions] --> C(metrics_weekly_vr)
    B[vr_dome_sessions] --> D(metrics_weekly_vr_org)
    C --> D
```

La procédure `refresh_metrics_vr()` rafraîchit ces vues et est exécutée chaque nuit via **pg_cron**.
