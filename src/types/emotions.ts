
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  audioUrl?: string;
  ai_feedback?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  duration?: number;
}

export interface Emotion {
  id: string;
  name: string;
  color: string;
  description?: string;
  icon?: string;
  value?: number;
  intensity?: number;
  category?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  timestamp?: string | Date;
  user_id?: string;
  trigger?: string;
  triggers?: string[];
  recommendations?: string[];
  action_items?: string[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  className?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  className?: string;
}
