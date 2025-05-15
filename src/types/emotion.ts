
export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface EmotionResult {
  emotion: string;
  score?: number;
  confidence?: number;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  transcript?: string;
  emojis?: string[] | string;
  timestamp?: string | Date;
  [key: string]: any;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  insights?: string[];
  intensity?: number;
  duration?: number;
  relatedEmotions?: string[];
}

export interface Emotion {
  name: string;
  value: number;
  color: string;
  description?: string;
  icon?: string;
}

export interface EmotionalTeamViewProps {
  className?: string;
  teamId: string;
  userId: string;
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}
