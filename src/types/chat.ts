
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
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date | string;
  last_message?: string;
}
