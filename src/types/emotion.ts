
// Define types for emotion tracking and analysis

export interface Emotion {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  intensity?: number;
  description?: string;
  category?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  date: string;
  score: number;
  intensity?: number;
  confidence?: number;
  dominantEmotion?: string;
  text?: string;
  source?: string;
  feedback?: string;
  ai_feedback?: string;
  timestamp?: string;
  anxiety?: number;
  recommendations?: string[];
  triggers?: string[];
  emojis?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis?: {
    triggers: string[];
    patterns: string[];
    recommendations: string[];
  };
  relatedEntries?: any[];
}

export interface EmotionalData {
  emotion: string;
  intensity: number;
  source?: string;
  feedback?: string;
  triggers?: string[];
  timestamp?: string;
  date?: string;
}
