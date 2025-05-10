
// Create this file if it doesn't exist
export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date | string;
  
  // Add required properties that were missing
  sender_id: string;
  conversation_id: string;
  content: string;
  is_read: boolean;
  sender_type?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: Date | string;
  updated_at: Date | string;
  user_id: string;
  messages: ChatMessage[];
  is_archived?: boolean;
  emotion?: string;
  emotion_score?: number;
  chatbot_type?: string;
  last_message?: string;
  last_message_time?: Date | string;
}

export interface ChatResponse {
  message: string;
  emotion?: string;
  confidence?: number;
  recommendations?: string[];
}

export interface ChatConversationStats {
  total: number;
  active: number;
  archived: number;
}

export interface ChatNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date | string;
}
