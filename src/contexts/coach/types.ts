
import { ChatMessage, ChatConversation } from '@/types/chat';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  isProcessing: boolean;
  loading?: boolean;
  conversations?: ChatConversation[];
  currentConversation?: ChatConversation | null;
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
}
