import { z } from 'zod';

/**
 * Types et schémas Zod pour le module Ambition
 * Système de gestion d'objectifs gamifiés avec runs, quêtes et artefacts
 */

// ============================================================================
// ENUMS & STATUTS
// ============================================================================

/**
 * Statut d'un run d'ambition
 */
export const AmbitionRunStatus = z.enum(['active', 'paused', 'completed', 'abandoned']);
export type AmbitionRunStatus = z.infer<typeof AmbitionRunStatus>;

/**
 * Statut d'une quête
 */
export const QuestStatus = z.enum(['available', 'in_progress', 'completed', 'failed']);
export type QuestStatus = z.infer<typeof QuestStatus>;

/**
 * Résultat d'une quête
 */
export const QuestResult = z.enum(['success', 'partial', 'failure', 'skipped']);
export type QuestResult = z.infer<typeof QuestResult>;

/**
 * Rareté d'un artifact
 */
export const ArtifactRarity = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']);
export type ArtifactRarity = z.infer<typeof ArtifactRarity>;

/**
 * Difficulté d'un run
 */
export const RunDifficulty = z.enum(['easy', 'medium', 'hard']);
export type RunDifficulty = z.infer<typeof RunDifficulty>;

// ============================================================================
// ENTITÉS PRINCIPALES
// ============================================================================

/**
 * Run d'ambition (objectif principal)
 */
export const AmbitionRun = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  objective: z.string().min(1).max(500),
  status: AmbitionRunStatus,
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
});
export type AmbitionRun = z.infer<typeof AmbitionRun>;

/**
 * Quête liée à un run
 */
export const AmbitionQuest = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  flavor: z.string().max(500).optional(),
  status: QuestStatus,
  result: QuestResult.optional(),
  est_minutes: z.number().int().min(1).max(480).default(15),
  xp_reward: z.number().int().min(0).max(1000).default(25),
  notes: z.string().max(2000).optional(),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
});
export type AmbitionQuest = z.infer<typeof AmbitionQuest>;

/**
 * Artifact obtenu lors d'un run
 */
export const AmbitionArtifact = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  rarity: ArtifactRarity.default('common'),
  icon: z.string().max(50).optional(),
  obtained_at: z.string().datetime(),
});
export type AmbitionArtifact = z.infer<typeof AmbitionArtifact>;

// ============================================================================
// STATISTIQUES & AGRÉGATS
// ============================================================================

/**
 * Statistiques d'un run
 */
export const RunStats = z.object({
  total_quests: z.number().int().min(0),
  completed_quests: z.number().int().min(0),
  failed_quests: z.number().int().min(0),
  completion_rate: z.number().min(0).max(100),
  total_xp: z.number().int().min(0),
  total_time_minutes: z.number().int().min(0),
  artifacts_count: z.number().int().min(0),
  days_active: z.number().int().min(0),
});
export type RunStats = z.infer<typeof RunStats>;

/**
 * Vue complète d'un run avec quêtes et artifacts
 */
export const AmbitionRunComplete = AmbitionRun.extend({
  quests: z.array(AmbitionQuest),
  artifacts: z.array(AmbitionArtifact),
  stats: RunStats,
});
export type AmbitionRunComplete = z.infer<typeof AmbitionRunComplete>;

/**
 * Historique global de l'utilisateur
 */
export const UserAmbitionHistory = z.object({
  total_runs: z.number().int().min(0),
  active_runs: z.number().int().min(0),
  completed_runs: z.number().int().min(0),
  total_quests_completed: z.number().int().min(0),
  total_xp_earned: z.number().int().min(0),
  total_artifacts: z.number().int().min(0),
  recent_runs: z.array(AmbitionRun).max(10),
});
export type UserAmbitionHistory = z.infer<typeof UserAmbitionHistory>;

// ============================================================================
// PAYLOADS (CREATE/UPDATE)
// ============================================================================

/**
 * Payload pour créer un run
 */
export const CreateAmbitionRun = z.object({
  objective: z.string().min(1).max(500),
  tags: z.array(z.string()).max(10).optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type CreateAmbitionRun = z.infer<typeof CreateAmbitionRun>;

/**
 * Payload pour mettre à jour un run
 */
export const UpdateAmbitionRun = z.object({
  objective: z.string().min(1).max(500).optional(),
  status: AmbitionRunStatus.optional(),
  tags: z.array(z.string()).max(10).optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type UpdateAmbitionRun = z.infer<typeof UpdateAmbitionRun>;

/**
 * Payload pour créer une quête
 */
export const CreateQuest = z.object({
  run_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  flavor: z.string().max(500).optional(),
  est_minutes: z.number().int().min(1).max(480).default(15),
  xp_reward: z.number().int().min(0).max(1000).default(25),
});
export type CreateQuest = z.infer<typeof CreateQuest>;

/**
 * Payload pour mettre à jour une quête
 */
export const UpdateQuest = z.object({
  status: QuestStatus.optional(),
  result: QuestResult.optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateQuest = z.infer<typeof UpdateQuest>;

/**
 * Payload pour créer un artifact
 */
export const CreateArtifact = z.object({
  run_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  rarity: ArtifactRarity.default('common'),
  icon: z.string().max(50).optional(),
});
export type CreateArtifact = z.infer<typeof CreateArtifact>;

// ============================================================================
// GÉNÉRATION IA (ARCADE MODE)
// ============================================================================

/**
 * Paramètres pour générer une structure de jeu via IA
 */
export const GenerateGameStructure = z.object({
  goal: z.string().min(5, 'Objectif trop court').max(500, 'Objectif trop long'),
  timeframe: z.string().default('30'),
  difficulty: RunDifficulty.default('medium'),
});
export type GenerateGameStructure = z.infer<typeof GenerateGameStructure>;

/**
 * Structure de jeu générée par IA
 */
export const GameStructure = z.object({
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
export type GameStructure = z.infer<typeof GameStructure>;

// ============================================================================
// INTERFACES UTILITAIRES
// ============================================================================

/**
 * Statistiques globales utilisateur
 */
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

/**
 * Modes d'affichage
 */
export type AmbitionMode = 'standard' | 'arcade';

/**
 * Options de tri
 */
export type SortOption = 'recent' | 'oldest' | 'completion' | 'xp';

/**
 * Filtres de runs
 */
export interface RunFilters {
  status?: AmbitionRunStatus[];
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}
