
export interface ChatMessage {
  id: string;
  content?: string;
  text?: string;
  sender: 'user' | 'assistant' | 'system' | 'coach';
  timestamp: string;
  isLoading?: boolean;
  conversationId?: string;
  role?: 'user' | 'assistant' | 'system';
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage?: string;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  message: string;
  action?: string;
  data?: any;
}
