# Audit du module Coach IA & Chat

Ce document résume la structure actuelle du contexte `Coach` et les recommandations principales pour assurer sa robustesse et son extensibilité.

## Contexte global
- **CoachContext** centralise les conversations, le personnage du coach et l'état de saisie.
- Les appels à l'IA sont délégués à `useCoachHandlers` puis au service `openai`.
- Les conversations sont persistées via `useLocalStorage`.

## API du contexte
```ts
interface CoachContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isTyping: boolean;
  loadingMessage: string | null;
  coachCharacter: {
    name: string;
    avatar: string;
    personality: string;
    expertise: string[];
  };
  sendMessage(content: string): Promise<void>;
  startNewConversation(): void;
  selectConversation(id: string): void;
  renameConversation(id: string, title: string): void;
  deleteConversation(id: string): void;
  setCoachCharacter(character: CoachContextType['coachCharacter']): void;
  getRecommendations(category: string): string[];
  analyzeEmotion(text: string): Promise<{ emotion: string; score: number }>;
}
```

## Flux principal
1. L'utilisateur envoie un texte via `sendMessage`.
2. `useCoachHandlers` orchestre l'appel à l'API OpenAI (`chatCompletion` et `analyzeEmotion`).
3. La réponse est injectée dans la conversation et l'état `isTyping` est mis à jour.

## Recommandations
- Supprimer les doublons de contexte (`contexts/coach.tsx`, `index.tsx`), ne conserver qu'une version.
- Regrouper les types dans `src/types/coach.ts` et `src/types/chat.ts` (fait dans cette PR).
- Ajouter des tests unitaires sur `sendMessage` et le service OpenAI.
- Prévoir un mécanisme de retry côté service en cas d'échec réseau.

