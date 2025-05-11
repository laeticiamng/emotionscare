
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_id?: string; // Added for compatibility
  timestamp?: string | Date;
  is_read?: boolean;
  conversation_id?: string;
  role?: string;
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
}

export interface ChatResponseType {
  id?: string;
  content?: string;
  message?: string; // For compatibility
  role?: string;
  timestamp?: string;
  emotion?: string; // For compatibility
}
