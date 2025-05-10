
export interface Emotion {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  primaryEmotion?: Emotion;
  secondaryEmotion?: Emotion;
  emotion: string;
  intensity?: number;
  sentiment?: number;
  timestamp?: string;
  ai_feedback?: string;
}

export interface EmotionScanResult {
  id: string;
  user_id: string;
  timestamp: string;
  emotion: string;
  intensity: number;
  text?: string;
  audio_url?: string;
  confidential?: boolean;
  ai_feedback?: string;
}

export interface EmotionTrend {
  emotion: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}
