
export interface ChatMessage {
  id: string;
  content: string;
  text?: string;
  sender: 'user' | 'assistant' | 'system';
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  conversation_id: string;
  isError?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  status?: string;
}

export interface ChatResponse {
  message?: string;
  response?: string;
  conversation_id?: string;
  error?: string;
  success?: boolean;
}
