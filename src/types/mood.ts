
export interface MoodData {
  id: string;
  userId: string;
  date: string | Date;
  mood: number;
  energy?: number;
  anxiety?: number;
  notes?: string;
  tags?: string[];
  sentiment?: string; // positive, negative, neutral
  emotions?: Record<string, number>;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  intensity?: number;
  score?: number;
  category?: string;
}

export interface EmotionAnalysis {
  dominant: EmotionPrediction;
  emotions: EmotionPrediction[];
  sentiment: string;
  intensityScore: number;
  audioQuality?: number;
  confidence?: number;
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'combined';

export interface EmotionServiceOptions {
  detailed?: boolean;
  includeScores?: boolean;
  language?: string;
  source?: EmotionSource;
}
