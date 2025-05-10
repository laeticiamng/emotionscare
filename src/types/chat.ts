
import { User } from './user';

export interface ChatMessage {
  id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  timestamp: string | Date;
  is_read: boolean;
  sender_name?: string;
  is_ai?: boolean;
  sender?: string;
  sender_type?: string;
  role?: string;
  text?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  last_message?: ChatMessage;
  last_message_time?: string | Date;
  messages?: ChatMessage[];
}
