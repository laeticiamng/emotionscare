
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string | null;
  ai_feedback?: string;
  created_at?: string;
  confidence?: number;
  intensity?: number;
  name?: string;
  category?: string;
  source?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
    score?: number;
  };
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  confidence?: number;
  feedback?: string;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  source?: string;
  audio_url?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
    score?: number;
  };
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion?: string;
  probability: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  enhancedFeedback?: string;
  detailedAnalysis?: {
    causes?: string[];
    suggestions?: string[];
    insights?: string;
  };
  relatedJournalPrompts?: string[];
  audioSuggestions?: {
    type: string;
    title: string;
    description: string;
  }[];
}

export interface EmotionalTeamViewProps {
  userId?: string;
  period?: string;
  teamId?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
}
