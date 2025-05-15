
export interface Emotion {
  id: string;
  name: string;
  score?: number;
  color: string;
  description?: string;
  recommendations?: string[];
  date?: string | Date;
  emojis?: string[];
  ai_feedback?: string;
  feedback?: string;
  intensity?: number;
  confidence?: number;
  audioUrl?: string;
  audio_url?: string;
  text?: string;
}

export interface EmotionResult {
  emotion: string;
  score?: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
  feedback?: string;
  intensity?: number;
  date?: string | Date;
  emojis?: string[];
  ai_feedback?: string;
  audioUrl?: string;
  audio_url?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  insights?: string[];
  trendData?: { date: string; value: number }[];
  historicalComparison?: {
    improvement: number;
    period: string;
  };
  suggestedActions?: {
    title: string;
    description: string;
    priority: number;
  }[];
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
  showAvatar?: boolean;
}
