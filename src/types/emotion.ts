
// Types liés aux émotions et analyses émotionnelles
export interface Emotion {
  id: string;
  emotion: string;
  score: number;
  date: string | Date;
  userId?: string;
  user_id?: string;
  aiFeedback?: string;
  ai_feedback?: string;
  text?: string;
  emojis?: string;
  anxiety?: number;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score?: number;
  confidence: number;
  timestamp?: Date | string;
  transcript?: string;
  text?: string;
  triggers?: string[];
  recommendations?: string[];
  ai_feedback?: string;
  audio_url?: string;
  intensity?: number;
  secondary?: string[];
  user_id?: string;
  emojis?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  sentiment?: number;
  context?: string;
  duration?: number;
  date?: Date | string;
}

export interface VoiceEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onEmotionUpdate?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  timeframe?: string;
}

export interface TeamOverviewProps {
  department: string;
  showDetails?: boolean;
}
