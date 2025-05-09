
// Enhanced emotion types used in more advanced emotion analysis components
export interface EnhancedEmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  confidence: number;
  score?: number;
  transcript?: string;
  text?: string;
  emojis?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
  intensity?: number;
  analysis?: {
    primary_emotion?: string;
    secondary_emotion?: string;
    intensity?: number;
    valence?: number;
    arousal?: number;
  };
  contextual_data?: {
    time_of_day?: string;
    activity?: string;
    location?: string;
    social_context?: string;
  };
}

// Export back the basic types for backward compatibility
export type { Emotion, EmotionResult } from './index';
