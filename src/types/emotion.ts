
export interface Emotion {
  id: string;
  emotion: string;
  score: number;
  date: Date | string;
  userId?: string;
  user_id?: string;
  aiFeedback?: string;
  ai_feedback?: string;
  feedback?: string;
  emojis?: string;
  intensity?: number;
  confidence?: number;
  audioUrl?: string;
  audio_url?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence?: number;
  date?: string;
  feedback?: string;
  intensity?: number;
}

export interface EnhancedEmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  triggers?: string[];
  recommendations?: string[];
  feedback?: string;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
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
  department?: string;
}
