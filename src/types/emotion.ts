
export interface EmotionRecord {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  name: string;
  score: number;
  intensity?: number;
  confidence?: number;
  category?: string;
  source?: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}

export interface EmotionResultRecord {
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  timestamp?: string;
  confidence?: number;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  name?: string;
  score: number;
  intensity?: number;
  confidence?: number;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  source?: string;
  category?: string; // Adding category property
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  primaryEmotion?: {
    name: string;
    score?: number;
  };
  dominantEmotion?: string; // Adding for scanners
  name?: string;
  score: number;
  intensity?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
}

export interface EmotionalTeamViewProps {
  className?: string;
  teamId: string;
  userId?: string;
  period?: string;
  onRefresh?: () => void;
}
