// Export all types from this central file for consistency

// Music types
export * from './music';

// Existing type exports below
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  score?: number;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence?: number;
  score?: number;
  emojis?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
  ai_feedback?: string;
}

// Add any missing types here
