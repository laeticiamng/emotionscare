
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system' | 'coach';
  timestamp: string;
  isLoading?: boolean;
  text?: string;
  role?: 'user' | 'assistant' | 'system';
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  message: string;
  emotion?: string;
  recommendations?: any[];
}
