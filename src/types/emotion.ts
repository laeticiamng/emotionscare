
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
  name?: string; // Add this property
}

export interface EmotionResult {
  emotion: string;
  intensity?: number;
  confidence?: number;
  score?: number;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
}

export interface EnhancedEmotionResult extends EmotionResult {
  displayName: string;
  color: string;
  icon: string;
  description: string;
  musicType: string;
}
