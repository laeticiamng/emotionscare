
import { ChatMessage } from '@/types/chat';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  toggleChat?: () => void;
  characterName?: string;
  characterImage?: string;
  characterRole?: string;
}
