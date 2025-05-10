
import { ChatMessage, ChatConversation } from './index';

export interface ChatResponse {
  text: string;
  metadata?: Record<string, any>;
}

export interface UserContext {
  userId: string;
  userName: string;
  emotion?: string;
  emotionScore?: number;
  recentTopics?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  emotion?: string;
  metadata?: Record<string, any>;
  sender?: 'user' | 'assistant' | 'system'; // Added for backward compatibility
  text?: string; // Added for backward compatibility
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date | string;
  last_message?: string;
  lastMessage?: string; // Added for backward compatibility
  updated_at?: Date | string; // Added for backward compatibility
}
