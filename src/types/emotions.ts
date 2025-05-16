
export interface Emotion {
  id: string;
  date: string;
  emotion: string;
  name: string;
  score: number;
  confidence: number;
  intensity: number;
  color: string;
  text: string;
  userId?: string;
  user_id?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence?: number;
  intensity?: number;
  color?: string;
  suggestions?: string[];
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface TeamOverviewProps {
  departmentId?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  displayMode?: 'chart' | 'grid' | 'list';
  period?: 'day' | 'week' | 'month' | 'year';
  anonymized?: boolean;
}
