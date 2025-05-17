
export interface Emotion {
  id: string;
  name: string;  
  label: string;
  color: string;
  intensity: number;
  icon?: string;
  emoji?: string;
  emotion?: string; // Pour la compatibilité avec certains hooks
  user_id?: string;
  date?: string;
  score?: number;
  confidence: number;
  text?: string;
  feedback?: string;
  transcript?: string;
  timestamp?: string;
  source?: string;
  audioUrl?: string;
  textInput?: string;
  facialExpression?: string;
  category?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  timestamp?: string;
  source?: string;
  audioUrl?: string;
  textInput?: string;
  facialExpression?: string;
  score?: number;
  text?: string;
  emojis?: string[] | string;
  user_id?: string;
  userId?: string;
  date?: string;
  audio_url?: string;
  ai_feedback?: string;
  feedback?: string;
  primary_emotion?: string;
  emotions?: Record<string, number | undefined>;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  details?: Record<string, number>;
  duration?: number;
  category?: string;
  predictedEmotion?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  dominantEmotion: {
    name: string;
    score: number;
  }
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  onFinish?: () => void;
  automaticMode?: boolean;
  instruction?: string;
  buttonText?: string;
  autoStart?: boolean;
  language?: string;
  duration?: number;
  className?: string;
  withAI?: boolean;
  onError?: (error: string) => void;
  continuous?: boolean;
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
  period?: 'day' | 'week' | 'month';
  dateRange?: [Date, Date];
  departments?: string[];
  showIndividuals?: boolean;
  compact?: boolean;
  anonymized?: boolean;
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

// Exporter EmotionalData
export * from './emotional-data';
