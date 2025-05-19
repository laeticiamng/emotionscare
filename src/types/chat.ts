
// Define the types for Chat related components

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  conversationId?: string;
  conversation_id?: string; // For backward compatibility
  attachments?: string[];
  metadata?: Record<string, any>;
  role?: string; // Optional role property to support different message types
  text?: string; // For backward compatibility
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean; // Optional property for UI state
  lastMessage?: string; // For backward compatibility
  last_message?: string; // For backward compatibility
}

export interface ChatResponse {
  content: string;
  emotion?: string;
  suggestions?: string[];
}
