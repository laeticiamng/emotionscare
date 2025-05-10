
// Update the Emotion interface to allow for string arrays in emojis
export interface Emotion {
  id: string;
  user_id: string;
  date: string | Date;
  emotion: string;
  confidence: number;
  intensity?: number;
  emojis?: string | string[]; // Allow both string and string array
  text?: string;
  ai_feedback?: string;
  score?: number;
  name?: string;
}

export interface EmotionResult {
  emotion: string;
  intensity?: number;
  confidence?: number;
  score?: number;
  primaryEmotion?: {
    name: string;
    confidence: number;
  };
  id?: string;
  user_id?: string;
  ai_feedback?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
  date?: string | Date;
  emojis?: string | string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  className?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  displayName: string;
  color: string;
  icon: string;
  description: string;
  musicType: string;
}
