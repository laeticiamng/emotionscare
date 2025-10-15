/**
 * Nyvee Module - Types & Schemas
 */

import { z } from 'zod';

// Intensités de respiration
export const breathingIntensities = ['calm', 'moderate', 'intense'] as const;
export type BreathingIntensity = (typeof breathingIntensities)[number];

// Phases de respiration
export const breathingPhases = ['inhale', 'hold', 'exhale'] as const;
export type BreathingPhase = (typeof breathingPhases)[number];

// Types de badges
export const badgeTypes = ['calm', 'partial', 'tense'] as const;
export type BadgeType = (typeof badgeTypes)[number];

// Phases de session
export const sessionPhases = ['ready', 'breathing', 'complete', 'badge'] as const;
export type SessionPhase = (typeof sessionPhases)[number];

// Types de cocoons
export const cocoonTypes = [
  'crystal',    // Débloqué par défaut
  'cosmos',     // Rare
  'water',      // Rare
  'foliage',    // Rare
  'aurora',     // Rare
  'ember',      // Rare
] as const;
export type CocoonType = (typeof cocoonTypes)[number];

// Configuration du cycle de respiration
export interface BreathingCycleConfig {
  inhale: number;    // ms
  hold: number;      // ms
  exhale: number;    // ms
  totalCycles: number;
}

export const DEFAULT_CYCLE_CONFIG: BreathingCycleConfig = {
  inhale: 4000,
  hold: 2000,
  exhale: 6000,
  totalCycles: 6,
};

// Schema pour une session Nyvee
export const NyveeSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  intensity: z.enum(breathingIntensities),
  cyclesCompleted: z.number().min(0).max(10),
  targetCycles: z.number().default(6),
  moodBefore: z.number().min(0).max(100).optional(),
  moodAfter: z.number().min(0).max(100).optional(),
  moodDelta: z.number().optional(),
  badgeEarned: z.enum(badgeTypes),
  cocoonUnlocked: z.enum(cocoonTypes).optional(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type NyveeSession = z.infer<typeof NyveeSessionSchema>;

// Schema pour créer une session
export const CreateNyveeSessionSchema = z.object({
  intensity: z.enum(breathingIntensities),
  targetCycles: z.number().default(6),
  moodBefore: z.number().min(0).max(100).optional(),
});

export type CreateNyveeSession = z.infer<typeof CreateNyveeSessionSchema>;

// Schema pour compléter une session
export const CompleteNyveeSessionSchema = z.object({
  sessionId: z.string().uuid(),
  cyclesCompleted: z.number(),
  badgeEarned: z.enum(badgeTypes),
  moodAfter: z.number().min(0).max(100).optional(),
  cocoonUnlocked: z.enum(cocoonTypes).optional(),
});

export type CompleteNyveeSession = z.infer<typeof CompleteNyveeSessionSchema>;

// Statistiques utilisateur
export const NyveeStatsSchema = z.object({
  totalSessions: z.number(),
  totalCycles: z.number(),
  averageCyclesPerSession: z.number(),
  completionRate: z.number().min(0).max(100),
  currentStreak: z.number(),
  longestStreak: z.number(),
  favoriteIntensity: z.enum(breathingIntensities).nullable(),
  cocoonsUnlocked: z.array(z.enum(cocoonTypes)),
  avgMoodDelta: z.number().nullable(),
  badgesEarned: z.object({
    calm: z.number(),
    partial: z.number(),
    tense: z.number(),
  }),
});

export type NyveeStats = z.infer<typeof NyveeStatsSchema>;

// Labels pour les intensités
export const intensityLabels: Record<BreathingIntensity, string> = {
  calm: 'Calme',
  moderate: 'Modéré',
  intense: 'Intense',
};

// Descriptions des intensités
export const intensityDescriptions: Record<BreathingIntensity, string> = {
  calm: 'Respiration douce pour l\'apaisement',
  moderate: 'Respiration équilibrée pour la régulation',
  intense: 'Respiration profonde pour la libération',
};

// Labels pour les badges
export const badgeLabels: Record<BadgeType, string> = {
  calm: 'Calme retrouvé',
  partial: 'Apaisé en partie',
  tense: 'Encore tendu',
};

// Labels pour les cocoons
export const cocoonLabels: Record<CocoonType, string> = {
  crystal: 'Cristal',
  cosmos: 'Cosmos',
  water: 'Eau',
  foliage: 'Feuillage',
  aurora: 'Aurore',
  ember: 'Braise',
};

// Descriptions des cocoons
export const cocoonDescriptions: Record<CocoonType, string> = {
  crystal: 'Le cocon de départ, clair et rassurant',
  cosmos: 'Un univers infini de possibilités',
  water: 'Fluidité et adaptabilité',
  foliage: 'Connexion à la nature',
  aurora: 'Lumière magique et mystérieuse',
  ember: 'Chaleur et transformation',
};
