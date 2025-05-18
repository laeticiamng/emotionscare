
export interface ChatMessage {
  id: string;
  text: string;
  content?: string; // Pour la compatibilité avec différentes implémentations
  sender: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system'; // Pour la compatibilité avec différentes implémentations
  timestamp: string;
  conversation_id?: string;
  conversationId?: string;
  emotions?: Record<string, number>;
  feedback?: string;
  isOptimistic?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  updatedAt?: string; // Pour la compatibilité avec différentes implémentations
  createdAt?: string; // Pour la compatibilité avec différentes implémentations
  last_message?: string;
  lastMessage?: string; // Pour la compatibilité avec différentes implémentations
  last_message_time?: string;
  messages?: ChatMessage[];
  user_id?: string;
  unread?: number;
  category?: string;
  status?: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  emotion?: string;
  status: 'success' | 'error';
  recommendations?: any[];
  suggestions?: string[];
}
