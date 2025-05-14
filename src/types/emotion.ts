
export type Emotion = {
  emotion: string;
  confidence: number;
  intensity?: number;
  color?: string;
  icon?: string;
};

export interface EmotionResult {
  emotion: string;
  probability?: number;
  confidence?: number;
  intensity?: number;
  triggers?: string[];
  recommendations?: string[];
  transcript?: string;
  emojis?: string[];
  source?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  color?: string;
  icon?: string;
  description?: string;
  suggestions?: string[];
  musicRecommendation?: string;
}
