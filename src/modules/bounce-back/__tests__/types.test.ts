/**
 * Tests unitaires pour les schémas Zod du module Bounce Back
 */

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
  StartBounceBattleSchema,
  CompleteBounceBattleSchema,
  AddBounceEventSchema,
  AddCopingResponseSchema,
  SendPairTipSchema,
  BounceStatsSchema,
  BATTLE_STATUSES,
  BATTLE_MODES,
  EVENT_TYPES,
  COPING_QUESTIONS
} from '../types';

describe('BounceBack Types - Enums', () => {
  it('valide les statuts de bataille', () => {
    expect(BattleStatusSchema.parse('created')).toBe('created');
    expect(BattleStatusSchema.parse('active')).toBe('active');
    expect(BattleStatusSchema.parse('paused')).toBe('paused');
    expect(BattleStatusSchema.parse('completed')).toBe('completed');
    expect(BattleStatusSchema.parse('abandoned')).toBe('abandoned');
  });

  it('rejette les statuts invalides', () => {
    expect(() => BattleStatusSchema.parse('invalid')).toThrow();
  });

  it('valide les modes de bataille', () => {
    expect(BattleModeSchema.parse('standard')).toBe('standard');
    expect(BattleModeSchema.parse('quick')).toBe('quick');
    expect(BattleModeSchema.parse('zen')).toBe('zen');
    expect(BattleModeSchema.parse('challenge')).toBe('challenge');
  });

  it('valide les types d\'événements', () => {
    expect(EventTypeSchema.parse('thought')).toBe('thought');
    expect(EventTypeSchema.parse('emotion')).toBe('emotion');
    expect(EventTypeSchema.parse('action')).toBe('action');
    expect(EventTypeSchema.parse('obstacle')).toBe('obstacle');
    expect(EventTypeSchema.parse('victory')).toBe('victory');
  });

  it('valide les questions de coping', () => {
    expect(CopingQuestionSchema.parse('distraction')).toBe('distraction');
    expect(CopingQuestionSchema.parse('reframing')).toBe('reframing');
    expect(CopingQuestionSchema.parse('support')).toBe('support');
    expect(CopingQuestionSchema.parse('relaxation')).toBe('relaxation');
    expect(CopingQuestionSchema.parse('problem_solving')).toBe('problem_solving');
  });
});

describe('BounceBack Types - Entities', () => {
  it('valide un BounceBattle complet', () => {
    const battle = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      status: 'active' as const,
      mode: 'standard' as const,
      started_at: '2025-01-15T10:00:00Z',
      ended_at: null,
      duration_seconds: null,
      created_at: '2025-01-15T09:50:00Z'
    };

    expect(BounceBattleSchema.parse(battle)).toEqual(battle);
  });

  it('valide un BounceEvent', () => {
    const event = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      event_type: 'thought' as const,
      timestamp: 1234567890,
      event_data: { content: 'Test thought', intensity: 7 }
    };

    expect(BounceEventSchema.parse(event)).toEqual(event);
  });

  it('valide event_data par défaut', () => {
    const event = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      event_type: 'action' as const,
      timestamp: 1234567890
    };

    const parsed = BounceEventSchema.parse(event);
    expect(parsed.event_data).toEqual({});
  });

  it('valide un BounceCopingResponse', () => {
    const response = {
      id: '123e4567-e89b-12d3-a456-426614174003',
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      question_id: 'distraction' as const,
      response_value: 4,
      created_at: '2025-01-15T10:05:00Z'
    };

    expect(BounceCopingResponseSchema.parse(response)).toEqual(response);
  });

  it('rejette response_value hors limites', () => {
    const response = {
      id: '123e4567-e89b-12d3-a456-426614174003',
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      question_id: 'distraction' as const,
      response_value: 6,
      created_at: '2025-01-15T10:05:00Z'
    };

    expect(() => BounceCopingResponseSchema.parse(response)).toThrow();
  });

  it('valide un BouncePairTip', () => {
    const tip = {
      id: '123e4567-e89b-12d3-a456-426614174004',
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      pair_token: 'ABC123',
      tip_content: 'Keep going, you got this!',
      received_tip: null,
      sent_at: '2025-01-15T10:10:00Z'
    };

    expect(BouncePairTipSchema.parse(tip)).toEqual(tip);
  });
});

describe('BounceBack Types - Create/Update Schemas', () => {
  it('valide CreateBounceBattle avec valeur par défaut', () => {
    const input = {};
    const parsed = CreateBounceBattleSchema.parse(input);
    expect(parsed.mode).toBe('standard');
  });

  it('valide CreateBounceBattle avec mode explicite', () => {
    const input = { mode: 'zen' as const };
    expect(CreateBounceBattleSchema.parse(input)).toEqual(input);
  });

  it('valide StartBounceBattle', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000'
    };
    expect(StartBounceBattleSchema.parse(input)).toEqual(input);
  });

  it('valide CompleteBounceBattle', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      duration_seconds: 600
    };
    expect(CompleteBounceBattleSchema.parse(input)).toEqual(input);
  });

  it('rejette duration_seconds négatif', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      duration_seconds: -10
    };
    expect(() => CompleteBounceBattleSchema.parse(input)).toThrow();
  });

  it('valide AddBounceEvent avec event_data', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      event_type: 'emotion' as const,
      timestamp: 1234567890,
      event_data: { type: 'joy', intensity: 8 }
    };
    expect(AddBounceEventSchema.parse(input)).toEqual(input);
  });

  it('valide AddBounceEvent sans event_data', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      event_type: 'victory' as const,
      timestamp: 1234567890
    };
    const parsed = AddBounceEventSchema.parse(input);
    expect(parsed.event_data).toEqual({});
  });

  it('valide AddCopingResponse', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      question_id: 'reframing' as const,
      response_value: 5
    };
    expect(AddCopingResponseSchema.parse(input)).toEqual(input);
  });

  it('valide SendPairTip', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      pair_token: 'XYZ789',
      tip_content: 'You are doing great!'
    };
    expect(SendPairTipSchema.parse(input)).toEqual(input);
  });

  it('rejette SendPairTip avec contenu trop long', () => {
    const input = {
      battle_id: '123e4567-e89b-12d3-a456-426614174000',
      pair_token: 'XYZ789',
      tip_content: 'A'.repeat(501)
    };
    expect(() => SendPairTipSchema.parse(input)).toThrow();
  });
});

describe('BounceBack Types - Statistics', () => {
  it('valide BounceStats complet', () => {
    const stats = {
      total_battles: 25,
      completed_battles: 20,
      completion_rate: 80.0,
      total_duration_seconds: 12000,
      average_duration_seconds: 600.0,
      total_events: 150,
      average_events_per_battle: 6.0,
      coping_strategies_avg: {
        distraction: 3.5,
        reframing: 4.2,
        support: 3.8,
        relaxation: 4.0,
        problem_solving: 3.9
      },
      favorite_mode: 'standard' as const
    };

    expect(BounceStatsSchema.parse(stats)).toEqual(stats);
  });

  it('valide BounceStats avec favorite_mode null', () => {
    const stats = {
      total_battles: 0,
      completed_battles: 0,
      completion_rate: 0,
      total_duration_seconds: 0,
      average_duration_seconds: 0,
      total_events: 0,
      average_events_per_battle: 0,
      coping_strategies_avg: {},
      favorite_mode: null
    };

    expect(BounceStatsSchema.parse(stats)).toEqual(stats);
  });

  it('rejette completion_rate > 100', () => {
    const stats = {
      total_battles: 10,
      completed_battles: 11,
      completion_rate: 110,
      total_duration_seconds: 6000,
      average_duration_seconds: 600,
      total_events: 60,
      average_events_per_battle: 6,
      coping_strategies_avg: {},
      favorite_mode: 'zen' as const
    };

    expect(() => BounceStatsSchema.parse(stats)).toThrow();
  });

  it('rejette total_battles négatif', () => {
    const stats = {
      total_battles: -5,
      completed_battles: 0,
      completion_rate: 0,
      total_duration_seconds: 0,
      average_duration_seconds: 0,
      total_events: 0,
      average_events_per_battle: 0,
      coping_strategies_avg: {},
      favorite_mode: null
    };

    expect(() => BounceStatsSchema.parse(stats)).toThrow();
  });
});

describe('BounceBack Types - Constants', () => {
  it('contient tous les statuts de bataille', () => {
    expect(BATTLE_STATUSES).toEqual([
      'created',
      'active',
      'paused',
      'completed',
      'abandoned'
    ]);
  });

  it('contient tous les modes de bataille', () => {
    expect(BATTLE_MODES).toEqual([
      'standard',
      'quick',
      'zen',
      'challenge'
    ]);
  });

  it('contient tous les types d\'événements', () => {
    expect(EVENT_TYPES).toEqual([
      'thought',
      'emotion',
      'action',
      'obstacle',
      'victory'
    ]);
  });

  it('contient toutes les questions de coping', () => {
    expect(COPING_QUESTIONS).toEqual([
      'distraction',
      'reframing',
      'support',
      'relaxation',
      'problem_solving'
    ]);
  });
});
