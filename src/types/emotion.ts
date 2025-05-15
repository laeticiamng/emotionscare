
export interface Emotion {
  id: string;
  name: string;
  color: string;
  icon?: string;
  intensity?: number;
  description?: string;
  category?: string;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score?: number;
  intensity?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  feedback?: string;
  ai_feedback?: string;
  date?: string | Date;
  timestamp?: string | Date;
  user_id?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  colorCode?: string;
  recommendations?: string[];
  triggers?: string[];
  historicalContext?: any;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
  showVisualizer?: boolean;
  className?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  className?: string;
  stopAfterSeconds?: number;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  userId: string;
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  className?: string;
  period?: 'day' | 'week' | 'month';
}
