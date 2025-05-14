
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  name?: string;
  emotion?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
  ai_feedback?: string;
  category?: string;
  score?: number;
  intensity?: number; // Adding this for components that need it
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number;
  primaryEmotion?: {
    name: string;
    score: number;
  };
  secondaryEmotions?: string[];
  transcript?: string;
  text?: string;
  emojis?: string;
  feedback?: string;
  score?: number;
  ai_feedback?: string;
  date?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: string[];
  triggers?: string[];
  suggestions?: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  startDate?: Date;
  endDate?: Date;
  anonymized?: boolean;
}
