
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  triggers?: string[];
  recommendations?: string[];
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
