
export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: string;
  source?: 'text' | 'facial' | 'audio' | 'manual' | 'emoji';
  details?: Record<string, number>;
  intensity?: number;
  duration?: number;
  transcript?: string;
}
