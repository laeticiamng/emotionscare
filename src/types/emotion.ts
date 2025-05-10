
// Types for emotion-related components
export * from './index';

export interface EmotionAnalysisOptions {
  text?: string;
  audioUrl?: string;
  userId: string;
  include_feedback?: boolean;
  context?: string;
}

export interface EmotionAnalysisResponse {
  emotion: string;
  confidence: number;
  intensity?: number;
  feedback?: string;
  recommendations?: string[];
}

export interface Emotion {
  id: string;
  name?: string;
  user_id?: string;
  emotion: string;
  category?: 'positive' | 'negative' | 'neutral';
  intensity?: number;
  confidence?: number;
  color?: string;
  icon?: string;
  date?: string | Date;
  timestamp?: string | Date;
  text?: string;
  source?: 'text' | 'audio' | 'image' | 'combined';
  score?: number;
  ai_feedback?: string;
  feedback?: string;
  emojis?: string[];
}

export interface EmotionResult {
  id: string;
  userId?: string;
  user_id?: string;
  emotion: string;
  intensity?: number;
  confidence: number;
  timestamp?: string | Date;
  date?: string | Date;
  source?: 'text' | 'audio' | 'image' | 'combined';
  text?: string;
  transcript?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  relatedMusic?: string[];
  relatedActivities?: string[];
  score?: number;
  emojis?: string[];
}

export interface MoodData {
  date: string;
  value: number;
  emotion: string;
}
