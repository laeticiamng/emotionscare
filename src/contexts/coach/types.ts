
import { ChatMessage, ChatConversation } from '@/types/chat';
import { EmotionResult } from '@/types/emotion';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  isProcessing: boolean;
  loading?: boolean;
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  activeConversationId?: string | null;
  sendMessage: (
    content: string,
    sender?: 'user' | 'assistant' | 'system' | 'coach'
  ) => Promise<string>;
  clearMessages: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  toggleChat?: () => void;
  characterName?: string;
  characterImage?: string;
  characterRole?: string;
  currentEmotion?: string | null;
  lastEmotion?: string | null;
  emotionHistory?: EmotionResult[];
  addMessage?: (message: Omit<ChatMessage, 'id'>) => void;
  startNewConversation?: (title?: string) => string;
  setActiveConversation?: (id: string) => void;
  updateLastEmotion?: (emotion: string) => void;
}
