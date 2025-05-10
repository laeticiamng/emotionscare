
export interface Emotion {
  name: string;
  value: number;
  color: string;
  icon?: string;
  category?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  intensity?: number;
  confidence?: number;
  timestamp?: string | Date;
  metadata?: Record<string, any>;
}

export interface EmotionalTeamViewProps {
  className?: string;
}
