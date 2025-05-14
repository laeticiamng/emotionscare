
export interface Emotion {
  id: string;
  user_id?: string;
  date: string;
  emotion: string;
  name?: string;
  sentiment: number;
  anxiety?: number;
  energy?: number;
  text?: string;
  score: number;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  id?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  tips?: string[];
  resources?: string[];
  relatedActivities?: string[];
}
