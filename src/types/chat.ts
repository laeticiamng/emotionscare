
export interface ChatMessage {
  id: string;
  conversation_id: string;
  timestamp: Date | string;
  sender: string;
  text: string;
  content?: string;
  sender_id?: string;
  is_read?: boolean;
  sender_type?: string;
  role?: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  title: string;
  last_message?: string;
  messages?: ChatMessage[];
  
  // Alternative properties used in some implementations
  userId?: string;
  lastMessage?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
