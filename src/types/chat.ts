
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'coach';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}
