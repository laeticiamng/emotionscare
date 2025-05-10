
export interface Emotion {
  id: string;
  user_id: string;
  date: Date | string;
  score?: number;
  dominant_emotion?: string;
  emotions_detected?: Record<string, number>;
  text?: string;
  emojis?: string;
  audio_url?: string;
  image_url?: string;
  ai_feedback?: string;
  source?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  source?: string;
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
}
