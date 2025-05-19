
export interface EmotionalTrend {
  date: string;
  emotion: string;
  intensity: number;
  score?: number;
}

export interface EmotionalInsight {
  title: string;
  description: string;
  emotion: string;
  date: string;
  score: number;
  type: 'positive' | 'neutral' | 'negative';
}

export interface EmotionalSnapshot {
  dominantEmotion: string;
  date: string;
  score: number;
  emotions: Record<string, number>;
}
