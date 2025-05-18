
export interface ChatMessage {
  id: string;
  text: string;
  sender: "system" | "user" | "assistant";
  timestamp: string;
  conversation_id: string;
  read?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  last_message?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages?: ChatMessage[];
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  id: string;
  content: string;
  role: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
