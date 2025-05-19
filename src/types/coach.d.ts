
import { EmotionResult } from './types';
import type { ChatMessage, ChatConversation as Conversation } from './chat';
export type { ChatMessage, Conversation };

export interface CoachContextType {
  messages: ChatMessage[];
  isProcessing: boolean;
  isTyping: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  currentConversation: Conversation | null;
  lastEmotion: string | null;
  emotionHistory: EmotionResult[];
  currentEmotion: string | null;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
  startNewConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  updateLastEmotion: (emotion: string) => void;
  sendMessage: (content: string, sender: 'user' | 'assistant' | 'system' | 'coach') => Promise<void>;
}
