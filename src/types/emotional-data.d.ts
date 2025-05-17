
export interface EmotionalData {
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
  userId?: string;
  user_id?: string;
  id?: string;
  source?: string;
  feedback?: string;
}

export interface EmotionalTrend {
  emotion: string;
  count: number;
  average_intensity: number;
  timeframe: 'day' | 'week' | 'month';
  trend?: 'improving' | 'declining' | 'stable';
  primaryEmotion?: string;
  secondaryEmotion?: string;
  startDate?: string;
  endDate?: string;
  data?: EmotionalData[];
}

export type EmotionalFilter = 'all' | 'positive' | 'negative' | 'neutral' | string;

export type EmotionCategory = 'positive' | 'negative' | 'neutral' | 'mixed';
