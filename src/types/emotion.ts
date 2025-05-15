
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
  intensity?: number;
  confidence?: number;
  audioUrl?: string;
  audio_url?: string;
  feedback?: string;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  timestamp?: Date | string;
  transcript?: string;
  text?: string;
  triggers?: string[];
  recommendations?: string[];
  ai_feedback?: string;
  audio_url?: string;
  audioUrl?: string;
  intensity?: number;
  secondary?: string[];
  user_id?: string;
  emojis?: string;
  feedback?: string;
  date?: string | Date;
}

export interface EnhancedEmotionResult extends EmotionResult {
  sentiment?: number;
  context?: string;
  duration?: number;
  date?: Date | string;
}

export interface VoiceEmotionScannerProps {
  onEmotionDetected?: (emotion: string, result?: any) => void;
  onResult?: (result: any) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onEmotionUpdate?: (result: EmotionResult) => void;
  onResult?: (result: any) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  timeframe?: string;
  departmentId?: string;
  users?: any[];
  anonymized?: boolean;
  period?: string;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
  onUserClick?: (userId: string) => void;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
  department?: string;
  showDetails?: boolean;
}
