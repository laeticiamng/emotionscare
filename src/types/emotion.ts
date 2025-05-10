
export interface Emotion {
  id?: string;
  user_id?: string;
  date: string | Date;
  score: number;
  emotion: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
  timestamp?: string | Date; // Pour compatibilité
  created_at?: string | Date; // Pour compatibilité
}

export interface EmotionResult {
  emotion: string;
  score: number;
  feedback?: string;
}

export interface EmotionalTeamViewProps {
  userId: string;
  period: string;
  onRefresh?: () => void;
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: {
    activities?: string[];
    music?: string[];
    breathing?: string[];
  };
  timestamp: Date;
}
