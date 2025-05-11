
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string;
  role?: string;
  timestamp?: string;
  emotion?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  assistant_id?: string;
  messages: ChatMessage[];
  status: 'active' | 'archived' | 'deleted';
  context?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'assistant' | 'system';
  status?: 'online' | 'offline' | 'away';
}
