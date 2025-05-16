
export interface Emotion {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  score?: number;
  confidence?: number;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  timestamp?: string | Date;
  date?: string;
  source?: 'text' | 'voice' | 'face' | 'manual';
  user_id?: string;
  text?: string;
  feedback?: string;
  transcript?: string;
  intensity?: number;
  recommendations?: string[];
  seen?: boolean;
}

export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: "day" | "week" | "month" | "year";
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: "day" | "week" | "month" | "year";
  userId?: string;
  anonymized?: boolean;
  className?: string;
}
