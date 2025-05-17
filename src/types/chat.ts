export interface ChatMessage {
  id: string;
  conversation_id: string;
  timestamp: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  attachments?: string[];
  isError?: boolean;
  isTyping?: boolean;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  messages?: ChatMessage[];
}

export interface ChatMessageRequest {
  message: string;
  conversation_id: string;
  user_id: string;
}

export interface ChatMessageResponse {
  id: string;
  message: string;
  created_at: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}
