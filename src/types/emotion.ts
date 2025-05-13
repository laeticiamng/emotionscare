
export interface EmotionData {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  date: string;
  feedback?: string;
}

export interface EmotionScoreTrend {
  date: string;
  value: number;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  className?: string;
  userId: string;
  period: 'day' | 'week' | 'month';
  onRefresh?: () => void;
}
