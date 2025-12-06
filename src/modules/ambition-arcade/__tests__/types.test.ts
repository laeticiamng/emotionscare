import { describe, it, expect } from 'vitest';
import {
  RunStatusSchema,
  QuestStatusSchema,
  ArtifactRaritySchema,
  CreateRunSchema,
  CompleteQuestSchema,
  GenerateGameStructureSchema,
  GameStructureSchema,
} from '../types';

describe('Ambition Arcade Types & Schemas', () => {
  describe('RunStatusSchema', () => {
    it('accepte les statuts valides', () => {
      expect(RunStatusSchema.parse('active')).toBe('active');
      expect(RunStatusSchema.parse('completed')).toBe('completed');
      expect(RunStatusSchema.parse('abandoned')).toBe('abandoned');
    });

    it('rejette les statuts invalides', () => {
      expect(() => RunStatusSchema.parse('invalid')).toThrow();
    });
  });

  describe('QuestStatusSchema', () => {
    it('accepte les statuts valides', () => {
      expect(QuestStatusSchema.parse('available')).toBe('available');
      expect(QuestStatusSchema.parse('in_progress')).toBe('in_progress');
      expect(QuestStatusSchema.parse('completed')).toBe('completed');
    });
  });

  describe('ArtifactRaritySchema', () => {
    it('accepte les raretés valides', () => {
      expect(ArtifactRaritySchema.parse('common')).toBe('common');
      expect(ArtifactRaritySchema.parse('rare')).toBe('rare');
      expect(ArtifactRaritySchema.parse('epic')).toBe('epic');
      expect(ArtifactRaritySchema.parse('legendary')).toBe('legendary');
    });
  });

  describe('CreateRunSchema', () => {
    it('accepte un objectif valide', () => {
      const result = CreateRunSchema.parse({
        objective: 'Apprendre React en 30 jours',
        tags: ['dev', 'react'],
      });
      expect(result.objective).toBe('Apprendre React en 30 jours');
    });

    it('rejette un objectif trop court', () => {
      expect(() => CreateRunSchema.parse({ objective: 'ok' })).toThrow();
    });

    it('rejette un objectif trop long', () => {
      const longObjective = 'a'.repeat(501);
      expect(() => CreateRunSchema.parse({ objective: longObjective })).toThrow();
    });

    it('limite le nombre de tags', () => {
      const tooManyTags = Array(11).fill('tag');
      expect(() => CreateRunSchema.parse({ tags: tooManyTags })).toThrow();
    });
  });

  describe('CompleteQuestSchema', () => {
    it('accepte un résultat valide', () => {
      const result = CompleteQuestSchema.parse({
        result: 'Mission accomplie',
        notes: 'Super expérience',
      });
      expect(result.result).toBe('Mission accomplie');
    });

    it('rejette un résultat trop long', () => {
      const longResult = 'a'.repeat(1001);
      expect(() => CompleteQuestSchema.parse({ result: longResult })).toThrow();
    });
  });

  describe('GenerateGameStructureSchema', () => {
    it('accepte un objectif valide avec defaults', () => {
      const result = GenerateGameStructureSchema.parse({
        goal: 'Devenir expert TypeScript',
      });
      expect(result.timeframe).toBe('30');
      expect(result.difficulty).toBe('medium');
    });

    it('rejette un objectif trop court', () => {
      expect(() => GenerateGameStructureSchema.parse({ goal: 'dev' })).toThrow();
    });

    it('accepte les difficultés valides', () => {
      const result = GenerateGameStructureSchema.parse({
        goal: 'Objectif test',
        difficulty: 'hard',
      });
      expect(result.difficulty).toBe('hard');
    });
  });

  describe('GameStructureSchema', () => {
    it('accepte une structure de jeu valide', () => {
      const structure = {
        levels: [
          {
            name: 'Niveau 1',
            description: 'Débutant',
            points: 100,
            tasks: ['Tâche 1', 'Tâche 2'],
          },
        ],
        totalPoints: 1000,
        badges: ['Débutant', 'Motivé'],
      };

      const result = GameStructureSchema.parse(structure);
      expect(result.levels).toHaveLength(1);
      expect(result.totalPoints).toBe(1000);
    });

    it('rejette une structure invalide', () => {
      expect(() => GameStructureSchema.parse({ levels: 'invalid' })).toThrow();
    });
  });
});
