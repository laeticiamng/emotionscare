
export interface Emotion {
  id: string;
  user_id: string;
  date: string | Date;
  emotion: string;
  score?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  ai_feedback?: string;
  recommendations?: string[];
  emojis?: string;
  primaryEmotion?: {
    name: string;
  };
  intensity?: number;
}

export interface EmotionResult {
  id: string;
  user_id?: string;
  date?: string | Date;
  emotion: string;
  confidence: number;
  score: number;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  transcript?: string;
  text?: string;
  emojis?: string;
  intensity?: number;
  primaryEmotion?: {
    name: string;
  };
}

export interface EmotionalTeamViewProps {
  className?: string;
  teamId?: string;
  viewMode?: 'summary' | 'detailed';
}

export interface EnhancedEmotionResult extends EmotionResult {
  detailedAnalysis?: {
    strengths?: string[];
    challenges?: string[];
    recommendations?: string[];
  };
  historicalContext?: {
    trends?: string;
    compareToLastWeek?: number;
  };
}
