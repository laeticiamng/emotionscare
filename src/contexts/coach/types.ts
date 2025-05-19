
import { ChatMessage, ChatConversation } from '@/types/chat';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  isProcessing: boolean;
  loading?: boolean;
  conversations?: ChatConversation[];
  currentConversation?: ChatConversation | null;
  sendMessage: (content: string, sender?: 'user' | 'coach' | 'assistant' | 'system') => Promise<string>;
  clearMessages: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  toggleChat?: () => void;
  characterName?: string;
  characterImage?: string;
  characterRole?: string;
  currentEmotion?: string | null;
}
