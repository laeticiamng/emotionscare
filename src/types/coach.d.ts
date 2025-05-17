
import { EmotionResult } from './types';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach' | 'system';
  timestamp: string;
  role?: string;
  text?: string;
  conversation_id?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CoachContextType {
  messages: ChatMessage[];
  isProcessing: boolean;
  isTyping: boolean;
  conversations: { id: string; title: string }[];
  activeConversationId: string | null;
  lastEmotion: string | null;
  emotionHistory: EmotionResult[];
  currentEmotion: string | null;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
  startNewConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  updateLastEmotion: (emotion: string) => void;
  sendMessage: (content: string, sender: 'user' | 'coach' | 'system') => Promise<void>;
}
