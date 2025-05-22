# Couverture des tests E2E

Ce document liste les workflows vérifiés par les tests end‑to‑end situés dans `src/e2e`.

## Dashboards

- **Particulier (`/b2c/*`)**
  - Accès protégé via `ProtectedRoute` avec rôle `b2c`.
  - Présence des modules : dashboard, journal, scan, music, coach, coach-chat, vr, preferences, settings, cocon, social-cocon, gamification.

- **Collaborateur (`/b2b/user/*`)**
  - Accès protégé via `ProtectedRoute` avec rôle `b2b_user`.
  - Modules vérifiés : dashboard, journal, scan, music, coach, vr, preferences, settings, cocon, social-cocon, gamification.

- **Admin (`/b2b/admin/*`)**
  - Accès protégé via `ProtectedRoute` avec rôle `b2b_admin`.
  - Modules vérifiés : dashboard, journal, scan, music, teams, reports, events, social-cocon, optimisation, settings.

## Fonctions Supabase

Les tests vérifient que chaque fonction utilise `authorizeRole` avec les rôles attendus :

- `analyze-journal`
- `assistant-api`
- `process-emotion-gamification`
- `enhanced-emotion-analyze`
- `coach-ai`
- `monitor-api-usage`
- `team-management`

Chaque fichier est lu et doit contenir l'appel à `authorizeRole` ainsi que tous les rôles autorisés.

## Rapport

Les résultats des tests sont générés dans `reports/e2e-report.json` via la commande :

```bash
npm run test:e2e
```
