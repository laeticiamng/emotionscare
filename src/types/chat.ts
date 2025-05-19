
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  text?: string; // For backward compatibility
  timestamp: string;
  isUser?: boolean;
  emotion?: string;
  attachments?: string[];
  role?: string;
  isLoading?: boolean;
  conversationId?: string;
  conversation_id?: string; // For compatibility
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  lastMessage?: string;
  last_message?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  conversationId?: string;
  initialConversationId?: string;
  onResponse?: (message: ChatMessage) => void;
}

export interface ChatHookResult {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  input: string;
  setInput: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function normalizeChatMessage(message: any): ChatMessage {
  return {
    id: message.id || `msg-${Date.now()}`,
    sender: message.sender || message.role || 'system',
    content: message.content || message.text || '',
    text: message.text || message.content || '',
    timestamp: message.timestamp || message.created_at || new Date().toISOString()
  };
}
