
// Define the types for coach module
import { MusicTrack } from '@/types/music';

export interface CoachAction {
  id?: string; // Make id optional to fix the routines.ts errors
  type: string;
  payload: any;
}

export interface CoachState {
  messages: CoachMessage[];
  isTyping: boolean;
  lastMessageTimestamp?: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: CoachAction[];
}

// Add CoachEvent type that was missing
export interface CoachEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date | string;
}

export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  // Fix notification type mismatch by expanding the allowed types
  type: 'success' | 'warning' | 'info' | 'error' | 'reminder' | 'wellness' | 'tip' | 'recommendation';
  timestamp: string; 
  read: boolean;
  actionUrl?: string;
  userId?: string;
}

export interface EmotionalData {
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  feedback?: string;
  source?: string;
  context?: string; // Add context property to fix the error
}

export type EmotionalTrend = 'positive' | 'negative' | 'stable';

export interface MusicRecommendation {
  trackId: string;
  emotion: string;
  userId: string;
  timestamp: string;
}

export interface CoachSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  emotion?: string;
  feedback?: string;
  messages: CoachMessage[];
}

// Re-export AI model configuration
export { AI_MODEL_CONFIG } from '@/config/ai-models';

export type AIModule = 'chat' | 'journal' | 'coach' | 'scan';

export interface OpenAIModelParams {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
}
