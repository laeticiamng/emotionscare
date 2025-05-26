
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'coach' | 'system';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  isTyping: boolean;
  sendMessage: (content: string, sender?: ChatMessage['sender']) => Promise<void>;
  clearMessages: () => void;
  startNewConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
}
