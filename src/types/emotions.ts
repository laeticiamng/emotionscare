
export interface Emotion {
  name: string;
  score: number;
  description?: string;
  color?: string;
  icon?: string;
}

export interface EmotionResult {
  dominant: string;
  emotions: {
    [key: string]: number;
  };
  timestamp: string | Date;
  userId?: string;
  notes?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  streamingMode?: boolean;
  showVisualizer?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
}
