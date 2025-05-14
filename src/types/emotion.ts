
export interface Emotion {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity?: number;
  transcript?: string;
  date?: string;
  emojis?: string[];
  ai_feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
  dominantEmotion?: string;
  score?: number;
  feedback?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  analysis?: string;
  suggestions?: string[];
  related_emotions?: string[];
}
