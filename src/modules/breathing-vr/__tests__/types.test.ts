/**
 * Tests unitaires pour les types du module breathing-vr
 */

import { describe, it, expect } from 'vitest';
import {
  BreathingPattern,
  BreathingPhase,
  BreathingConfig,
  BreathingVRState,
  BreathingSession,
  BREATHING_PATTERNS
} from '../types';
import { z } from 'zod';

// Schémas Zod pour validation
const BreathingPatternSchema = z.enum(['box', 'calm', '478', 'energy', 'coherence']);
const BreathingPhaseSchema = z.enum(['inhale', 'hold', 'exhale', 'rest']);

const BreathingConfigSchema = z.object({
  pattern: BreathingPatternSchema,
  inhale: z.number().positive(),
  hold: z.number().nonnegative().optional(),
  exhale: z.number().positive(),
  rest: z.number().nonnegative().optional()
});

const BreathingVRStateSchema = z.object({
  status: z.enum(['idle', 'active', 'paused', 'completed']),
  config: BreathingConfigSchema.nullable(),
  currentPhase: BreathingPhaseSchema,
  phaseProgress: z.number().min(0).max(100),
  cyclesCompleted: z.number().nonnegative(),
  totalDuration: z.number().nonnegative(),
  elapsedTime: z.number().nonnegative(),
  vrMode: z.boolean(),
  error: z.string().nullable()
});

const BreathingSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  pattern: BreathingPatternSchema,
  duration_seconds: z.number().nonnegative(),
  cycles_completed: z.number().nonnegative(),
  average_pace: z.number().nonnegative(),
  started_at: z.string(),
  completed_at: z.string().optional(),
  mood_before: z.number().min(1).max(5).optional(),
  mood_after: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  vr_mode: z.boolean()
});

describe('BreathingPattern', () => {
  it('devrait accepter "box"', () => {
    const result = BreathingPatternSchema.safeParse('box');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "calm"', () => {
    const result = BreathingPatternSchema.safeParse('calm');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "478"', () => {
    const result = BreathingPatternSchema.safeParse('478');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "energy"', () => {
    const result = BreathingPatternSchema.safeParse('energy');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "coherence"', () => {
    const result = BreathingPatternSchema.safeParse('coherence');
    expect(result.success).toBe(true);
  });

  it('devrait rejeter un pattern invalide', () => {
    const result = BreathingPatternSchema.safeParse('invalid');
    expect(result.success).toBe(false);
  });
});

describe('BreathingPhase', () => {
  it('devrait accepter "inhale"', () => {
    const result = BreathingPhaseSchema.safeParse('inhale');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "hold"', () => {
    const result = BreathingPhaseSchema.safeParse('hold');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "exhale"', () => {
    const result = BreathingPhaseSchema.safeParse('exhale');
    expect(result.success).toBe(true);
  });

  it('devrait accepter "rest"', () => {
    const result = BreathingPhaseSchema.safeParse('rest');
    expect(result.success).toBe(true);
  });

  it('devrait rejeter une phase invalide', () => {
    const result = BreathingPhaseSchema.safeParse('invalid');
    expect(result.success).toBe(false);
  });
});

describe('BreathingConfig', () => {
  it('devrait valider une config box complète', () => {
    const config = {
      pattern: 'box' as BreathingPattern,
      inhale: 4,
      hold: 4,
      exhale: 4,
      rest: 4
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait valider une config calm sans hold ni rest', () => {
    const config = {
      pattern: 'calm' as BreathingPattern,
      inhale: 4,
      exhale: 6
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait valider une config 478', () => {
    const config = {
      pattern: '478' as BreathingPattern,
      inhale: 4,
      hold: 7,
      exhale: 8
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait valider une config energy', () => {
    const config = {
      pattern: 'energy' as BreathingPattern,
      inhale: 2,
      hold: 1,
      exhale: 2
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait valider une config coherence', () => {
    const config = {
      pattern: 'coherence' as BreathingPattern,
      inhale: 5,
      exhale: 5
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait rejeter une config sans pattern', () => {
    const config = {
      inhale: 4,
      exhale: 6
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter une config sans inhale', () => {
    const config = {
      pattern: 'box' as BreathingPattern,
      exhale: 4
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter une config sans exhale', () => {
    const config = {
      pattern: 'box' as BreathingPattern,
      inhale: 4
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter une durée inhale négative', () => {
    const config = {
      pattern: 'calm' as BreathingPattern,
      inhale: -1,
      exhale: 6
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter une durée exhale de zéro', () => {
    const config = {
      pattern: 'calm' as BreathingPattern,
      inhale: 4,
      exhale: 0
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('devrait accepter hold à zéro', () => {
    const config = {
      pattern: 'box' as BreathingPattern,
      inhale: 4,
      hold: 0,
      exhale: 4
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('devrait accepter rest à zéro', () => {
    const config = {
      pattern: 'box' as BreathingPattern,
      inhale: 4,
      exhale: 4,
      rest: 0
    };
    const result = BreathingConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });
});

describe('BreathingVRState', () => {
  it('devrait valider un état idle initial', () => {
    const state: BreathingVRState = {
      status: 'idle',
      config: null,
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('devrait valider un état active avec config', () => {
    const state: BreathingVRState = {
      status: 'active',
      config: {
        pattern: 'box',
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 4
      },
      currentPhase: 'inhale',
      phaseProgress: 50,
      cyclesCompleted: 2,
      totalDuration: 120,
      elapsedTime: 60,
      vrMode: true,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('devrait valider un état paused', () => {
    const state: BreathingVRState = {
      status: 'paused',
      config: {
        pattern: 'calm',
        inhale: 4,
        exhale: 6
      },
      currentPhase: 'exhale',
      phaseProgress: 75,
      cyclesCompleted: 1,
      totalDuration: 60,
      elapsedTime: 30,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('devrait valider un état completed', () => {
    const state: BreathingVRState = {
      status: 'completed',
      config: {
        pattern: '478',
        inhale: 4,
        hold: 7,
        exhale: 8
      },
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 10,
      totalDuration: 300,
      elapsedTime: 300,
      vrMode: true,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('devrait valider un état avec erreur', () => {
    const state: BreathingVRState = {
      status: 'idle',
      config: null,
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: 'User not authenticated'
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('devrait rejeter un status invalide', () => {
    const state = {
      status: 'invalid',
      config: null,
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter phaseProgress > 100', () => {
    const state = {
      status: 'active',
      config: { pattern: 'box', inhale: 4, exhale: 4 },
      currentPhase: 'inhale',
      phaseProgress: 150,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter phaseProgress négatif', () => {
    const state = {
      status: 'active',
      config: { pattern: 'box', inhale: 4, exhale: 4 },
      currentPhase: 'inhale',
      phaseProgress: -10,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter cyclesCompleted négatif', () => {
    const state = {
      status: 'active',
      config: { pattern: 'box', inhale: 4, exhale: 4 },
      currentPhase: 'inhale',
      phaseProgress: 50,
      cyclesCompleted: -1,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter elapsedTime négatif', () => {
    const state = {
      status: 'active',
      config: { pattern: 'box', inhale: 4, exhale: 4 },
      currentPhase: 'inhale',
      phaseProgress: 50,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: -30,
      vrMode: false,
      error: null
    };
    const result = BreathingVRStateSchema.safeParse(state);
    expect(result.success).toBe(false);
  });
});

describe('BreathingSession', () => {
  it('devrait valider une session complète', () => {
    const session: BreathingSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      completed_at: '2025-01-15T10:05:00Z',
      mood_before: 3,
      mood_after: 4,
      notes: 'Session très relaxante',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(true);
  });

  it('devrait valider une session en cours sans completed_at', () => {
    const session: BreathingSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'calm',
      duration_seconds: 0,
      cycles_completed: 0,
      average_pace: 0,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: false
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(true);
  });

  it('devrait valider une session sans mood', () => {
    const session: BreathingSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: '478',
      duration_seconds: 180,
      cycles_completed: 5,
      average_pace: 36,
      started_at: '2025-01-15T10:00:00Z',
      completed_at: '2025-01-15T10:03:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(true);
  });

  it('devrait valider une session sans notes', () => {
    const session: BreathingSession = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'energy',
      duration_seconds: 120,
      cycles_completed: 20,
      average_pace: 6,
      started_at: '2025-01-15T10:00:00Z',
      completed_at: '2025-01-15T10:02:00Z',
      mood_before: 2,
      mood_after: 4,
      vr_mode: false
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(true);
  });

  it('devrait rejeter un id non UUID', () => {
    const session = {
      id: 'invalid-uuid',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter un user_id non UUID', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: 'invalid-uuid',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter un pattern invalide', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'invalid',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter duration_seconds négatif', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: -100,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter cycles_completed négatif', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: -5,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter average_pace négatif', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: -30,
      started_at: '2025-01-15T10:00:00Z',
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter mood_before < 1', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      mood_before: 0,
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter mood_before > 5', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      mood_before: 6,
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter mood_after < 1', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      mood_after: 0,
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });

  it('devrait rejeter mood_after > 5', () => {
    const session = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      pattern: 'box',
      duration_seconds: 300,
      cycles_completed: 10,
      average_pace: 30,
      started_at: '2025-01-15T10:00:00Z',
      mood_after: 6,
      vr_mode: true
    };
    const result = BreathingSessionSchema.safeParse(session);
    expect(result.success).toBe(false);
  });
});

describe('BREATHING_PATTERNS', () => {
  it('devrait contenir le pattern "box"', () => {
    expect(BREATHING_PATTERNS.box).toBeDefined();
    expect(BREATHING_PATTERNS.box.pattern).toBe('box');
  });

  it('devrait contenir le pattern "calm"', () => {
    expect(BREATHING_PATTERNS.calm).toBeDefined();
    expect(BREATHING_PATTERNS.calm.pattern).toBe('calm');
  });

  it('devrait contenir le pattern "478"', () => {
    expect(BREATHING_PATTERNS['478']).toBeDefined();
    expect(BREATHING_PATTERNS['478'].pattern).toBe('478');
  });

  it('devrait contenir le pattern "energy"', () => {
    expect(BREATHING_PATTERNS.energy).toBeDefined();
    expect(BREATHING_PATTERNS.energy.pattern).toBe('energy');
  });

  it('devrait contenir le pattern "coherence"', () => {
    expect(BREATHING_PATTERNS.coherence).toBeDefined();
    expect(BREATHING_PATTERNS.coherence.pattern).toBe('coherence');
  });

  it('devrait avoir des durées valides pour "box"', () => {
    const result = BreathingConfigSchema.safeParse(BREATHING_PATTERNS.box);
    expect(result.success).toBe(true);
    expect(BREATHING_PATTERNS.box.inhale).toBe(4);
    expect(BREATHING_PATTERNS.box.hold).toBe(4);
    expect(BREATHING_PATTERNS.box.exhale).toBe(4);
    expect(BREATHING_PATTERNS.box.rest).toBe(4);
  });

  it('devrait avoir des durées valides pour "calm"', () => {
    const result = BreathingConfigSchema.safeParse(BREATHING_PATTERNS.calm);
    expect(result.success).toBe(true);
    expect(BREATHING_PATTERNS.calm.inhale).toBe(4);
    expect(BREATHING_PATTERNS.calm.exhale).toBe(6);
  });

  it('devrait avoir des durées valides pour "478"', () => {
    const result = BreathingConfigSchema.safeParse(BREATHING_PATTERNS['478']);
    expect(result.success).toBe(true);
    expect(BREATHING_PATTERNS['478'].inhale).toBe(4);
    expect(BREATHING_PATTERNS['478'].hold).toBe(7);
    expect(BREATHING_PATTERNS['478'].exhale).toBe(8);
  });

  it('devrait avoir des durées valides pour "energy"', () => {
    const result = BreathingConfigSchema.safeParse(BREATHING_PATTERNS.energy);
    expect(result.success).toBe(true);
    expect(BREATHING_PATTERNS.energy.inhale).toBe(2);
    expect(BREATHING_PATTERNS.energy.hold).toBe(1);
    expect(BREATHING_PATTERNS.energy.exhale).toBe(2);
  });

  it('devrait avoir des durées valides pour "coherence"', () => {
    const result = BreathingConfigSchema.safeParse(BREATHING_PATTERNS.coherence);
    expect(result.success).toBe(true);
    expect(BREATHING_PATTERNS.coherence.inhale).toBe(5);
    expect(BREATHING_PATTERNS.coherence.exhale).toBe(5);
  });
});
