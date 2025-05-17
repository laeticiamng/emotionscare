
// Types for emotion detection results
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  intensity?: number;
  timestamp?: string;
  date?: string;
  recommendations?: string[];
  emojis?: string[];
  userId?: string;
  user_id?: string;
  transcript?: string;
  ai_feedback?: string;
}

export interface EmotionStats {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionTrend {
  date: string;
  emotion: string;
  value: number;
}

export interface EmotionTimelineEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  note?: string;
}

export type EmotionIntensity = 'low' | 'medium' | 'high';
