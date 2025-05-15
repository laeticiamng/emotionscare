
export interface Emotion {
  id: string;
  name: string;
  emotion?: string;
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
  id?: string;
  user_id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  intensity?: number;
  text?: string;
  transcript?: string;
  emojis?: string[] | string;
  timestamp?: string;
  date?: string;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  audio_url?: string;
  audioUrl?: string;
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
  departmentId?: string;
  users?: any[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
  period?: 'day' | 'week' | 'month' | 'year' | string;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
  showAvatar?: boolean;
}
