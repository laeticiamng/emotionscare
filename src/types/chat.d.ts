
// Types liés au chat et aux conversations

export interface ChatMessage {
  id: string;
  conversationId: string;
  conversation_id?: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  content?: string;
  timestamp: string;
  role?: string;
  attachments?: any[];
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messages: ChatMessage[];
  metadata?: Record<string, any>;
}
