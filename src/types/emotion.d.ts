
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  color: string;
  icon?: string;
  category?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  timestamp: string;
  feedback?: string;
  text?: string;
  date?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  className?: string;
}

export interface EmotionalTeamViewProps {
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
    currentEmotion?: string;
    emotionalTrend?: 'up' | 'down' | 'stable';
  }>;
  className?: string;
}
