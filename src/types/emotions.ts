
export interface Emotion {
  id: string;
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  intensity?: number;
  confidence?: number;
  color?: string;
  description?: string;
  relatedEmotions?: string[];
  triggers?: string[];
}

export interface EmotionEntry {
  id: string;
  user_id: string;
  date: Date | string;
  emotion: string;
  intensity?: number;
  confidence?: number;
  note?: string;
  triggers?: string[];
  context?: string;
  duration?: number;
  created_at?: string;
}

export interface EmotionSnapshot {
  primaryEmotion: {
    name: string;
    intensity?: number;
  };
  secondaryEmotions?: Array<{
    name: string;
    intensity?: number;
  }>;
  overallScore?: number;
  timestamp: Date | string;
}

export interface EmotionAnalysis {
  user_id: string;
  period: 'day' | 'week' | 'month' | 'year';
  start_date: Date | string;
  end_date: Date | string;
  dominant_emotion: string;
  emotion_distribution: Record<string, number>;
  average_intensity: number;
  stability_score: number;
  trend?: 'improving' | 'declining' | 'stable';
  insights?: string[];
}
