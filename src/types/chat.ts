
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_type: 'user' | 'coach' | 'system';
  timestamp: string | Date;
  conversation_id: string;
  metadata?: {
    emotion?: string;
    intensity?: number;
    tags?: string[];
    [key: string]: any;
  };
  read?: boolean;
  delivered?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  messages: ChatMessage[];
  last_message?: ChatMessage;
  metadata?: {
    topic?: string;
    emotion_summary?: string;
    [key: string]: any;
  };
}
