
// Types liés aux émotions
export interface Emotion {
  id: string;
  name: string;
  color: string;
  intensity?: number;
  icon?: string;
  description?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp?: Date | string;
  triggers?: string[];
  intensity?: number;
  secondary?: string[];
  userId?: string;
  // Add the missing properties that were causing errors
  emojis?: string | string[];
  ai_feedback?: string;
  recommendations?: string[];
  text?: string;
  id?: string;
  user_id?: string;
  date?: string;
  feedback?: string;
  audio_url?: string;
  transcript?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  color: string;
  icon?: string;
  recommendations?: string[];
  suggestedActivities?: string[];
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  onEmotionDetected?: (emotion: string, result: EmotionResult) => void;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onEmotionDetected?: (emotion: string, result: EmotionResult) => void;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}
