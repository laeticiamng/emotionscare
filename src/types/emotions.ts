
export interface Emotion {
  id: string;
  name: string;  // Ajout du champ name manquant
  label: string;
  color: string;
  intensity: number;
  icon?: string;
  emoji?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp?: string;
  source?: string;
  audioUrl?: string;
  textInput?: string;
  facialExpression?: string;
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
