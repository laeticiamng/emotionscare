
export interface ChatMessage {
  id: string;
  user_id?: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string | Date;
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
  last_message?: string;
  messages_count?: number;
  pinned?: boolean;
  emotion_context?: string;
}
