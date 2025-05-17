
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text: string;
  emojis: string[];
  recommendations: string[];
  secondary_emotion?: string;
  secondary_score?: number;
}

export interface EmotionHistory {
  id: string;
  date: string;
  emotion: string;
  score: number;
  note?: string;
}

export interface EmotionAnalytics {
  dominant: string;
  frequency: Record<string, number>;
  trends: {
    emotion: string;
    values: number[];
    dates: string[];
  }[];
  recent: EmotionHistory[];
}

export interface EmotionScan {
  id: string;
  timestamp: string;
  primary_emotion: string;
  secondary_emotion?: string;
  confidence: number;
  source: 'facial' | 'voice' | 'text';
  notes?: string;
  emoji?: string;
}
