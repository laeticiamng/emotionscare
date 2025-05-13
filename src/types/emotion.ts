
// Basic emotion types
export interface Emotion {
  id: string;
  name: string;
  intensity?: number;
  category?: string;
  color?: string;
}

export interface EmotionData {
  userId: string;
  date: string;
  emotion: string;
  score: number;
  feedback?: string;
}

// Component props types
export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  showDetails?: boolean;
  anonymized?: boolean;
}

export interface EmotionCardProps {
  emotion: Emotion;
  size?: 'sm' | 'md' | 'lg';
  showIntensity?: boolean;
  onSelect?: (emotion: Emotion) => void;
}

export interface EmotionSelectorProps {
  selectedEmotion?: string;
  onEmotionSelect: (emotion: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'carousel' | 'wheel';
}
