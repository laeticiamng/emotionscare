/**
 * VR Nebula Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  NebulaSceneSchema,
  BreathingPatternSchema,
  VRNebulaSessionSchema,
  CreateVRNebulaSessionSchema,
  CompleteVRNebulaSessionSchema,
  VRNebulaStateSchema,
  VRNebulaStatsSchema,
  BreathTimingSchema,
  NebulaConfigSchema,
  getBreathTiming,
  calculateCycleDuration,
  calculateCoherenceScore,
} from '../types';

describe('VR Nebula Schemas', () => {
  describe('NebulaScene', () => {
    it('should validate valid scenes', () => {
      const scenes = ['galaxy', 'ocean', 'forest', 'space', 'aurora', 'cosmos'];
      scenes.forEach(scene => {
        expect(() => NebulaSceneSchema.parse(scene)).not.toThrow();
      });
    });

    it('should reject invalid scenes', () => {
      expect(() => NebulaSceneSchema.parse('invalid')).toThrow();
    });
  });

  describe('BreathingPattern', () => {
    it('should validate valid patterns', () => {
      const patterns = ['box', 'coherence', 'relax', 'energize', 'calm'];
      patterns.forEach(pattern => {
        expect(() => BreathingPatternSchema.parse(pattern)).not.toThrow();
      });
    });

    it('should reject invalid patterns', () => {
      expect(() => BreathingPatternSchema.parse('invalid')).toThrow();
    });
  });

  describe('VRNebulaSession', () => {
    it('should validate complete session', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        scene: 'galaxy',
        breathing_pattern: 'coherence',
        duration_s: 600,
        resp_rate_avg: 5.8,
        hrv_pre: 50,
        hrv_post: 75,
        rmssd_delta: 25,
        coherence_score: 85,
        cycles_completed: 60,
        vr_mode: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:10:00Z',
      };
      expect(() => VRNebulaSessionSchema.parse(session)).not.toThrow();
    });

    it('should accept minimal session', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        scene: 'ocean',
        breathing_pattern: 'box',
        duration_s: 0,
        cycles_completed: 0,
        vr_mode: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      };
      expect(() => VRNebulaSessionSchema.parse(session)).not.toThrow();
    });
  });

  describe('CreateVRNebulaSession', () => {
    it('should validate creation payload', () => {
      const payload = {
        scene: 'space',
        breathing_pattern: 'relax',
        vr_mode: true,
      };
      expect(() => CreateVRNebulaSessionSchema.parse(payload)).not.toThrow();
    });

    it('should apply default vr_mode', () => {
      const payload = {
        scene: 'forest',
        breathing_pattern: 'calm',
      };
      const result = CreateVRNebulaSessionSchema.parse(payload);
      expect(result.vr_mode).toBe(true);
    });
  });

  describe('CompleteVRNebulaSession', () => {
    it('should validate completion payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        duration_s: 720,
        resp_rate_avg: 5.5,
        hrv_pre: 45,
        hrv_post: 70,
        cycles_completed: 72,
      };
      expect(() => CompleteVRNebulaSessionSchema.parse(payload)).not.toThrow();
    });

    it('should reject negative duration', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        duration_s: -10,
      };
      expect(() => CompleteVRNebulaSessionSchema.parse(payload)).toThrow();
    });

    it('should accept minimal completion', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        duration_s: 300,
      };
      const result = CompleteVRNebulaSessionSchema.parse(payload);
      expect(result.cycles_completed).toBe(0);
    });
  });

  describe('VRNebulaState', () => {
    it('should validate idle state', () => {
      const state = {
        phase: 'idle',
        session: null,
        currentBreathPhase: null,
        breathCount: 0,
        elapsedSeconds: 0,
        coherenceLevel: 0,
        error: null,
      };
      expect(() => VRNebulaStateSchema.parse(state)).not.toThrow();
    });

    it('should validate active state', () => {
      const state = {
        phase: 'active',
        session: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          scene: 'galaxy',
          breathing_pattern: 'coherence',
          duration_s: 0,
          cycles_completed: 0,
          vr_mode: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        currentBreathPhase: 'inhale',
        breathCount: 5,
        elapsedSeconds: 50,
        currentHRV: 60,
        coherenceLevel: 75,
        error: null,
      };
      expect(() => VRNebulaStateSchema.parse(state)).not.toThrow();
    });
  });

  describe('VRNebulaStats', () => {
    it('should validate complete stats', () => {
      const stats = {
        total_sessions: 25,
        total_minutes: 250,
        total_breaths: 1500,
        average_coherence: 78.5,
        average_hrv_gain: 22.3,
        favorite_scene: 'galaxy',
        favorite_pattern: 'coherence',
        sessions_this_week: 7,
        sessions_this_month: 20,
        longest_session_minutes: 20,
        current_streak_days: 5,
      };
      expect(() => VRNebulaStatsSchema.parse(stats)).not.toThrow();
    });

    it('should accept zero values', () => {
      const stats = {
        total_sessions: 0,
        total_minutes: 0,
        total_breaths: 0,
        average_coherence: 0,
        average_hrv_gain: 0,
        favorite_scene: null,
        favorite_pattern: null,
        sessions_this_week: 0,
        sessions_this_month: 0,
        longest_session_minutes: 0,
        current_streak_days: 0,
      };
      expect(() => VRNebulaStatsSchema.parse(stats)).not.toThrow();
    });
  });

  describe('BreathTiming', () => {
    it('should validate breath timing', () => {
      const timing = {
        inhale: 5,
        hold_in: 0,
        exhale: 5,
        hold_out: 0,
      };
      expect(() => BreathTimingSchema.parse(timing)).not.toThrow();
    });

    it('should enforce min/max constraints', () => {
      expect(() =>
        BreathTimingSchema.parse({
          inhale: 0,
          hold_in: 0,
          exhale: 5,
          hold_out: 0,
        }),
      ).toThrow();

      expect(() =>
        BreathTimingSchema.parse({
          inhale: 5,
          hold_in: 0,
          exhale: 20,
          hold_out: 0,
        }),
      ).toThrow();
    });
  });

  describe('NebulaConfig', () => {
    it('should validate full config', () => {
      const config = {
        scene: 'aurora',
        pattern: 'box',
        duration_minutes: 15,
        vr_mode: false,
        audio_enabled: true,
        haptic_feedback: false,
      };
      expect(() => NebulaConfigSchema.parse(config)).not.toThrow();
    });

    it('should apply defaults', () => {
      const config = {};
      const result = NebulaConfigSchema.parse(config);
      expect(result.scene).toBe('galaxy');
      expect(result.pattern).toBe('coherence');
      expect(result.duration_minutes).toBe(10);
      expect(result.vr_mode).toBe(true);
    });

    it('should enforce duration constraints', () => {
      expect(() =>
        NebulaConfigSchema.parse({ duration_minutes: 0 }),
      ).toThrow();
      expect(() =>
        NebulaConfigSchema.parse({ duration_minutes: 35 }),
      ).toThrow();
    });
  });

  describe('Helper functions', () => {
    describe('getBreathTiming', () => {
      it('should return correct timing for coherence', () => {
        const timing = getBreathTiming('coherence');
        expect(timing).toEqual({ inhale: 5, hold_in: 0, exhale: 5, hold_out: 0 });
      });

      it('should return correct timing for box', () => {
        const timing = getBreathTiming('box');
        expect(timing).toEqual({ inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 });
      });

      it('should return correct timing for relax', () => {
        const timing = getBreathTiming('relax');
        expect(timing).toEqual({ inhale: 4, hold_in: 7, exhale: 8, hold_out: 0 });
      });
    });

    describe('calculateCycleDuration', () => {
      it('should calculate coherence cycle duration', () => {
        const timing = { inhale: 5, hold_in: 0, exhale: 5, hold_out: 0 };
        expect(calculateCycleDuration(timing)).toBe(10);
      });

      it('should calculate box breathing cycle duration', () => {
        const timing = { inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 };
        expect(calculateCycleDuration(timing)).toBe(16);
      });
    });

    describe('calculateCoherenceScore', () => {
      it('should give high score for optimal rate and positive HRV', () => {
        const score = calculateCoherenceScore(5.5, 30);
        expect(score).toBeGreaterThan(70);
      });

      it('should give lower score for suboptimal rate', () => {
        const score1 = calculateCoherenceScore(5.5, 30);
        const score2 = calculateCoherenceScore(8.0, 30);
        expect(score1).toBeGreaterThan(score2);
      });

      it('should handle negative HRV delta', () => {
        const score = calculateCoherenceScore(5.5, -10);
        expect(score).toBeLessThanOrEqual(60);
      });
    });
  });
});
