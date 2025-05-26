
export interface Emotion {
  id: string;
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  intensity: number;
  confidence?: number;
}

export interface EmotionAnalysis {
  id: string;
  userId: string;
  timestamp: Date;
  emotions: Emotion[];
  dominantEmotion: string;
  overallMood: string;
  confidence: number;
  source: 'text' | 'voice' | 'image';
  rawData?: any;
}

export interface EmotionTrend {
  date: string;
  averageMood: number;
  emotionDistribution: Record<string, number>;
}
