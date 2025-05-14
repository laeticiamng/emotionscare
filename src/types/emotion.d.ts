
export interface Emotion {
  id: string;
  user_id?: string;
  date?: string | Date;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  emojis?: string;
  transcript?: string;
  audio_url?: string;
  ai_feedback?: string;
  recommendations?: string[];
  triggers?: string[];
  feedback?: string;
  timestamp?: string;
  category?: string;
  anxiety?: number;
  energy?: number;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  text?: string;
  emojis?: string;
  transcript?: string;
  timestamp?: string;
  date?: string;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  user_id?: string;
  intensity?: number;
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

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  className?: string;
  onRefresh?: () => void;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
