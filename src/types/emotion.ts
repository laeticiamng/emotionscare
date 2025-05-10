
export interface Emotion {
  id: string;
  name: string;
  value: number;
  color: string;
  description?: string;
}

export interface EmotionResult {
  primaryEmotion: Emotion;
  secondaryEmotion?: Emotion;
  intensity: number;
  sentiment: number;
  timestamp: string | Date;
  recommendations?: EmotionRecommendation[];
}

export interface EmotionRecommendation {
  type: 'activity' | 'music' | 'journal' | 'breathing' | 'social';
  title: string;
  description: string;
  link?: string;
}
