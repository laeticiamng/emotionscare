# Audit technique du module Coach IA (v2)

Cette mise à jour consolide la logique du chat autour d'un **unique contexte**
`CoachContextProvider`. Toutes les routes `/coach` et `/coach-chat` utilisent
maintenant ce provider global via `AppProviders`.

## Points clés
- Suppression des anciennes implémentations `src/contexts/coach.tsx` et
  `src/contexts/coach/index.tsx`.
- Export unifié dans `src/contexts/coach/index.ts`.
- Ajout de handlers par défaut (`sendMessageHandler`, `analyzeEmotionHandler`,
  `getRecommendationsHandler`) dans `src/services/coach/defaultCoachHandlers.ts`.
- `AppProviders` instancie désormais `CoachContextProvider` afin que tout
  composant puisse accéder au chat IA.

## Tests
- `src/tests/coachContext.test.ts` vérifie la présence de `CoachContext` et
  `CoachProvider`.
- Les commandes `npm test` et `npm run typecheck` passent sans erreur (voir
  section Testing du PR).

## Recommandations futures
- Implémenter un stockage persistant (Supabase) pour les conversations.
- Ajouter un véritable système de retry/exponential backoff dans le service
  OpenAI.
- Couvrir les différentes personnalités de coach via un système de plug-ins.
