# Dashboard RH/Admin - Rapport Technique

Ce document synthétise l'architecture du tableau de bord RH et les points clés de l'audit.
Il complète `dashboard-rh-audit.md` et `dashboard-rh-flow.md`.

## Accès et rôles

- La route `/b2b/admin/dashboard` est protégée par `ProtectedRoute`.
- Seuls les utilisateurs avec le rôle `b2b_admin` ou `admin` peuvent accéder aux pages administratives.
- Le mapping rôle → accès est centralisé dans `src/router/AppRoutes.tsx`.

## Agrégation et anonymisation

- Les analytics d'équipe sont récupérées via `fetchTeamAnalytics` dans `src/services/teamAnalyticsService.ts`.
- Les structures de données sont typées dans `types/analytics.ts` et `types/dashboard.ts`.
- Aucune donnée nominative n'est retournée par `TeamAnalytics` : les identifiants utilisateurs sont anonymisés.
- Les statistiques ne doivent pas être générées lorsque l'échantillon est inférieur à cinq collaborateurs.

## Journalisation et conformité RGPD

- Le type `AdminAccessLog` décrit les informations à stocker pour tracer chaque consultation.
- Un provider dédié pourra persister ces logs dans Supabase et permettre l'export ou la suppression sur demande.

## Extension et modularité

- Les KPIs du dashboard sont modélisés via `KpiCardProps` et `DashboardWidgetConfig`.
- L'ajout de nouveaux indicateurs se fait via des services et hooks indépendants de la UI.

## Tests recommandés

- Tests unitaires pour `fetchTeamAnalytics` et les fonctions d'anonymisation.
- Tests end‑to‑end vérifiant que l'accès au dashboard est refusé aux rôles non autorisés.

