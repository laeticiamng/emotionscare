
// Types related to emotions and emotional analysis

export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  date: string;
  score: number;
  text?: string;
  emojis?: string[];
  ai_feedback?: string;
  intensity?: number;
  source?: string;
  transcript?: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  confidence: number;
  score?: number;
  transcript?: string;
  text?: string;
  emojis?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
}

// Related types for emotion charting
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}
