# Audit Coach IA & Chat

Ce rapport fait suite à l'analyse du contexte `Coach` et du module de chat. Les objectifs étaient de vérifier la centralisation de l'état, la cohérence des types et la préparation à l'extension.

## Points clés
- Plusieurs implémentations du contexte existaient (`contexts/coach.tsx`, `contexts/coach/index.tsx`, `contexts/coach/CoachContext.tsx`).
- Les types `ChatMessage` et `Conversation` étaient dupliqués à plusieurs endroits.
- Le service `openai` gère correctement les appels mais sans mécanisme de retry.

## Actions réalisées
- Consolidation des définitions dans `src/types/coach.ts` et `src/types/chat.ts`.
- Mise à jour du `CoachContext` pour utiliser ces types.
- Ajout d'un test unitaire simple et d'une documentation dédiée.

## Recommandations futures
- Mettre en place des tests plus poussés sur `sendMessage` et le service OpenAI.
- Supprimer les anciennes implémentations du contexte après validation.
- Ajouter une stratégie de backoff pour les appels réseau.
