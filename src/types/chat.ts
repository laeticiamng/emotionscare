
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_id?: string;
  sender_type?: string;
  timestamp: string;
  conversation_id?: string;
  role?: string;
  is_read?: boolean;
  emotion?: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  last_message: string; // Required based on errors
  last_message_time?: string;
  messages?: ChatMessage[];
  
  // Legacy fields for backwards compatibility
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: string;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string;
  role?: string;
  timestamp?: string;
  emotion?: string;
}

// Add this for compatibility with useChatProcessing.ts and useChat.tsx
export type ChatResponseType = ChatResponse;
