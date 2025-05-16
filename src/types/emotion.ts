
// Create emotion types file
export interface Emotion {
  name: string;
  score: number;
  color: string;
  icon?: string;
  emotion?: string; // Added to fix EnhancedEmotionAnalysis errors
  confidence?: number; // Added to fix EnhancedEmotionAnalysis errors
  intensity?: number; // Added to fix missing properties in components
}

export interface EmotionResult {
  id: string; // Required prop
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string; // Use feedback instead of ai_feedback
  timestamp?: string;
  emojis?: string | string[];
  recommendations?: string[];
  triggers?: string[];
  // Add missing properties that are used in components
  user_id?: string;
  date?: string | Date;
  intensity?: number;
  transcript?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  recommendations?: string[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  scanDuration?: number;
  stopAfterSeconds?: number;
  duration?: number;
  className?: string;
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  audioOnly?: boolean;
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
