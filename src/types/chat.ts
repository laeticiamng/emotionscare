
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
