
export interface Emotion {
  id: string;
  user_id: string;
  date: string | Date;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  emojis?: string[];
  ai_feedback?: string;
  category?: string;
  audio_url?: string;
  transcript?: string;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  confidence?: number;
  score?: number;
  intensity?: number;
  transcript?: string;
  text?: string;
  date?: string;
  timestamp?: string;
  emojis?: string[];
  ai_feedback?: string;
  feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  coping_strategies?: string[];
  insights?: string[];
  recommendations?: string[];
}
