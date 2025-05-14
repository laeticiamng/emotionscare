
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

export interface Emotion {
  id: string;
  user_id: string;
  date: any;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string | null;
  ai_feedback?: string;
  created_at?: string;
  confidence?: number;
  intensity?: number;
  name?: string;
  category?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}

export interface EmotionalTeamViewProps {
  teamId: string;
  timeframe?: string;
}

