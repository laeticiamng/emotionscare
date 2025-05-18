
export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  content?: string; // Pour compatibilité
  role?: 'user' | 'assistant' | 'system'; // Pour compatibilité
  timestamp: string;
  conversation_id?: string; // Pour compatibilité
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messages?: ChatMessage[]; // Pour compatibilité
  created_at?: string; // Pour compatibilité
  updated_at?: string; // Pour compatibilité
  last_message?: string; // Pour compatibilité
  user_id?: string; // Pour compatibilité
  status?: string; // Pour compatibilité
}

export interface ChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
