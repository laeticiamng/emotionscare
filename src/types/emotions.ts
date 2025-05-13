
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  name: string;
  score: number;
  intensity?: number;
  confidence?: number;
  category?: string;
  source?: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  timestamp?: string;
  confidence?: number;
}
