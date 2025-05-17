
export interface Emotion {
  id: string;
  date: string;
  emotion: string;
  score: number;
}

export interface EmotionResult {
  id: string;
  userId?: string;
  user_id?: string;
  timestamp?: string;
  date?: string;
  emotion?: string;
  primaryEmotion?: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  emojis?: string | string[];
  text?: string;
  transcript?: string;
  audio_url?: string;
  audioUrl?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
  emotions?: Record<string, number>;
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  language?: string;
  autoStart?: boolean;
  duration?: number;
  className?: string;
  withAI?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: any;
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period: 'day' | 'week' | 'month';
  anonymized?: boolean;
}
