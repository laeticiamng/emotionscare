/**
 * Feature: Grounding
 * Techniques d'ancrage et exercices de présence
 */

// ============================================================================
// COMPONENTS
// ============================================================================
export { default as FiveFourThreeTwoOneCard } from './FiveFourThreeTwoOneCard';

// ============================================================================
// TYPES
// ============================================================================
export interface GroundingSession {
  id: string;
  user_id: string;
  technique_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds: number;
  anxiety_before?: number;
  anxiety_after?: number;
  notes?: string;
}

export interface GroundingTechnique {
  id: string;
  name: string;
  description: string;
  steps: GroundingStep[];
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  category: GroundingCategory;
}

export interface GroundingStep {
  order: number;
  instruction: string;
  duration_seconds?: number;
  sense?: 'sight' | 'sound' | 'touch' | 'smell' | 'taste';
  count?: number;
}

export type GroundingCategory = 
  | '5-4-3-2-1'
  | 'body-scan'
  | 'object-focus'
  | 'breath-anchor'
  | 'safe-place';

export interface GroundingProgress {
  total_sessions: number;
  techniques_mastered: string[];
  favorite_technique: string;
  avg_anxiety_reduction: number;
  streak_days: number;
}

// ============================================================================
// DEFAULT TECHNIQUES
// ============================================================================
export const DEFAULT_GROUNDING_TECHNIQUES: GroundingTechnique[] = [
  {
    id: '5-4-3-2-1',
    name: 'Technique 5-4-3-2-1',
    description: 'Ancrage sensoriel progressif utilisant les 5 sens',
    steps: [
      { order: 1, instruction: 'Nommez 5 choses que vous voyez', sense: 'sight', count: 5 },
      { order: 2, instruction: 'Nommez 4 choses que vous pouvez toucher', sense: 'touch', count: 4 },
      { order: 3, instruction: 'Nommez 3 choses que vous entendez', sense: 'sound', count: 3 },
      { order: 4, instruction: 'Nommez 2 choses que vous sentez', sense: 'smell', count: 2 },
      { order: 5, instruction: 'Nommez 1 chose que vous goûtez', sense: 'taste', count: 1 },
    ],
    duration_minutes: 5,
    difficulty: 'beginner',
    benefits: ['Réduit l\'anxiété', 'Ramène au présent', 'Calme les pensées'],
    category: '5-4-3-2-1',
  },
  {
    id: 'body-scan-quick',
    name: 'Body Scan Rapide',
    description: 'Parcours rapide des sensations corporelles',
    steps: [
      { order: 1, instruction: 'Portez attention à vos pieds', duration_seconds: 30 },
      { order: 2, instruction: 'Remontez vers vos jambes', duration_seconds: 30 },
      { order: 3, instruction: 'Observez votre abdomen', duration_seconds: 30 },
      { order: 4, instruction: 'Sentez votre poitrine', duration_seconds: 30 },
      { order: 5, instruction: 'Détendez vos épaules et bras', duration_seconds: 30 },
      { order: 6, instruction: 'Relâchez votre visage', duration_seconds: 30 },
    ],
    duration_minutes: 3,
    difficulty: 'beginner',
    benefits: ['Reconnexion au corps', 'Détente musculaire', 'Présence'],
    category: 'body-scan',
  },
  {
    id: 'safe-place',
    name: 'Lieu Sûr',
    description: 'Visualisation d\'un endroit apaisant et sécurisant',
    steps: [
      { order: 1, instruction: 'Fermez les yeux et respirez profondément', duration_seconds: 30 },
      { order: 2, instruction: 'Imaginez un lieu où vous vous sentez en sécurité', duration_seconds: 60 },
      { order: 3, instruction: 'Observez les détails visuels de ce lieu', duration_seconds: 45 },
      { order: 4, instruction: 'Écoutez les sons apaisants', duration_seconds: 45 },
      { order: 5, instruction: 'Ressentez la sécurité et le calme', duration_seconds: 60 },
    ],
    duration_minutes: 4,
    difficulty: 'intermediate',
    benefits: ['Sentiment de sécurité', 'Réduction du stress', 'Ressource interne'],
    category: 'safe-place',
  },
];
