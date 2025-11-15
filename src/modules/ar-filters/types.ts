/**
 * Types pour le module AR Filters
 * Filtres de réalité augmentée pour l'expression émotionnelle
 */

export interface ARFilterSession {
  id: string;
  user_id: string;
  filter_type: string;
  duration_seconds: number;
  photos_taken: number;
  mood_impact?: string;
  created_at: string;
  completed_at?: string;
}

export interface ARFilterStats {
  totalSessions: number;
  totalPhotosTaken: number;
  favoriteFilter: string;
  averageDuration: number;
}

export type FilterType =
  | 'joy'
  | 'calm'
  | 'energy'
  | 'creativity'
  | 'confidence'
  | 'serenity'
  | 'playful'
  | 'focused';

export interface ARFilterConfig {
  id: string;
  name: string;
  type: FilterType;
  description: string;
  icon: string;
  emotionalBenefit: string;
}
