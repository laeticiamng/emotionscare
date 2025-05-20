# Audit Technique - Assistance & Support

Ce rapport décrit l'architecture d'assistance actuellement en place et liste les améliorations nécessaires pour atteindre un support « ultra-premium ».

## Contexte global

- `SupportProvider` est injecté dans `AppProviders` (hiérarchie détaillée dans `docs/shell-layout-point4-audit.md`).
- `SupportContext` expose `sendMessage`, `messages` et `clearHistory`.
- Les types (`Message`, `ChatResponse`, `SupportHistory`) sont définis dans `src/types/support.ts`.
- Le service `getSupportResponse` simule l'API dans `src/services/chatService.ts`.
- Les modules UI comprennent `SupportDrawer`, `PremiumSupportAssistant`, `HelpCenter` et `IncidentPortal`.

## Points vérifiés

1. **Centralisation** : la logique support est regroupée dans `SupportContext` et accessible dans toute l'application via `SupportProvider`.
2. **Typage strict** : aucun `any` dans les définitions de `support.ts`.
3. **Hooks** : le hook `useSupport` est exporté depuis `src/contexts/index.ts`.
4. **Persistance** : aucune sauvegarde en base pour l'instant ; l'historique n'est conservé qu'en mémoire.
5. **Accès et rôles** : seule la présence du `AuthProvider` restreint indirectement l'accès au `SupportDrawer` sur les pages protégées.
6. **Journalisation** : pas de logs d'audit ni de suivi RGPD à ce stade.
7. **Tests** : aucun test unitaire n'existe pour `SupportContext` ou `chat-with-ai`.

## Correctifs appliqués

- Ajout de l'export `SupportProvider` et `useSupport` dans `src/contexts/index.ts` pour permettre l'import simplifié des hooks.

## Recommandations prioritaires

1. Persister les tickets et messages via Supabase (tables dédiées) et suivre leur statut.
2. Implémenter des logs d'audit (création de ticket, délai de réponse, satisfaction).
3. Ajouter des tests unitaires sur `SupportContext` et la fonction serveur `chat-with-ai`.
4. Préparer l'anonymisation/effacement des données pour la conformité RGPD.
5. Étendre `HelpCenter` avec une base de connaissance dynamique et un chatbot empathique.

