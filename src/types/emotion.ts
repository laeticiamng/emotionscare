
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  category: string;
  color?: string;
  icon?: string;
  recommendations?: string[];
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  dominant_emotion?: string;
  score?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  ai_feedback?: string;
  emojis?: string;
  source?: string;
  audio_url?: string;
}

export interface EmotionResult {
  id?: string;
  name?: string;
  emotion: string;
  score: number;
  confidence?: number;
  color?: string;
  suggestions?: string[];
  relatedEmotions?: string[];
  primaryEmotion?: {
    name: string;
    score: number;
  };
  intensity?: number;
  feedback?: string;
  ai_feedback?: string;
  text?: string;
  transcript?: string;
  date?: string | Date;
  user_id?: string;
  recommendations?: string[];
  emojis?: string;
  source?: string;
  dominant_emotion?: string;
  description?: string;
  improvement_tips?: string[];
  audio_url?: string;
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
  description?: string;
  improvement_tips?: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  groupBy?: 'department' | 'location' | 'role';
  showDetails?: boolean;
  onUserClick?: (userId: string) => void;
  className?: string; // Ajout de className
}
