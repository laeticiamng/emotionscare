
export interface ChatMessage {
  id: string;
  content: string;
  text?: string; // For backward compatibility
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  conversationId?: string;
  conversation_id?: string; // For backward compatibility
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: Error) => void;
  onResponse?: (message: ChatMessage) => void;
  conversationId?: string;
  initialConversationId?: string;
}

export interface ChatHookResult {
  messages: ChatMessage[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  addMessage: (content: string, sender: 'user' | 'assistant' | 'system') => ChatMessage;
  clearMessages: () => void;
  isTyping?: boolean;
}
