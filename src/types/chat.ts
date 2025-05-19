// Define the types for Chat related components

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system' | 'coach';
  content: string;
  timestamp: string;
  conversationId?: string;
  conversation_id?: string; // For backward compatibility
  attachments?: string[];
  metadata?: Record<string, any>;
  role?: string; // Optional role property to support different message types
  text?: string; // For backward compatibility
  emotion?: string; // Added for emotional context
  /** Flag for UI helpers identifying if message was sent by the user */
  isUser?: boolean;
  /** Flag to indicate loading state for UI */
  isLoading?: boolean;
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
  created_at?: string; // For backward compatibility
  updated_at?: string; // For backward compatibility
  user_id?: string; // For backward compatibility
  participants?: string[]; // Added for compatibility with mockChatMessages
  emotion?: string; // Added for emotional context
}

export interface ChatResponse {
  content: string;
  emotion?: string;
  suggestions?: string[];
}

// Adding the missing types referenced in useChat.tsx
export interface ChatHookResult {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  error: Error | null;
  input: string;
  setInput: (input: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  addMessage?: (content: string, sender: 'user' | 'assistant' | 'system') => ChatMessage;
  clearMessages?: () => void;
  isTyping?: boolean;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onResponse?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  conversationId?: string;
  initialConversationId?: string;
}

export const normalizeChatMessage = (message: any): ChatMessage => {
  return {
    id: message.id || `msg-${Date.now()}`,
    sender: message.sender || message.role || 'assistant',
    content: message.content || message.text || '',
    timestamp: message.timestamp || new Date().toISOString(),
  };
};
