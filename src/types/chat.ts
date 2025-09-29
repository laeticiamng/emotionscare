
export interface ChatMessage {
  id: string;
  text: string;
  content: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system' | 'coach';
  role?: 'user' | 'assistant' | 'system';
  timestamp: string | Date;
  type?: 'text' | 'image' | 'audio';
  metadata?: Record<string, any>;
  isLoading?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  isActive?: boolean;
  lastMessage?: ChatMessage | string;
}

export interface ChatResponse {
  message: string;
  confidence?: number;
  suggestions?: string[];
  emotion?: string;
}

export interface CoachPersonality {
  name: string;
  avatar: string;
  style: 'supportive' | 'motivational' | 'analytical' | 'empathetic';
  specialties: string[];
}
