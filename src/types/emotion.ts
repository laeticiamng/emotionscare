
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
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  intensity: number;
  color: string;
  icon?: string;
}

export interface EmotionResult {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string | Date;
  source: 'text' | 'audio' | 'image' | 'combined';
  confidence: number;
  recommendations?: string[];
  feedback?: string;
  relatedMusic?: string[];
  relatedActivities?: string[];
}

export interface MoodData {
  date: string;
  value: number;
  emotion: string;
}
