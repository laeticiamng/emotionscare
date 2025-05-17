
export interface Emotion {
  id: string;
  name: string;  
  label: string;
  color: string;
  intensity: number;
  icon?: string;
  emoji?: string;
  emotion?: string; // Pour compatibilité avec certains hooks
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp?: string;
  source?: string;
  audioUrl?: string;
  textInput?: string;
  facialExpression?: string;
  score?: number; // Pour compatibilité
  text?: string; // Pour compatibilité
  emojis?: string[]; // Pour compatibilité
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
}
