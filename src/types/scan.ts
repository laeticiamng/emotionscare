
// Import from the main index file
import { Emotion, User } from './index';

export interface ScanInput {
  emojis?: string;
  text?: string;
  audio_url?: string;
  user_id: string;
}

export interface ScanResponse {
  emotion: Emotion;
  feedback: string;
  score: number;
}

// Additional scan-specific types
export interface EmotionScanConfig {
  userId: string;
  includeFeedback: boolean;
  saveResult: boolean;
  confidential?: boolean;
}

export interface EmotionScanResult {
  id?: string;
  emotion: string;
  confidence?: number;
  score?: number;
  emojis?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
  ai_feedback?: string;
}

export interface EmotionHistoryFilter {
  startDate?: Date;
  endDate?: Date;
  emotions?: string[];
  minScore?: number;
  maxScore?: number;
}
