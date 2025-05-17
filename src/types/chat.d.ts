
export interface ChatMessage {
  id: string;
  content: string;
  text?: string;
  sender: string;
  role: string;
  timestamp: string;
  conversation_id?: string;
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
  lastMessage?: string; // Add this to support both property names
  messages?: ChatMessage[];
  status?: string; // Add this to support the status property
}

export interface ChatResponse {
  content?: string;
  message?: string;
  emotion?: string;
  id?: string;
  timestamp?: string;
}
