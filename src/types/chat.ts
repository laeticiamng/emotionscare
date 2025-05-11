
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_id?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
  is_read?: boolean;
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

// Adding this type to fix the ChatResponseType errors
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
