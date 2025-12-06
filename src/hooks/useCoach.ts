/**
 * Barrel export pour tous les hooks du coach
 */

export { useCoachState } from './useCoachState';
export type { CoachState, UseCoachStateReturn } from './useCoachState';

export { useCoachConversations } from './useCoachConversations';
export type {
  ConversationMessage,
  Conversation,
  UseCoachConversationsReturn,
} from './useCoachConversations';
