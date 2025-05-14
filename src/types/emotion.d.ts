
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  anxiety?: number; // Add anxiety field
  energy?: number;   // Add energy field
}

export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  dominantEmotion: string;
  text?: string;
  emojis?: string;
  timestamp: string;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: string[];
  insights?: string[];
  relatedActivities?: {
    id: string;
    title: string;
    description: string;
    duration: number;
  }[];
}
