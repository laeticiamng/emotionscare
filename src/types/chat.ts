
// Chat related types used in chat interfaces

import { ChatMessage } from './index';

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatContext {
  user_mood?: string;
  user_history?: string[];
  recent_activities?: string[];
  preferences?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  context?: ChatContext;
  recommendations?: string[];
  follow_up_questions?: string[];
}

// Re-export ChatMessage for backward compatibility
export type { ChatMessage } from './index';
