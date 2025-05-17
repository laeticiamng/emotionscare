
import { EmotionResult } from '@/types/emotion';

export interface CoachEvent {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}

export interface CoachResponse {
  id: string;
  message: string;
  suggestions?: string[];
  actions?: CoachAction[];
  followupQuestions?: string[];
  emotionDetected?: string;
  timestamp: string;
}

export interface CoachAction {
  id: string;
  type: 'music' | 'exercise' | 'journal' | 'scan' | 'vr' | 'reminder';
  label: string;
  description?: string;
  payload?: any;
}

export interface CoachState {
  conversations: CoachConversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  lastDetectedEmotion: string | null;
  emotionHistory: EmotionResult[];
  lastInteractionTimestamp: string | null;
  suggestionHistory: string[];
}

export interface CoachConversation {
  id: string;
  title: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
  primaryEmotion?: string;
  summary?: string;
}

export interface CoachMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach' | 'system';
  timestamp: string;
  emotion?: string;
  attachments?: any[];
  actions?: CoachAction[];
  read?: boolean;
}

export const AI_MODEL_CONFIG = {
  defaultModel: 'gpt-4-turbo',
  fallbackModel: 'gpt-3.5-turbo',
  maxTokens: 2000,
  temperature: 0.7,
  systemPrompt: 'You are an empathetic emotional well-being coach.',
  scan: {
    model: 'gpt-4-turbo',
    maxTokens: 1000,
    temperature: 0.5
  }
};
