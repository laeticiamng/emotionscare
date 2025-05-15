
export interface Emotion {
  id: string;
  name: string;
  score: number;
  color: string;
  icon?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence?: number;
  timestamp?: string;
  recommendations?: string[];
  triggers?: string[];
  emojis?: string | string[];
  feedback?: string; // Made sure this exists
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis?: string;
  recommendations: string[];
  triggers: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month' | 'year';
  userId?: string;
  anonymized?: boolean;
  className?: string; // Added this property
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  showTranscript?: boolean;
  autoStart?: boolean;
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  quickMode?: boolean;
  showFeedback?: boolean;
}
