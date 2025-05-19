
// Chat types for the application
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  conversationId: string;
  role?: string; // For backward compatibility
  isUser?: boolean; // For backward compatibility
  isTyping?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
  text?: string; // Adding this for backward compatibility with existing code
  conversation_id?: string; // For backward compatibility
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  isActive?: boolean; // Add for backward compatibility
  participants?: string[];
  metadata?: Record<string, any>;
  user_id?: string; // Add for backward compatibility
  created_at?: string; // Add for backward compatibility
  updated_at?: string; // Add for backward compatibility
  last_message?: string; // Add for backward compatibility
}

export interface ChatResponse {
  id: string;
  content: string;
  role?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Additional interfaces for components
export interface CoachCharacterProps {
  status?: 'online' | 'offline' | 'typing';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  className?: string;
}

export interface CoachChatProps {
  conversationId?: string;
  autoFocus?: boolean;
  className?: string;
}

// Adding these for useChat.tsx fixes
export interface ChatHookResult {
  messages: ChatMessage[];
  addMessage: (content: string, sender: 'user' | 'assistant' | 'system') => void;
  clearMessages: () => void;
  isLoading: boolean;
  error: Error | null;
  input: string;
  setInput: (text: string) => void;
  sendMessage: (text: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isTyping?: boolean;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: Error) => void;
  onResponse?: (response: ChatResponse) => void;
  conversationId?: string;
  initialConversationId?: string;
}

export const normalizeChatMessage = (message: any): ChatMessage => {
  return {
    id: message.id || crypto.randomUUID(),
    sender: message.sender || message.role || 'user',
    content: message.content || message.text || '',
    timestamp: message.timestamp || new Date().toISOString(),
    conversationId: message.conversationId || message.conversation_id || '',
    role: message.role || message.sender,
    text: message.text || message.content,
    conversation_id: message.conversation_id || message.conversationId
  };
};
