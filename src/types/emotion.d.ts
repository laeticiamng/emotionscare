
export type EmotionIntensity = 'low' | 'medium' | 'high' | number;

export interface Emotion {
  id: string;
  name: string;
  label: string;
  intensity: EmotionIntensity;
  timestamp: string;
  description?: string;
  tips?: string[];
  categories?: string[];
  color?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: string;
  secondaryEmotions?: {
    [key: string]: number;
  };
}

export interface EmotionEntry {
  id: string;
  userId: string;
  emotion: string;
  intensity: EmotionIntensity;
  notes?: string;
  timestamp: string;
  source: 'manual' | 'scan' | 'journal' | 'ai';
}

export interface EmotionScanResult {
  primaryEmotion: string;
  confidence: number;
  secondaryEmotions: {
    [key: string]: number;
  };
  timestamp: string;
  imageData?: string;
}

export interface EmotionTrend {
  emotion: string;
  values: number[];
  timestamps: string[];
  average: number;
  color: string;
}

export interface EmotionStats {
  mostFrequentEmotion: string;
  averageIntensity: number;
  emotionCounts: {
    [key: string]: number;
  };
  trends: EmotionTrend[];
  totalEntries: number;
  periodStart: string;
  periodEnd: string;
}
