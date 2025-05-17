
export interface EmotionalData {
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
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
