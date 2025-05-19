
// Types liés aux données émotionnelles

import { EmotionResult } from './emotion';

export interface EmotionalData {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source: string;
  context?: string;
  tags?: string[];
  value?: any;
}

export interface EmotionalReport {
  period: 'day' | 'week' | 'month' | 'year';
  data: EmotionResult[];
  summary: {
    dominantEmotion: string;
    averageIntensity: number;
    emotionCounts: Record<string, number>;
    improvement: number;
  };
}
