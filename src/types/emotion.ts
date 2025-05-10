
export interface Emotion {
  id: string;
  user_id?: string;
  date: string;
  emotion: string;
  score?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  ai_feedback?: string;
  recommendations?: string[];
  intensity?: number;
  sentiment?: number;
  timestamp?: string | Date;
  primaryEmotion?: {
    name: string;
    score: number;
  };
  secondaryEmotions?: Array<{
    name: string;
    score: number;
  }>;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  transcript?: string;
  text?: string;
  primaryEmotion?: {
    name: string;
    score: number;
  };
  secondaryEmotions?: Array<{
    name: string;
    score: number;
  }>;
}

export interface EnhancedEmotionResult extends EmotionResult {
  history?: Emotion[];
  trend?: 'improving' | 'stable' | 'declining';
  detailedAnalysis?: string;
  recommendations?: string[];
}
