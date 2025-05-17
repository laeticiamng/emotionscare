
export interface ChatMessage {
  id: string;
  text: string;
  content?: string;
  sender: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  sender_id?: string;
  conversation_id?: string;
  sender_type?: string;
  is_read?: boolean;
  isLoading?: boolean;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string;
  role?: string;
  timestamp?: string;
  emotion?: string;
  text?: string;
  sentiment?: string;
  recommendations?: string[];
}

export type ChatResponseType = ChatResponse;

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  assistant_id?: string;
  messages?: ChatMessage[];
  status?: 'active' | 'archived' | 'deleted';
  context?: string;
  last_message?: string;
  lastMessage?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'assistant' | 'system';
  status?: 'online' | 'offline' | 'away';
}
