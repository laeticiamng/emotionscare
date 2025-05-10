
export interface Emotion {
  id: string;
  user_id: string;
  date: Date | string;
  score?: number;
  // Add dominant_emotion property and rename to emotion for backwards compatibility
  dominant_emotion?: string;
  emotion?: string;
  name?: string;
  emotions_detected?: Record<string, number>;
  text?: string;
  emojis?: string;
  audio_url?: string;
  image_url?: string;
  ai_feedback?: string;
  feedback?: string;
  source?: string;
  confidence?: number;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: Date | string;
  emotion: string;
  score: number;
  confidence: number;
  intensity?: number;
  source?: string;
  primaryEmotion?: {
    name: string;
    score: number;
  };
  text?: string;
  transcript?: string;
  emojis?: string;
  ai_feedback?: string;
  feedback?: string;
  recommendations?: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  className?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  description: string;
  color: string;
  improvement_tips: string[];
  feedback?: string;
  recommendations?: string[];
}
