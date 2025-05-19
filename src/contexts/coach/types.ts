
import { ChatMessage } from '@/types/chat';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string, history?: any[]) => Promise<string>;
  clearMessages: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  toggleChat?: () => void;
  characterName?: string;
  characterImage?: string;
  characterRole?: string;
  loading?: boolean;
}
