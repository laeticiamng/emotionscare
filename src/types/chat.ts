
export interface ChatMessage {
  id: string;
  user_id?: string;
  conversation_id?: string;
  content?: string;
  text?: string;
  role?: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'bot' | 'system';
  sender_type?: 'user' | 'bot' | 'system';
  created_at?: string | Date;
  timestamp?: string | Date;
  emotion?: string;
  sentiment?: number;
  attachments?: string[];
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string | Date;
  updated_at: string | Date;
  last_message?: string | ChatMessage;
  messages_count?: number;
  messages?: ChatMessage[];
  pinned?: boolean;
  emotion_context?: string;
}

export interface ChatResponse {
  message?: string;
  text?: string;
  recommendations?: string[];
  follow_up_questions?: string[];
}

export interface ChatContext {
  emotion?: string;
  mood?: number;
  recent_entries?: any[];
}
