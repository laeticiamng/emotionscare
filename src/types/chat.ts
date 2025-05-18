
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  conversationId?: string;
  emotions?: Record<string, number>;
  feedback?: string;
  isOptimistic?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
  messages?: ChatMessage[];
  user_id?: string;
  unread?: number;
  category?: string;
  status?: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}
