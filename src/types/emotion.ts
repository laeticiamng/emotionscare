
export interface Emotion {
  name: string;
  value: number;
  color: string;
  icon?: string;
  category?: string;
  intensity?: number;
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  text?: string;
  transcript?: string;
  ai_feedback?: string;
  recommendations?: string[];
  emojis?: string;
  confidence?: number;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  intensity?: number;
  confidence?: number;
  timestamp?: string | Date;
  metadata?: Record<string, any>;
  score?: number;
  text?: string;
  transcript?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  emojis?: string;
  date?: string;
  primaryEmotion?: Emotion;
}

export interface EnhancedEmotionResult {
  emotion: string;
  confidence: number;
  feedback?: string;
  recommendations?: string[];
  transcript?: string;
}

export interface EmotionalTeamViewProps {
  className?: string;
}
