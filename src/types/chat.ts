
export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  // Backward compatibility fields
  text?: string;
  conversation_id?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messages: ChatMessage[];
  // Backward compatibility fields
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  last_message?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  // Backward compatibility fields
  user_id?: string;
  created_at?: string;
  timestamp?: string;
}
