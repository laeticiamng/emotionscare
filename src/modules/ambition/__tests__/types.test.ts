import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ============================================================================
// SCHEMAS ZOD - Ambition Module
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
// TESTS UNITAIRES
// ============================================================================

describe('Ambition Module - Zod Schemas', () => {
  describe('AmbitionRunStatus', () => {
    it('valide les statuts corrects', () => {
      expect(() => AmbitionRunStatus.parse('active')).not.toThrow();
      expect(() => AmbitionRunStatus.parse('paused')).not.toThrow();
      expect(() => AmbitionRunStatus.parse('completed')).not.toThrow();
      expect(() => AmbitionRunStatus.parse('abandoned')).not.toThrow();
    });

    it('rejette les statuts invalides', () => {
      expect(() => AmbitionRunStatus.parse('pending')).toThrow();
      expect(() => AmbitionRunStatus.parse('')).toThrow();
      expect(() => AmbitionRunStatus.parse(null)).toThrow();
    });
  });

  describe('QuestStatus', () => {
    it('valide les statuts de quête', () => {
      expect(() => QuestStatus.parse('available')).not.toThrow();
      expect(() => QuestStatus.parse('in_progress')).not.toThrow();
      expect(() => QuestStatus.parse('completed')).not.toThrow();
      expect(() => QuestStatus.parse('failed')).not.toThrow();
    });

    it('rejette les statuts invalides', () => {
      expect(() => QuestStatus.parse('active')).toThrow();
      expect(() => QuestStatus.parse('done')).toThrow();
    });
  });

  describe('QuestResult', () => {
    it('valide les résultats de quête', () => {
      expect(() => QuestResult.parse('success')).not.toThrow();
      expect(() => QuestResult.parse('partial')).not.toThrow();
      expect(() => QuestResult.parse('failure')).not.toThrow();
      expect(() => QuestResult.parse('skipped')).not.toThrow();
    });

    it('rejette les résultats invalides', () => {
      expect(() => QuestResult.parse('win')).toThrow();
    });
  });

  describe('ArtifactRarity', () => {
    it('valide les raretés', () => {
      expect(() => ArtifactRarity.parse('common')).not.toThrow();
      expect(() => ArtifactRarity.parse('uncommon')).not.toThrow();
      expect(() => ArtifactRarity.parse('rare')).not.toThrow();
      expect(() => ArtifactRarity.parse('epic')).not.toThrow();
      expect(() => ArtifactRarity.parse('legendary')).not.toThrow();
    });

    it('rejette les raretés invalides', () => {
      expect(() => ArtifactRarity.parse('normal')).toThrow();
    });
  });

  describe('AmbitionRun', () => {
    it('valide un run complet', () => {
      const run = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'Learn TypeScript in 30 days',
        status: 'active',
        tags: ['learning', 'typescript'],
        metadata: { priority: 'high' },
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionRun.parse(run)).not.toThrow();
    });

    it('valide un run complété', () => {
      const run = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'Complete meditation course',
        status: 'completed',
        metadata: {},
        created_at: '2025-01-01T10:00:00Z',
        completed_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionRun.parse(run)).not.toThrow();
    });

    it('rejette un objectif trop long', () => {
      const run = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'A'.repeat(501),
        status: 'active',
        metadata: {},
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionRun.parse(run)).toThrow();
    });

    it('applique la valeur par défaut pour metadata', () => {
      const run = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'Test objective',
        status: 'active',
        created_at: '2025-01-15T10:00:00Z',
      };
      const parsed = AmbitionRun.parse(run);
      expect(parsed.metadata).toEqual({});
    });
  });

  describe('AmbitionQuest', () => {
    it('valide une quête complète', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Complete Chapter 1',
        flavor: 'Learn the basics of TypeScript types',
        status: 'in_progress',
        result: 'success',
        est_minutes: 30,
        xp_reward: 50,
        notes: 'Great progress today!',
        created_at: '2025-01-15T10:00:00Z',
        completed_at: '2025-01-15T11:00:00Z',
      };
      expect(() => AmbitionQuest.parse(quest)).not.toThrow();
    });

    it('valide une quête minimale', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Quick task',
        status: 'available',
        created_at: '2025-01-15T10:00:00Z',
      };
      const parsed = AmbitionQuest.parse(quest);
      expect(parsed.est_minutes).toBe(15);
      expect(parsed.xp_reward).toBe(25);
    });

    it('rejette un titre trop long', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'A'.repeat(201),
        status: 'available',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionQuest.parse(quest)).toThrow();
    });

    it('rejette des notes trop longues', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        status: 'completed',
        notes: 'A'.repeat(2001),
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionQuest.parse(quest)).toThrow();
    });

    it('rejette est_minutes hors limites', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        status: 'available',
        est_minutes: 500,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionQuest.parse(quest)).toThrow();
    });

    it('rejette xp_reward hors limites', () => {
      const quest = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        status: 'available',
        xp_reward: 1001,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => AmbitionQuest.parse(quest)).toThrow();
    });
  });

  describe('AmbitionArtifact', () => {
    it('valide un artifact complet', () => {
      const artifact = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Badge of Wisdom',
        description: 'Awarded for completing all learning quests',
        rarity: 'epic',
        icon: '🏆',
        obtained_at: '2025-01-15T12:00:00Z',
      };
      expect(() => AmbitionArtifact.parse(artifact)).not.toThrow();
    });

    it('valide un artifact minimal', () => {
      const artifact = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Common Token',
        obtained_at: '2025-01-15T12:00:00Z',
      };
      const parsed = AmbitionArtifact.parse(artifact);
      expect(parsed.rarity).toBe('common');
    });

    it('rejette un nom trop long', () => {
      const artifact = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'A'.repeat(101),
        obtained_at: '2025-01-15T12:00:00Z',
      };
      expect(() => AmbitionArtifact.parse(artifact)).toThrow();
    });

    it('rejette une description trop longue', () => {
      const artifact = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test',
        description: 'A'.repeat(501),
        obtained_at: '2025-01-15T12:00:00Z',
      };
      expect(() => AmbitionArtifact.parse(artifact)).toThrow();
    });
  });

  describe('RunStats', () => {
    it('valide des statistiques complètes', () => {
      const stats = {
        total_quests: 20,
        completed_quests: 15,
        failed_quests: 2,
        completion_rate: 75,
        total_xp: 500,
        total_time_minutes: 450,
        artifacts_count: 5,
        days_active: 14,
      };
      expect(() => RunStats.parse(stats)).not.toThrow();
    });

    it('valide des statistiques à zéro', () => {
      const stats = {
        total_quests: 0,
        completed_quests: 0,
        failed_quests: 0,
        completion_rate: 0,
        total_xp: 0,
        total_time_minutes: 0,
        artifacts_count: 0,
        days_active: 0,
      };
      expect(() => RunStats.parse(stats)).not.toThrow();
    });

    it('rejette un completion_rate > 100', () => {
      const stats = {
        total_quests: 10,
        completed_quests: 15,
        failed_quests: 0,
        completion_rate: 150,
        total_xp: 0,
        total_time_minutes: 0,
        artifacts_count: 0,
        days_active: 0,
      };
      expect(() => RunStats.parse(stats)).toThrow();
    });

    it('rejette des valeurs négatives', () => {
      const stats = {
        total_quests: -5,
        completed_quests: 0,
        failed_quests: 0,
        completion_rate: 0,
        total_xp: 0,
        total_time_minutes: 0,
        artifacts_count: 0,
        days_active: 0,
      };
      expect(() => RunStats.parse(stats)).toThrow();
    });
  });

  describe('AmbitionRunComplete', () => {
    it('valide un run complet avec quêtes et artifacts', () => {
      const runComplete = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'Master React',
        status: 'active',
        metadata: {},
        created_at: '2025-01-15T10:00:00Z',
        quests: [
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            run_id: '550e8400-e29b-41d4-a716-446655440000',
            title: 'Learn hooks',
            status: 'completed',
            created_at: '2025-01-15T10:00:00Z',
          },
        ],
        artifacts: [
          {
            id: '550e8400-e29b-41d4-a716-446655440003',
            run_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'React Master Badge',
            obtained_at: '2025-01-15T12:00:00Z',
          },
        ],
        stats: {
          total_quests: 10,
          completed_quests: 5,
          failed_quests: 1,
          completion_rate: 50,
          total_xp: 250,
          total_time_minutes: 300,
          artifacts_count: 1,
          days_active: 5,
        },
      };
      expect(() => AmbitionRunComplete.parse(runComplete)).not.toThrow();
    });

    it('valide un run sans quêtes ni artifacts', () => {
      const runComplete = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        objective: 'New goal',
        status: 'active',
        metadata: {},
        created_at: '2025-01-15T10:00:00Z',
        quests: [],
        artifacts: [],
        stats: {
          total_quests: 0,
          completed_quests: 0,
          failed_quests: 0,
          completion_rate: 0,
          total_xp: 0,
          total_time_minutes: 0,
          artifacts_count: 0,
          days_active: 0,
        },
      };
      expect(() => AmbitionRunComplete.parse(runComplete)).not.toThrow();
    });
  });

  describe('CreateAmbitionRun', () => {
    it('valide un payload de création complet', () => {
      const payload = {
        objective: 'Learn GraphQL',
        tags: ['learning', 'graphql', 'api'],
        metadata: { source: 'tutorial', difficulty: 'intermediate' },
      };
      expect(() => CreateAmbitionRun.parse(payload)).not.toThrow();
    });

    it('valide un payload minimal', () => {
      const payload = {
        objective: 'Simple goal',
      };
      expect(() => CreateAmbitionRun.parse(payload)).not.toThrow();
    });

    it('rejette trop de tags', () => {
      const payload = {
        objective: 'Test',
        tags: Array(11).fill('tag'),
      };
      expect(() => CreateAmbitionRun.parse(payload)).toThrow();
    });

    it('rejette un objectif vide', () => {
      const payload = {
        objective: '',
      };
      expect(() => CreateAmbitionRun.parse(payload)).toThrow();
    });
  });

  describe('UpdateAmbitionRun', () => {
    it('valide une mise à jour partielle', () => {
      const payload = {
        status: 'paused',
      };
      expect(() => UpdateAmbitionRun.parse(payload)).not.toThrow();
    });

    it('valide une mise à jour complète', () => {
      const payload = {
        objective: 'Updated objective',
        status: 'completed',
        tags: ['updated'],
        metadata: { note: 'finished' },
      };
      expect(() => UpdateAmbitionRun.parse(payload)).not.toThrow();
    });

    it('valide un payload vide', () => {
      const payload = {};
      expect(() => UpdateAmbitionRun.parse(payload)).not.toThrow();
    });
  });

  describe('CreateQuest', () => {
    it('valide un payload de création complet', () => {
      const payload = {
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Complete exercise 5',
        flavor: 'Practice advanced patterns',
        est_minutes: 45,
        xp_reward: 75,
      };
      expect(() => CreateQuest.parse(payload)).not.toThrow();
    });

    it('valide un payload minimal avec valeurs par défaut', () => {
      const payload = {
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Quick task',
      };
      const parsed = CreateQuest.parse(payload);
      expect(parsed.est_minutes).toBe(15);
      expect(parsed.xp_reward).toBe(25);
    });
  });

  describe('UpdateQuest', () => {
    it('valide une mise à jour de statut', () => {
      const payload = {
        status: 'completed',
        result: 'success',
      };
      expect(() => UpdateQuest.parse(payload)).not.toThrow();
    });

    it('valide une mise à jour avec notes', () => {
      const payload = {
        status: 'completed',
        notes: 'Excellent work on this one!',
      };
      expect(() => UpdateQuest.parse(payload)).not.toThrow();
    });

    it('valide un payload vide', () => {
      const payload = {};
      expect(() => UpdateQuest.parse(payload)).not.toThrow();
    });
  });

  describe('CreateArtifact', () => {
    it('valide un payload de création complet', () => {
      const payload = {
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Legendary Sword',
        description: 'Forged in the fires of determination',
        rarity: 'legendary',
        icon: '⚔️',
      };
      expect(() => CreateArtifact.parse(payload)).not.toThrow();
    });

    it('valide un payload minimal avec rareté par défaut', () => {
      const payload = {
        run_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Basic Token',
      };
      const parsed = CreateArtifact.parse(payload);
      expect(parsed.rarity).toBe('common');
    });
  });

  describe('UserAmbitionHistory', () => {
    it('valide un historique complet', () => {
      const history = {
        total_runs: 25,
        active_runs: 3,
        completed_runs: 20,
        total_quests_completed: 150,
        total_xp_earned: 5000,
        total_artifacts: 35,
        recent_runs: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            user_id: '550e8400-e29b-41d4-a716-446655440001',
            objective: 'Recent goal',
            status: 'active',
            metadata: {},
            created_at: '2025-01-15T10:00:00Z',
          },
        ],
      };
      expect(() => UserAmbitionHistory.parse(history)).not.toThrow();
    });

    it('valide un historique vide', () => {
      const history = {
        total_runs: 0,
        active_runs: 0,
        completed_runs: 0,
        total_quests_completed: 0,
        total_xp_earned: 0,
        total_artifacts: 0,
        recent_runs: [],
      };
      expect(() => UserAmbitionHistory.parse(history)).not.toThrow();
    });

    it('rejette plus de 10 runs récents', () => {
      const history = {
        total_runs: 50,
        active_runs: 5,
        completed_runs: 45,
        total_quests_completed: 300,
        total_xp_earned: 10000,
        total_artifacts: 70,
        recent_runs: Array(11).fill({
          id: '550e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          objective: 'Test',
          status: 'completed',
          metadata: {},
          created_at: '2025-01-15T10:00:00Z',
        }),
      };
      expect(() => UserAmbitionHistory.parse(history)).toThrow();
    });

    it('rejette des valeurs négatives', () => {
      const history = {
        total_runs: -5,
        active_runs: 0,
        completed_runs: 0,
        total_quests_completed: 0,
        total_xp_earned: 0,
        total_artifacts: 0,
        recent_runs: [],
      };
      expect(() => UserAmbitionHistory.parse(history)).toThrow();
    });
  });
});
