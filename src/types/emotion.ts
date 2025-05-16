
export interface Emotion {
  emotion: string;
  intensity?: number;
  score?: number;
}

export interface EmotionResult {
  id: string;
  user_id?: string;
  emotion: string;
  emojis?: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  timestamp?: string;
  date?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  suggestions?: string[];
  risk_level?: 'low' | 'medium' | 'high';
}

export interface EmotionalTeamViewProps {
  teamData: Array<{
    user: { id: string; name: string; avatar?: string };
    emotion: EmotionResult;
  }>;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  stopAfterSeconds?: number;
  className?: string;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
  showVisualizer?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamData?: Array<{
    user: { id: string; name: string; avatar?: string };
    emotion: EmotionResult;
  }>;
  anonymized?: boolean;
  className?: string;
  dateRange?: { start: Date; end: Date };
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface AudioProcessorProps {
  onResultReady?: (result: EmotionResult) => void;
  autoStart?: boolean;
  maxDuration?: number;
  headerText?: string;
  subHeaderText?: string;
  onResult?: (result: EmotionResult) => void;
}

export interface EmotionTrendChartProps {
  emotions: EmotionResult[];
  period?: 'day' | 'week' | 'month' | 'year';
}
