
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  category: string;
  color?: string;
  icon?: string;
  recommendations?: string[];
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence?: number;
  color?: string;
  suggestions?: string[];
  relatedEmotions?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis: string;
  recommendations: {
    activities: string[];
    music: string[];
    breathingExercises: string[];
  };
  insights: string[];
  triggers: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  groupBy?: 'department' | 'location' | 'role';
  showDetails?: boolean;
  onUserClick?: (userId: string) => void;
}
