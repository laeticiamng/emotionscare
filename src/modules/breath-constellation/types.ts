/**
 * Types pour le module Breath Constellation
 * Respiration guidée avec visualisation en constellation
 */

import { z } from 'zod';

// ============================================================================
// ENUMS & BASIC TYPES
// ============================================================================

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type ConstellationType = 'orion' | 'cassiopeia' | 'ursa-major' | 'pleiades' | 'custom';
export type SessionDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface BreathConstellationConfig {
  /** Type de constellation pour la visualisation */
  constellation: ConstellationType;
  /** Durée d'inspiration en secondes */
  inhaleSeconds: number;
  /** Durée de rétention en secondes */
  holdSeconds: number;
  /** Durée d'expiration en secondes */
  exhaleSeconds: number;
  /** Durée de repos entre cycles en secondes */
  restSeconds: number;
  /** Nombre total de cycles */
  totalCycles: number;
  /** Difficulté de la session */
  difficulty: SessionDifficulty;
  /** Couleur principale de la constellation (HSL) */
  primaryColor?: string;
  /** Activer les sons ambiants */
  ambientSounds?: boolean;
  /** Activer le feedback haptique */
  hapticFeedback?: boolean;
}

// ============================================================================
// SESSION
// ============================================================================

export interface BreathConstellationSession {
  id: string;
  userId: string;
  config: BreathConstellationConfig;
  startedAt: string;
  completedAt?: string;
  /** Nombre de cycles complétés */
  cyclesCompleted: number;
  /** Durée totale en secondes */
  durationSeconds: number;
  /** État émotionnel avant (1-10) */
  moodBefore?: number;
  /** État émotionnel après (1-10) */
  moodAfter?: number;
  /** Notes utilisateur */
  notes?: string;
  /** Étoiles connectées pendant la session */
  starsConnected: number;
  /** Score de régularité respiratoire (0-100) */
  breathingRegularity: number;
}

export interface CreateBreathConstellationSession {
  config: BreathConstellationConfig;
  moodBefore?: number;
}

export interface CompleteBreathConstellationSession {
  sessionId: string;
  cyclesCompleted: number;
  durationSeconds: number;
  moodAfter?: number;
  notes?: string;
  starsConnected: number;
  breathingRegularity: number;
}

// ============================================================================
// STATS
// ============================================================================

export interface BreathConstellationStats {
  totalSessions: number;
  totalMinutes: number;
  averageCyclesPerSession: number;
  favoriteConstellation: ConstellationType | null;
  averageMoodImprovement: number;
  currentStreak: number;
  longestStreak: number;
  totalStarsConnected: number;
  averageBreathingRegularity: number;
  lastSessionAt?: string;
}

// ============================================================================
// CONSTELLATION DATA
// ============================================================================

export interface Star {
  id: string;
  x: number;
  y: number;
  brightness: number;
  connected: boolean;
}

export interface ConstellationData {
  type: ConstellationType;
  name: string;
  stars: Star[];
  connections: Array<[string, string]>;
  mythology: string;
  therapeuticMeaning: string;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const BreathPhaseSchema = z.enum(['inhale', 'hold', 'exhale', 'rest']);
export const ConstellationTypeSchema = z.enum(['orion', 'cassiopeia', 'ursa-major', 'pleiades', 'custom']);
export const SessionDifficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const BreathConstellationConfigSchema = z.object({
  constellation: ConstellationTypeSchema,
  inhaleSeconds: z.number().min(2).max(10),
  holdSeconds: z.number().min(0).max(10),
  exhaleSeconds: z.number().min(2).max(12),
  restSeconds: z.number().min(0).max(5),
  totalCycles: z.number().min(3).max(30),
  difficulty: SessionDifficultySchema,
  primaryColor: z.string().optional(),
  ambientSounds: z.boolean().optional(),
  hapticFeedback: z.boolean().optional(),
});

export const CreateBreathConstellationSessionSchema = z.object({
  config: BreathConstellationConfigSchema,
  moodBefore: z.number().min(1).max(10).optional(),
});

export const CompleteBreathConstellationSessionSchema = z.object({
  sessionId: z.string().uuid(),
  cyclesCompleted: z.number().min(0),
  durationSeconds: z.number().min(0),
  moodAfter: z.number().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
  starsConnected: z.number().min(0),
  breathingRegularity: z.number().min(0).max(100),
});

// ============================================================================
// PRESETS
// ============================================================================

export const CONSTELLATION_PRESETS: Record<ConstellationType, Omit<BreathConstellationConfig, 'constellation'>> = {
  orion: {
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    restSeconds: 2,
    totalCycles: 8,
    difficulty: 'beginner',
    ambientSounds: true,
  },
  cassiopeia: {
    inhaleSeconds: 4,
    holdSeconds: 7,
    exhaleSeconds: 8,
    restSeconds: 2,
    totalCycles: 6,
    difficulty: 'intermediate',
    ambientSounds: true,
  },
  'ursa-major': {
    inhaleSeconds: 5,
    holdSeconds: 5,
    exhaleSeconds: 5,
    restSeconds: 3,
    totalCycles: 10,
    difficulty: 'intermediate',
    ambientSounds: true,
  },
  pleiades: {
    inhaleSeconds: 6,
    holdSeconds: 8,
    exhaleSeconds: 10,
    restSeconds: 2,
    totalCycles: 5,
    difficulty: 'advanced',
    ambientSounds: true,
  },
  custom: {
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    restSeconds: 2,
    totalCycles: 8,
    difficulty: 'beginner',
    ambientSounds: true,
  },
};
