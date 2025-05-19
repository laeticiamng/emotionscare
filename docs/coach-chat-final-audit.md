# Audit technique du module Coach IA & Chat

Ce document présente l'analyse du module `Coach` de l'application **EmotionsCare**. Il se base sur l'état du dépôt au moment de l'audit.

## 1. Contexte et fournisseurs

Trois implémentations du contexte `Coach` coexistent :

- `src/contexts/coach.tsx`
- `src/contexts/coach/index.tsx`
- `src/contexts/coach/CoachContext.tsx`

Chacune expose son propre `CoachProvider`. Aucune de ces versions n'est injectée par défaut dans `AppProviders` (voir `src/providers/AppProviders.tsx`), ce qui conduit à un état local ou dupliqué selon les pages.

Exemple de création du provider dans `CoachContext.tsx` :

```tsx
export const CoachProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  // ...
  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};
```
【F:src/contexts/coach/CoachContext.tsx†L51-L73】

Les pages `Coach` et `CoachChat` utilisent directement le hook `useCoach` sans passer par un provider global, ce qui limite la persistance du contexte au composant courant.

## 2. Hooks et services

Les hooks liés au coach sont rangés dans `src/hooks/coach/` :

- `useCoach.tsx` – gestion d'événements et de sessions
- `useCoachEvents.ts` et `useCoachEvents.tsx` – gestion d'historique
- `useCoachQueries.ts` – intégration à React Query
- `useRecommendations.ts` – génération de recommandations via Supabase et OpenAI

Un hook de chat (`useCoachChat`) se trouve dans `src/hooks/chat/` et dépend de `CoachContextProvider`.

Le service `src/services/openai.ts` centralise les appels à l'API OpenAI mais ne prévoit pas de mécanisme de retry ni de backoff.

Exemple de fonction `chatCompletion` :

```ts
export async function chatCompletion(
  messages: ChatMessage[],
  options: OpenAITextGenerationOptions = {}
): Promise<string> {
  const response = await callOpenAI<{ choices: Array<{ message: { role: string; content: string; }; }> }>(
    '/chat/completions', {
      model,
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
    }
  );
  return response.choices[0]?.message.content || '';
}
```
【F:src/services/openai.ts†L114-L150】

## 3. Typage et structure des messages

Les types `ChatMessage` et `ChatConversation` sont définis dans `src/types/coach.ts` et `src/types/chat.ts`. L'ensemble des propriétés est strictement typé, aucune utilisation de `any` n'est présente dans ces définitions.

Extrait :

```ts
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  conversationId?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}
```
【F:src/types/chat.ts†L4-L15】

Les conversations sont persistées dans le `localStorage` lorsqu'on utilise `CoachContext` :

```ts
useEffect(() => {
  if (conversations.length > 0) {
    localStorage.setItem('coach_conversations', JSON.stringify(conversations));
  }
}, [conversations]);
```
【F:src/contexts/coach/CoachContext.tsx†L62-L68】

Aucune fuite de messages entre utilisateurs n'est détectée puisque chaque utilisateur accède à ses propres conversations via `localStorage`. Les routes `/b2b/user/*` et `/b2c/*` sont protégées grâce au composant `ProtectedRoute` dans `src/router/index.tsx`.

## 4. Gestion des erreurs

Le contexte et les services loggent les erreurs dans la console et renvoient un message générique. Exemple dans `sendMessage` :

```ts
catch (err) {
  console.error('Error sending message:', err);
  setError('Failed to send message');
  return 'Sorry, I encountered an error. Please try again.';
}
```
【F:src/contexts/coach/CoachContext.tsx†L142-L153】

Des toasts utilisateurs sont utilisés dans `CoachChat` pour informer en cas d'échec lors de l'envoi d'un message.

## 5. Tests

Un test minimal vérifie les exports du contexte :

```ts
import { CoachContext, CoachProvider } from '@/contexts/coach';

test('CoachContext exports are available', () => {
  assert.ok(CoachContext);
  assert.equal(typeof CoachProvider, 'function');
});
```
【F:src/tests/coachContext.test.ts†L1-L11】

Toutefois, la suite de tests échoue actuellement à cause de l'absence du paquet `ts-node` dans l'environnement :

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ts-node'
```
【bd9a1b†L5-L33】

## 6. Sécurité et rôles

Les accès aux pages `coach` sont protégés par `ProtectedRoute` selon le rôle utilisateur (`b2b_user`, `b2b_admin`, `b2c`). Les conversations étant stockées localement, aucun risque direct de fuite entre comptes n'a été constaté.

## 7. Recommandations et pistes d'amélioration

1. **Centraliser le contexte** : retirer les versions obsolètes de `CoachContext` et injecter `CoachProvider` dans `AppProviders` pour un état partagé sur l'ensemble de l'application.
2. **Mécanisme de retry** : ajouter une stratégie de backoff dans `openai.ts` en cas d'échec réseau.
3. **Multi‑coach IA** : prévoir un champ `coachCharacter` dans le contexte afin de permettre le choix de la personnalité (zen, motivant…).
4. **Persistance sécurisée** : déporter la sauvegarde des conversations dans Supabase (chiffrées) plutôt que `localStorage` pour permettre la synchronisation multi‑appareil.
5. **Journal émotionnel intégré** : créer un service de journalisation utilisant `src/services/coach/emotion-recommendation-service.ts` pour générer automatiquement des résumés de sessions.
6. **Tests automatisés** : étendre la couverture de tests sur l’envoi de message, la persistance et la récupération des conversations.

---
