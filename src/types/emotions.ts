
/**
 * Emotion Types
 * --------------------------------------
 * This file defines the official types for emotion detection and processing.
 * Any new property or correction must be documented here and synchronized across all components.
 */

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp?: string;
  emojis: string[] | string;
  source?: 'facial' | 'voice' | 'text' | 'combined' | 'manual' | 'scan' | 'fallback';
  
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
  period?: 'day' | 'week' | 'month';
  dateRange?: [Date, Date];
  departments?: string[];
  showIndividuals?: boolean;
  compact?: boolean;
  anonymized?: boolean;
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  startDate?: string;
  endDate?: string;
  showNames?: boolean;
}
