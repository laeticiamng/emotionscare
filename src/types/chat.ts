
export interface ChatMessage {
  id: string;
  content?: string;
  text?: string;
  sender?: string;
  sender_type?: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system';
  timestamp?: string | Date;
  type?: string;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string | Date;
  updated_at: string | Date;
  user_id?: string;
  summary?: string;
  status?: 'active' | 'archived' | 'deleted';
}
