
/**
 * Types pour les émotions et analyses
 */

export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'anxiety' | 'calm' | 'stress' | 'fatigue' | 'energy';

export interface EmotionResult {
  emotion: string;
  intensity?: number;
  confidence?: number;
  timestamp?: string | Date;
  source?: 'text' | 'voice' | 'facial' | 'emoji' | 'manual';
  details?: {
    [key: string]: any;
  };
}

export interface EmotionHistory {
  id: string;
  userId: string;
  emotion: EmotionResult;
  createdAt: string | Date;
  notes?: string;
}

export interface EmotionTrend {
  emotion: string;
  values: number[];
  dates: string[];
}

export interface EmotionFilter {
  startDate?: Date;
  endDate?: Date;
  emotions?: EmotionType[];
  source?: string;
}
