
export interface Emotion {
  id: string;
  name: string;
  score: number;
  color: string;
  icon?: string;
  date?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number; // Added for compatibility
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score: number;
  confidence?: number;
  timestamp?: string;
  recommendations?: string[];
  triggers?: string[];
  emojis?: string | string[];
  feedback?: string;
  date?: string;
  text?: string;
  transcript?: string;
  intensity?: number;
  user_id?: string;
  audioUrl?: string; // Added for compatibility
  audio_url?: string; // Added for compatibility
  ai_feedback?: string; // Added for backward compatibility
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
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  showTranscript?: boolean;
  autoStart?: boolean;
  className?: string; // Added for compatibility
  stopAfterSeconds?: number; // Added for compatibility
  duration?: number; // Added for compatibility
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  quickMode?: boolean;
  showFeedback?: boolean;
  onResult?: (result: EmotionResult) => void; // Added for compatibility
  duration?: number; // Added for compatibility
  autoStart?: boolean; // Added for compatibility
  showVisualizer?: boolean; // Added for compatibility
  className?: string; // Added for compatibility
}

// Add TeamOverviewProps since it's being imported
export interface TeamOverviewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month' | 'year';
  showNames?: boolean;
  compact?: boolean;
}
