
export interface ChatMessage {
  id: string;
  content: string;
  text?: string;
  sender: string;
  role: string;
  timestamp: string;
  conversation_id: string;
  isError?: boolean;
  isTyping?: boolean;
  attachments?: string[];
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  lastMessage?: string; // Keeping both variants for backward compatibility
  messages?: ChatMessage[];
  status?: string; // Adding status property needed by multiple components
}

export interface ChatResponse {
  content?: string;
  message?: string;
  emotion?: string;
  id?: string;
  timestamp?: string;
}
