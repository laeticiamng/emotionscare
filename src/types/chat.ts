
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: 'user' | 'bot' | 'system' | 'coach';
  sender_type?: 'user' | 'bot' | 'system' | 'coach';
  timestamp: Date;
  emotionContext?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id?: string;
  created_at: string | Date;
  updated_at: string | Date;
  last_message?: ChatMessage;
  messages?: ChatMessage[];
  emotion_context?: string;
}
