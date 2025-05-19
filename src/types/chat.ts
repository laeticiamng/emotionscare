export interface ChatMessage {
  id: string;
  content?: string;
  text?: string; // For backward compatibility
  sender: string;
  role?: string; // For backward compatibility
  timestamp: string | Date;
  isLoading?: boolean;
  conversationId?: string;
  conversation_id?: string; // For backward compatibility
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  lastUpdated?: Date | string;
  updatedAt?: string; // For backward compatibility
  lastMessage?: string;
  user_id?: string; // For backward compatibility
  userId?: string;
  created_at?: string; // For backward compatibility
  updated_at?: string; // For backward compatibility
  last_message?: string; // Added for hooks compatibility
  isActive?: boolean; // Added for mockChatMessages.ts
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

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
}

// Add these types for useChat
export interface ChatHookResult {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  input: string; // Added for ChatInterface
  setInput: (value: string) => void; // Added for ChatInterface
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Added for ChatInterface
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Added for ChatInterface
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  conversationId?: string;
  initialConversationId?: string; // Added for useChat.tsx
  onResponse?: (message: ChatMessage) => void;
}

export interface ChatResponse {
  message: string;
  recommendations?: string[];
}

// For backward compatibility
export type Conversation = ChatConversation;

// Utility functions
export function normalizeChatMessage(message: any): ChatMessage {
  return {
    id: message.id || `msg-${Date.now()}`,
    content: message.content || message.text || "",
    text: message.text || message.content || "",
    sender: message.sender || "system",
    timestamp: message.timestamp || new Date().toISOString(),
    conversationId: message.conversationId || message.conversation_id,
    conversation_id: message.conversation_id || message.conversationId,
    role: message.role || message.sender,
    isLoading: message.isLoading || false
  };
}
