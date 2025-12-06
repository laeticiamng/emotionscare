import { z } from 'zod';

/**
 * Meditation Module - Types & Schemas
 */

// Meditation techniques disponibles
export const meditationTechniques = [
  'mindfulness',
  'body-scan',
  'loving-kindness',
  'breath-focus',
  'visualization',
  'mantra',
] as const;

export type MeditationTechnique = (typeof meditationTechniques)[number];

// Durées prédéfinies (en minutes)
export const meditationDurations = [5, 10, 15, 20, 30] as const;
export type MeditationDuration = (typeof meditationDurations)[number];

// Schema pour la configuration d'une session
export const MeditationConfigSchema = z.object({
  technique: z.enum(meditationTechniques),
  duration: z.number().min(1).max(60), // 1-60 minutes
  withGuidance: z.boolean().default(true),
  withMusic: z.boolean().default(true),
  volume: z.number().min(0).max(100).default(50),
});

export type MeditationConfig = z.infer<typeof MeditationConfigSchema>;

// Schema pour les données d'une session
export const MeditationSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  technique: z.enum(meditationTechniques),
  duration: z.number(), // durée en secondes
  completedDuration: z.number(), // durée réellement effectuée
  moodBefore: z.number().min(0).max(100).nullable().optional(),
  moodAfter: z.number().min(0).max(100).nullable().optional(),
  moodDelta: z.number().nullable().optional(),
  withGuidance: z.boolean(),
  withMusic: z.boolean(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable().optional(),
});

export type MeditationSession = z.infer<typeof MeditationSessionSchema>;

// Schema pour créer une nouvelle session
export const CreateMeditationSessionSchema = MeditationConfigSchema.extend({
  moodBefore: z.number().min(0).max(100).optional(),
});

export type CreateMeditationSession = z.infer<typeof CreateMeditationSessionSchema>;

// Schema pour compléter une session
export const CompleteMeditationSessionSchema = z.object({
  sessionId: z.string().uuid(),
  completedDuration: z.number().min(0),
  moodAfter: z.number().min(0).max(100).optional(),
  feedback: z.string().max(500).optional(),
});

export type CompleteMeditationSession = z.infer<typeof CompleteMeditationSessionSchema>;

/**
 * Données de mise à jour pour compléter une session
 */
export interface SessionCompletionData {
  completed: boolean;
  completed_duration: number;
  completed_at: string;
  mood_after?: number;
}

// Stats utilisateur
export const MeditationStatsSchema = z.object({
  totalSessions: z.number(),
  totalDuration: z.number(), // en secondes
  averageDuration: z.number(),
  favoriteTechnique: z.enum(meditationTechniques).nullable(),
  completionRate: z.number().min(0).max(100),
  currentStreak: z.number(),
  longestStreak: z.number(),
  avgMoodDelta: z.number().nullable(),
});

export type MeditationStats = z.infer<typeof MeditationStatsSchema>;

// Labels pour les techniques
export const techniqueLables: Record<MeditationTechnique, string> = {
  'mindfulness': 'Pleine conscience',
  'body-scan': 'Scan corporel',
  'loving-kindness': 'Bienveillance',
  'breath-focus': 'Focus respiration',
  'visualization': 'Visualisation',
  'mantra': 'Mantra',
};

// Descriptions des techniques
export const techniqueDescriptions: Record<MeditationTechnique, string> = {
  'mindfulness': 'Observer le moment présent sans jugement',
  'body-scan': 'Explorer les sensations corporelles progressivement',
  'loving-kindness': 'Cultiver la compassion envers soi et les autres',
  'breath-focus': 'Se concentrer sur le souffle naturel',
  'visualization': 'Créer des images mentales apaisantes',
  'mantra': 'Répéter un son ou une phrase calmante',
};
