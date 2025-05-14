
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  date: string | Date;
  notes?: string;
  color?: string;
  anxiety?: number; // Add this property to resolve errors
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
  sentiment?: number;
  trigger?: string;
  context?: string;
}

export interface EmotionEntry {
  id: string;
  user_id: string;
  emotion_name: string;
  emotion_id?: string;
  intensity: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  color?: string;
  is_confidential: boolean;
  share_with_coach: boolean;
  audio_url?: string;
  text?: string;
  emojis?: string;
}

export interface EmotionLog {
  id: string;
  name: string;
  intensity: number;
  timestamp: Date | string;
  notes?: string;
  color?: string;
}

export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'disgust' | 'surprise' | 'neutral' | 'love' | 'anticipation' | 'trust';

export interface EmotionData {
  name: EmotionType;
  value: number;
  color: string;
}

export interface EmotionTrend {
  date: string;
  emotions: {
    [key in EmotionType]?: number;
  };
}

export interface EmotionStats {
  mostFrequent: {
    emotion: EmotionType;
    count: number;
  };
  averageIntensity: number;
  positivePercentage: number;
  negativePercentage: number;
  totalEntries: number;
  emotionCounts: {
    [key in EmotionType]?: number;
  };
}

export interface EmotionScanResult {
  primaryEmotion: EmotionType;
  secondaryEmotion?: EmotionType;
  intensity: number;
  confidence: number;
  timestamp: string;
}
