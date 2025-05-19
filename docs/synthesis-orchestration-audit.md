# Audit du module "Synthèse 360°" et orchestration intelligente

Ce document analyse la mise en place actuelle de la synthèse émotionnelle globale et l'orchestration des données entre les modules `/timeline`, `/world` et `/sanctuary`.

## 1. Centralisation des contextes

- `AppProviders` injecte les contextes globaux dans l'ordre suivant : `ThemeProvider`, `AuthProvider`, `UserPreferencesProvider`, `UserModeProvider`, `MusicProvider`, `OptimizationProvider`, `ExtensionsProvider`, `OrchestrationProvider`.
- Les contextes de prédiction et d'orchestration (`PredictiveAnalyticsContext`, `OrchestrationContext`) permettent de stocker les événements émotionnels et les recommandations IA.
- Les types des événements (`MoodEvent`, `Prediction`) sont définis directement dans leurs fichiers de contexte (`src/contexts/OrchestrationContext.tsx`, `src/contexts/PredictiveAnalyticsContext.tsx`).

## 2. Utilisation par les modules

- La page `/timeline` consomme `useOrchestration` pour lister les événements enregistrés.
- Les pages `/world` et `/sanctuary` sont actuellement des placeholders et n'utilisent pas encore ces contextes.
- Les widgets d'analytics et de météo émotionnelle utilisent les services dédiés mais ne sont pas encore reliés à l'`OrchestrationContext`.

## 3. Typage et structure

- Les types globaux sont dispersés : certains dans `src/types`, d'autres dans les fichiers des contextes. Il n'existe pas encore de fichier unique `types/global.ts` pour centraliser toutes les entités partagées.
- Le contexte d'orchestration expose l'interface `MoodEvent` comprenant `id`, `timestamp`, `mood` et `source`.
- Les prédictions IA sont typées via `Prediction` et `PredictionRecommendation` dans `PredictiveAnalyticsContext.tsx`.

## 4. Flux d'événements

- Aucune implémentation de bus d'événements global n'est présente. Chaque contexte gère son propre état local.
- Les événements d'humeur sont ajoutés via `addEvent` dans `OrchestrationContext` mais ne déclenchent pas encore de mises à jour dans d'autres modules (musique, météo, coach...).

## 5. Sécurité et accès

- Les routes sensibles sont protégées via `ProtectedRoute` et listées dans `docs/PROTECTED_ROUTES.md`.
- Les pages de synthèse sont accessibles uniquement après authentification si nécessaire, mais la granularité par rôle n'est pas encore définie pour `/timeline`, `/world` ou `/sanctuary`.
- Les données collectives (ex. `TeamAnalytics`) sont anonymisées dans le service `teamAnalyticsService.ts` mais la politique RGPD reste à affiner.

## 6. État des tests

- `npm run type-check` s'exécute sans erreur.
- `npm test` échoue actuellement : les suites `src/tests/env.test.js` et `src/tests/global.test.js` ne trouvent pas le package `ts-node`.

```text
TAP version 13
# node:internal/modules/run_main:122
#     triggerUncaughtException(
#     ^
# Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ts-node' imported from /workspace/emotionscare/
...
not ok 1 - src/tests/env.test.js
...
not ok 2 - src/tests/global.test.js
...
# fail 2
```

## 7. Recommandations principales

1. **GlobalContextProvider** : créer un fichier `src/providers/GlobalContextProvider.tsx` regroupant `PredictiveAnalyticsProvider` et `OrchestrationProvider` pour centraliser la récupération et la distribution des données transverses.
2. **EventBus** : mettre en place un bus d'événements ou utiliser un store (Zustand/Redux Toolkit) pour permettre la synchronisation instantanée entre les modules (ex. changement d'émotion ⇒ mise à jour de la musique, de la météo et du coach).
3. **Centralisation du typage** : créer `src/types/global.ts` pour définir `MoodEvent`, `Prediction`, `AnalyticsEvent`, etc., puis réexporter via `src/types/index.ts`.
4. **Connexion des widgets** : faire consommer `useOrchestration` et `usePredictiveAnalytics` dans `/world` et `/sanctuary` afin d'afficher des synthèses évolutives et partagées.
5. **Gestion des droits** : définir des niveaux d'accès (user, admin, RH) pour chaque route de synthèse et appliquer l'anonymisation des données collectives.
6. **Tests automatisés** : ajouter des tests unitaires pour `OrchestrationContext` et `PredictiveAnalyticsContext`, ainsi qu'une intégration vérifiant la propagation des événements via l'EventBus.

---

Ce rapport constitue le **point 9** de l'audit complet. Les recommandations précédentes se trouvent dans `docs/audit-modules-1-8-summary.md`.
