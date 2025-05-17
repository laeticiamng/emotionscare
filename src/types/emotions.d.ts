
export interface Emotion {
  id: string;
  name: string;
  intensity?: number;
  date?: string;
  value?: number;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp?: string;
  context?: string;
  source?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
}
