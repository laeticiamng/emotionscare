
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system' | 'coach';
  content: string;
  timestamp: string;
  conversationId?: string;
  conversation_id?: string;
  text?: string;
  role?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  emotion?: string;
  isUser?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
  last_message?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  participants?: string[];
  emotion?: string;

}
