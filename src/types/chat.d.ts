
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'system' | 'user' | 'assistant';
  timestamp: string;
  conversation_id?: string;
  content?: string;
  role?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  user_id: string;
  last_message?: string;
}

export interface ChatResponse {
  message: string;
  emotion?: string;
  status: 'success' | 'error';
  recommendations?: any[];
  suggestions?: string[];
}
