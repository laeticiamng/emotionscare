
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion?: string;
  name?: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
  is_confidential?: boolean;
  share_with_coach?: boolean;
  score?: number;
  confidence?: number;
  category?: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  confidence: number;
  score?: number;
  intensity?: number;
  dominantEmotion?: string;
  primaryEmotion?: {
    name: string;
    score?: number;
  };
  secondaryEmotion?: string;
  secondaryEmotions?: string[];
  triggers?: string[];
  recommendations?: string[];
  text?: string;
  transcript?: string;
  feedback?: string;
  ai_feedback?: string;
  emojis?: string;
  timestamp?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis: {
    intensity: number;
    valencia: number;
    duration: number;
  };
  historical: {
    trend: 'improving' | 'worsening' | 'stable';
    comparedToLastWeek: number;
  };
  insights: string[];
}

export interface EmotionalData {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number;
  triggers: string[];
  timestamp: string;
  userId: string;
  audioAnalysis?: {
    tone: string;
    pitch: number;
    speed: number;
    pauses: number;
  };
  textAnalysis?: {
    sentiment: number;
    keywords: string[];
    negations: number;
    intensifiers: number;
  };
}

export interface EmotionalTeamViewProps {
  userId: string;
  period?: string;
  teamId: string;
  className?: string;
  onRefresh?: () => Promise<void>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
