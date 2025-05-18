export interface ChatMessage {
  id: string;
  content?: string;
  text?: string; // For backward compatibility
  sender: string;
  role?: string; // For backward compatibility
  timestamp: string | Date;
  isLoading?: boolean;
  conversationId?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
  lastMessage?: string;
  userId?: string;
}

// Other chat-related types
export type ChatRole = 'user' | 'assistant' | 'system' | 'coach';
export type ChatStatus = 'idle' | 'loading' | 'error' | 'success';

export interface ChatContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}
