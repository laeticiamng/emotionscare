# Journalisation de la sélection de mode

Les sélections de mode utilisateur sont enregistrées de manière anonymisée.

- **Emplacement** : les événements sont envoyés via `src/utils/modeSelectionLogger.ts`.
- **Structure** : chaque log contient:
  - `mode` : identifiant du mode choisi (`b2c`, `b2b_user`, `b2b_admin`, ...)
  - `timestamp` : date ISO de la sélection.

Les événements sont transmis à l'API d'analytics configurée (voir `Analytics.setProvider`) uniquement si la préférence
`privacy.analytics` est activée dans les préférences utilisateur.
Les autres modules peuvent écouter le changement de mode via `modeEmitter` pour déclencher un onboarding ou des offres
contextuelles.
