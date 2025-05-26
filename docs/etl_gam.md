# ETL Gamification

Ces vues matérialisées agrègent les tables `echo_crystal`, `bb_chain` et `neon_challenge` de façon hebdomadaire.

```mermaid
flowchart TD
    A[echo_crystal] --> C(metrics_weekly_gam)
    B[bb_chain] --> C
    D[neon_challenge] --> C
    C --> E(metrics_weekly_gam_org)
```

La fonction `refresh_metrics_gam()` met à jour ces vues et est déclenchée chaque nuit via **pg_cron**.
