
# Audit du Dashboard RH/Admin

Ce document résume l'analyse technique du tableau de bord RH et propose des pistes de refactorisation.

## Points clés analysés

- **Gestion des accès** : `ProtectedRoute` vérifie correctement l'authentification et le rôle `b2b_admin` pour toutes les pages sous `/b2b/admin`.
- **Agrégation et anonymisation** : la logique d'agrégation est dispersée dans plusieurs composants. Les données émotionnelles sont importées sans toujours passer par un service dédié d'anonymisation.
- **Typage** : les types liés aux KPI et aux analytics sont partiellement définis dans `src/types/dashboard.ts` mais ne couvrent pas toutes les métriques.

## Correctifs proposés

1. **Centralisation du typage**
   - Créer les fichiers `types/dashboard.ts` et `types/analytics.ts` à la racine pour exposer toutes les interfaces du dashboard RH.
   - Mettre à jour l'index des types (`src/types.ts`) pour les réexporter.
2. **Séparation de la logique métier**
   - Extraire l'agrégation et l'anonymisation des données vers des services ou hooks dédiés (`useTeamAnalytics`, `analyticsService`).
   - Prévoir une option d'anonymisation systématique et le contrôle du seuil minimal (≥ 5 personnes) pour les rapports.
3. **Traçabilité et RGPD**
   - Ajouter un journal d'accès administrateur (audit log) conservé côté serveur.
   - Prévoir la suppression à la demande des données agrégées.
4. **Tests recommandés**
   - Tests unitaires sur les fonctions d'anonymisation et d'agrégation.
   - Tests end‑to‑end vérifiant l'accès au dashboard RH selon le rôle.

## Éléments à valider

- Mapping rôle ↔ accès pour chaque route admin.
- Conformité RGPD du module analytics.
- Possibilité d'étendre les KPI (ex. intégration IA future).
