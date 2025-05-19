
// Chat types for the application
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  conversationId: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  role?: string; // Optional role property to support different message types
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  userId: string;
  isActive?: boolean; // Optional property for UI state
}

export interface ChatSession {
  id: string;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  history: {
    viewedConversations: string[];
    recentConversations: string[];
  };
}
