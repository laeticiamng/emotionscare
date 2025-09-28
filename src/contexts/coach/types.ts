
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
  analyzeEmotion?: (text: string) => Promise<{ emotion: string; score: number }>;
  getRecommendations?: (category: string) => string[];
  setIsPlaying?: (isPlaying: boolean) => void; // Added missing property
  // Add a property for the CoachService for compatibility
  coachService?: any;
}

// Export CoachContextProps as an alias of CoachContextType for backward compatibility
export type CoachContextProps = CoachContextType;

// Add the CoachNotification type that's missing from lib/coach/types
export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date | string;
  read?: boolean;
  action?: {
    id: string;
    type: string;
    payload: any;
  };
}
