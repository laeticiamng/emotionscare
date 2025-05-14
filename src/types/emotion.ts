
export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  confidence?: number;
  feedback?: string;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
  dominantEmotion?: {
    name: string;
    score: number;
  };
}

export interface EnhancedEmotionResult extends EmotionResult {
  emotions: {[key: string]: number};
  dominantEmotion: {
    name: string;
    score: number;
  };
}
