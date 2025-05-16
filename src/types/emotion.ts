
// Create emotion types file
export interface Emotion {
  name: string;
  score: number;
  color: string;
  icon?: string;
}

export interface EmotionResult {
  id: string; // Required prop
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string; // Use feedback instead of ai_feedback
  timestamp?: string;
  emojis?: string[];
  recommendations?: string[];
  triggers?: string[];
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
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  audioOnly?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
}
