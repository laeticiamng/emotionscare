
export interface Emotion {
  name: string;
  value: number;
  color: string;
  icon?: string;
  description?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  value: number;
  timestamp: Date | string;
  user_id: string;
  text?: string;
  transcript?: string;
  source?: string;
  confidence?: number;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  recommendations?: string[];
  relatedEmotions?: Emotion[];
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  showFilters?: boolean;
}
