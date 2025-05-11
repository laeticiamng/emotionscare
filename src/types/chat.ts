
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string | Date;
  is_read?: boolean;
  conversation_id?: string;
  role?: string;
  // For backwards compatibility
  sender_id?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  lastMessage?: string;
  last_message?: string;
  messages?: ChatMessage[];
  // For backwards compatibility
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ChatResponseType {
  id?: string;
  content?: string;
  message?: string; 
  role?: string;
  timestamp?: string;
  emotion?: string;
}

export type ChatResponse = ChatResponseType;
