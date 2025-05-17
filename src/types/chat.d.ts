
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  role: string;
  timestamp: string;
  conversation_id: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  last_message?: string;
  messages?: ChatMessage[];
}

export interface ChatResponse {
  text: string;
  id: string;
  timestamp: string;
  sentiment?: string;
  suggested_actions?: string[];
}
