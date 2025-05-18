
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
  source?: 'facial' | 'voice' | 'text' | 'combined' | 'audio' | 'manual' | 'emoji';
  
  // Additional fields used by various components
  text?: string;
  feedback?: string;
  ai_feedback?: string; // Ajouté pour compatibilité
  score?: number;
  userId?: string;
  user_id?: string; // Legacy field - use userId instead
  date?: string; // Legacy field - use timestamp instead
  recommendations?: EmotionRecommendation[]; // Used by some components
}

export interface EmotionRecommendation {
  emotion?: string;
  category?: 'music' | 'vr' | 'exercise' | 'mindfulness' | 'general';
  content: string;
  title?: string;
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
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

// Interfaces pour les composants de scan des émotions
export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
}
