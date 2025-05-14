
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
  audio_url?: string;
  source?: string;
  category?: string;
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
  dominantEmotion?: string;
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
  error?: string;
  faceDetected?: boolean;
  timestamp?: string;
}

export type EnhancedEmotionResult = EmotionResult & {
  detailedAnalysis?: string;
  triggers?: string[];
  coping_strategies?: string[];
  historical_context?: {
    previous_emotions: string[];
    trend: 'improving' | 'worsening' | 'stable';
  };
};

export interface EmotionalTeamViewProps {
  className?: string;
  teamId: string;
  userId?: string;
  period?: string;
  onRefresh?: () => void;
}

export interface EmotionalData {
  id?: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  context?: string;
  source?: string;
  feedback?: string;
  userId?: string;
  user_id?: string;
}
