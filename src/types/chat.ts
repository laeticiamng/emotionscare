
export interface ChatMessage {
  id: string;
  conversation_id: string;
  content: string;
  text: string; // Alternative property name for content
  sender: "user" | "system" | "assistant";
  role: string; // For OpenAI compatibility
  timestamp: string;
  isError?: boolean; // Optional property for error messages
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  messages?: ChatMessage[];
}

export interface ChatResponse {
  id: string;
  content: string;
  created_at: string;
}
