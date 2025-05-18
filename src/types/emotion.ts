
/**
 * Types officiels pour le domaine emotion.
 * Toute modification doit être synchronisée dans tous les mocks et composants.
 * Ne jamais dupliquer ce type en local.
 */

export type EmotionIntensity = 'low' | 'medium' | 'high' | number;

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp?: string;
  emojis: string[];
  source?: 'facial' | 'voice' | 'text' | 'combined';
  
  // Additional fields used by various components
  text?: string;
  feedback?: string;
  score?: number;
  userId?: string;
  user_id?: string; // Legacy field - use userId instead
  date?: string; // Legacy field - use timestamp instead
  recommendations?: EmotionRecommendation[]; // Used by some components
}

export interface EmotionRecommendation {
  id: string;
  type: 'music' | 'activity' | 'exercise' | 'content';
  title: string;
  description?: string;
  emoji?: string;
  actionText?: string;
  actionUrl?: string;
}

export interface Emotion {
  name: string;
  label?: string;
  emoji: string;
  color: string;
  intensity?: number;
  description?: string;
  keywords?: string[];
}

export interface EmotionData {
  id: string;
  userId: string;
  user_id?: string; // Legacy field - use userId instead
  emotion: string;
  intensity: number;
  timestamp: string;
  source: string;
  text?: string;
  context?: string;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  startDate?: string;
  endDate?: string;
  showNames?: boolean;
}
