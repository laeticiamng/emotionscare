
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  confidence: number;
  intensity: number;
  text?: string;
  feedback?: string;
  transcript?: string;
}

export interface EmotionResult {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  confidence: number;
  intensity: number;
  text?: string;
  feedback?: string;
  transcript?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: string) => void;
  autoStart?: boolean;
  continuous?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  userId?: string;
  period?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  dateRange: [Date, Date];
  departments?: string[];
  showIndividuals?: boolean;
  compact?: boolean;
}
