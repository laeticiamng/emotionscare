
export interface Emotion {
  id: string;
  userId?: string;
  date: string;
  score: number;
  text?: string;
  emojis?: string[];
  audio_url?: string;
  ai_feedback?: string;
}

export interface EmotionResult {
  score: number;
  primaryEmotion: string;
  secondaryEmotion?: string;
  confidence: number;
  analysis: string;
  suggestions: string[];
  intensity: number;
  timestamp: string;
}
