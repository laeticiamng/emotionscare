import { describe, it, expect } from 'vitest';
import {
  BattleStatusSchema,
  BattleModeSchema,
  EventTypeSchema,
  CopingQuestionSchema,
  BounceBattleSchema,
  BounceEventSchema,
  BounceCopingResponseSchema,
  BouncePairTipSchema,
  CreateBounceBattleSchema,
  CompleteBounceBattleSchema,
  AddBounceEventSchema,
  AddCopingResponseSchema,
  BounceStatsSchema,
} from '../types';

describe('Bounce Back Types', () => {
  describe('Enum Schemas', () => {
    it('should validate battle statuses', () => {
      expect(BattleStatusSchema.parse('created')).toBe('created');
      expect(BattleStatusSchema.parse('active')).toBe('active');
      expect(BattleStatusSchema.parse('completed')).toBe('completed');
      expect(() => BattleStatusSchema.parse('invalid')).toThrow();
    });

    it('should validate battle modes', () => {
      expect(BattleModeSchema.parse('standard')).toBe('standard');
      expect(BattleModeSchema.parse('quick')).toBe('quick');
      expect(BattleModeSchema.parse('zen')).toBe('zen');
      expect(() => BattleModeSchema.parse('invalid')).toThrow();
    });

    it('should validate event types', () => {
      expect(EventTypeSchema.parse('thought')).toBe('thought');
      expect(EventTypeSchema.parse('emotion')).toBe('emotion');
      expect(EventTypeSchema.parse('victory')).toBe('victory');
      expect(() => EventTypeSchema.parse('invalid')).toThrow();
    });

    it('should validate coping questions', () => {
      expect(CopingQuestionSchema.parse('distraction')).toBe('distraction');
      expect(CopingQuestionSchema.parse('reframing')).toBe('reframing');
      expect(() => CopingQuestionSchema.parse('invalid')).toThrow();
    });
  });

  describe('Entity Schemas', () => {
    it('should validate BounceBattle', () => {
      const validBattle = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        status: 'active',
        mode: 'standard',
        started_at: '2025-01-20T10:00:00Z',
        ended_at: null,
        duration_seconds: null,
        created_at: '2025-01-20T09:00:00Z',
      };

      const result = BounceBattleSchema.parse(validBattle);
      expect(result.id).toBe(validBattle.id);
      expect(result.status).toBe('active');
    });

    it('should validate BounceEvent', () => {
      const validEvent = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        battle_id: '123e4567-e89b-12d3-a456-426614174001',
        event_type: 'thought',
        timestamp: 1234567890,
        event_data: { intensity: 'high' },
      };

      const result = BounceEventSchema.parse(validEvent);
      expect(result.event_type).toBe('thought');
      expect(result.event_data).toEqual({ intensity: 'high' });
    });

    it('should validate BounceCopingResponse', () => {
      const validResponse = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        battle_id: '123e4567-e89b-12d3-a456-426614174001',
        question_id: 'distraction',
        response_value: 4,
        created_at: '2025-01-20T10:00:00Z',
      };

      const result = BounceCopingResponseSchema.parse(validResponse);
      expect(result.question_id).toBe('distraction');
      expect(result.response_value).toBe(4);
    });

    it('should reject invalid coping response values', () => {
      const invalidResponse = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        battle_id: '123e4567-e89b-12d3-a456-426614174001',
        question_id: 'distraction',
        response_value: 6, // Invalid: max is 5
        created_at: '2025-01-20T10:00:00Z',
      };

      expect(() => BounceCopingResponseSchema.parse(invalidResponse)).toThrow();
    });
  });

  describe('Create/Update Schemas', () => {
    it('should validate CreateBounceBattle with default mode', () => {
      const result = CreateBounceBattleSchema.parse({});
      expect(result.mode).toBe('standard');
    });

    it('should validate CompleteBounceBattle', () => {
      const validPayload = {
        battle_id: '123e4567-e89b-12d3-a456-426614174000',
        duration_seconds: 300,
      };

      const result = CompleteBounceBattleSchema.parse(validPayload);
      expect(result.duration_seconds).toBe(300);
    });

    it('should validate AddBounceEvent with optional event_data', () => {
      const validPayload = {
        battle_id: '123e4567-e89b-12d3-a456-426614174000',
        event_type: 'emotion',
        timestamp: 1234567890,
      };

      const result = AddBounceEventSchema.parse(validPayload);
      expect(result.event_data).toEqual({});
    });

    it('should validate AddCopingResponse', () => {
      const validPayload = {
        battle_id: '123e4567-e89b-12d3-a456-426614174000',
        question_id: 'relaxation',
        response_value: 3,
      };

      const result = AddCopingResponseSchema.parse(validPayload);
      expect(result.response_value).toBe(3);
    });
  });

  describe('Stats Schema', () => {
    it('should validate BounceStats', () => {
      const validStats = {
        total_battles: 10,
        completed_battles: 8,
        completion_rate: 80.0,
        total_duration_seconds: 3600,
        average_duration_seconds: 450.0,
        total_events: 45,
        average_events_per_battle: 4.5,
        coping_strategies_avg: {
          distraction: 3.5,
          reframing: 4.2,
          support: 3.8,
        },
        favorite_mode: 'standard',
      };

      const result = BounceStatsSchema.parse(validStats);
      expect(result.completion_rate).toBe(80.0);
      expect(result.favorite_mode).toBe('standard');
    });

    it('should validate BounceStats with null favorite_mode', () => {
      const validStats = {
        total_battles: 0,
        completed_battles: 0,
        completion_rate: 0,
        total_duration_seconds: 0,
        average_duration_seconds: 0,
        total_events: 0,
        average_events_per_battle: 0,
        coping_strategies_avg: {},
        favorite_mode: null,
      };

      const result = BounceStatsSchema.parse(validStats);
      expect(result.favorite_mode).toBeNull();
    });
  });
});
