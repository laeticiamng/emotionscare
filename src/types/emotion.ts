
// Basic emotion types
export type EmotionType = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'surprise' 
  | 'disgust' 
  | 'neutral'
  | 'calm' 
  | 'anxious'
  | 'content'
  | 'stressed'
  | string;

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: EmotionType;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  share_with_team?: boolean;
  share_with_coach?: boolean;
  is_confidential?: boolean;
  category?: 'positive' | 'negative' | 'neutral' | 'other';
  intensity?: number;
  confidence?: number;
  tags?: string[];
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: EmotionType;
  primaryEmotion?: EmotionType;  // Added for backward compatibility
  score: number;
  text?: string;
  transcript?: string;  // For audio transcriptions
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  confidence?: number;
  intensity?: number;
  source?: 'text' | 'audio' | 'camera' | 'manual';
  triggers?: string[];
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  detailedAnalysis?: {
    negativePatterns?: string[];
    positivePatterns?: string[];
    longTermTrend?: string;
    suggestedActions?: string[];
  };
  historicalContext?: {
    previousEmotions: EmotionResult[];
    trend: 'improving' | 'declining' | 'stable';
    duration: string;
  };
}

export interface EmotionalTeamViewProps {
  teamId: string;
  anonymized?: boolean;
  period?: 'day' | 'week' | 'month';
  onUserClick?: (userId: string) => void;
}
