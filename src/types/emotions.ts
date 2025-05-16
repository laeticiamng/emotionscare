
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  color: string;
  icon?: string;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  intensity: number;
  confidence?: number;
  date?: Date;
  text?: string;
  transcript?: string;
  recommendations?: string[];
  audioUrl?: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onBack?: () => void;
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
}

export interface EmotionalTeamViewProps {
  teamId: string;
}
