import { z } from 'zod';

/**
 * Types et schémas Zod pour Ambition Arcade
 * Module de gamification d'objectifs par IA
 */

// ─────────────────────────────────────────────────────────────
// Schémas Zod
// ─────────────────────────────────────────────────────────────

export const RunStatusSchema = z.enum(['active', 'completed', 'abandoned']);
export const QuestStatusSchema = z.enum(['available', 'in_progress', 'completed']);
export const ArtifactRaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);

export const AmbitionRunSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  objective: z.string().optional(),
  status: RunStatusSchema,
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
  completed_at: z.string().optional(),
});

export const AmbitionQuestSchema = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  title: z.string().min(1),
  flavor: z.string().optional(),
  status: QuestStatusSchema,
  xp_reward: z.number().int().min(0).default(25),
  est_minutes: z.number().int().min(1).default(15),
  result: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string(),
  completed_at: z.string().optional(),
});

export const AmbitionArtifactSchema = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  rarity: ArtifactRaritySchema,
  icon: z.string().optional(),
  obtained_at: z.string(),
});

export const CreateRunSchema = z.object({
  objective: z.string().min(3, 'Objectif trop court').max(500, 'Objectif trop long').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
});

export const CompleteQuestSchema = z.object({
  result: z.string().max(1000, 'Résultat trop long').optional(),
  notes: z.string().max(2000, 'Notes trop longues').optional(),
});

export const GameStructureSchema = z.object({
  levels: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      points: z.number().int().min(0),
      tasks: z.array(z.string()),
    })
  ),
  totalPoints: z.number().int().min(0),
  badges: z.array(z.string()),
});

export const GenerateGameStructureSchema = z.object({
  goal: z.string().min(5, 'Objectif trop court').max(500, 'Objectif trop long'),
  timeframe: z.string().default('30'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

// ─────────────────────────────────────────────────────────────
// Types TypeScript
// ─────────────────────────────────────────────────────────────

export type RunStatus = z.infer<typeof RunStatusSchema>;
export type QuestStatus = z.infer<typeof QuestStatusSchema>;
export type ArtifactRarity = z.infer<typeof ArtifactRaritySchema>;

export type AmbitionRun = z.infer<typeof AmbitionRunSchema>;
export type AmbitionQuest = z.infer<typeof AmbitionQuestSchema>;
export type AmbitionArtifact = z.infer<typeof AmbitionArtifactSchema>;

export type CreateRun = z.infer<typeof CreateRunSchema>;
export type CompleteQuest = z.infer<typeof CompleteQuestSchema>;
export type GameStructure = z.infer<typeof GameStructureSchema>;
export type GenerateGameStructure = z.infer<typeof GenerateGameStructureSchema>;

export interface AmbitionStats {
  totalRuns: number;
  activeRuns: number;
  completedRuns: number;
  totalQuests: number;
  completedQuests: number;
  totalXP: number;
  artifacts: number;
  completionRate: number;
}
