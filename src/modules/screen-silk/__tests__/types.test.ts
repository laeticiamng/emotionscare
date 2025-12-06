/**
 * Screen Silk Types Tests
 * Tests unitaires pour les schémas Zod du module Screen Silk
 */

import { describe, expect, it } from 'vitest';
import {
  BreakLabelSchema,
  SessionPhaseSchema,
  ScreenSilkSessionSchema,
  CreateScreenSilkSessionSchema,
  CompleteScreenSilkSessionSchema,
  InterruptScreenSilkSessionSchema,
  ScreenSilkStatsSchema,
  type BreakLabel,
  type SessionPhase,
} from '../types';

describe('Screen Silk Types', () => {
  describe('BreakLabelSchema', () => {
    it('validates valid break labels', () => {
      const validLabels: BreakLabel[] = ['gain', 'léger', 'incertain'];

      validLabels.forEach((label) => {
        expect(() => BreakLabelSchema.parse(label)).not.toThrow();
      });
    });

    it('rejects invalid labels', () => {
      expect(() => BreakLabelSchema.parse('invalid')).toThrow();
      expect(() => BreakLabelSchema.parse('')).toThrow();
      expect(() => BreakLabelSchema.parse(null)).toThrow();
    });
  });

  describe('SessionPhaseSchema', () => {
    it('validates all session phases', () => {
      const validPhases: SessionPhase[] = [
        'idle',
        'loading',
        'preparation',
        'active',
        'ending',
        'completed',
        'error',
      ];

      validPhases.forEach((phase) => {
        expect(() => SessionPhaseSchema.parse(phase)).not.toThrow();
      });
    });

    it('rejects invalid phases', () => {
      expect(() => SessionPhaseSchema.parse('invalid_phase')).toThrow();
      expect(() => SessionPhaseSchema.parse('')).toThrow();
    });
  });

  describe('ScreenSilkSessionSchema', () => {
    it('validates complete session object', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        duration_seconds: 120,
        blink_count: 45,
        completion_label: 'gain' as BreakLabel,
        interrupted: false,
        started_at: '2025-01-15T10:00:00Z',
        completed_at: '2025-01-15T10:02:00Z',
        created_at: '2025-01-15T10:00:00Z',
      };

      expect(() => ScreenSilkSessionSchema.parse(session)).not.toThrow();
    });

    it('validates session with null completion', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        duration_seconds: 60,
        blink_count: 0,
        completion_label: null,
        interrupted: true,
        started_at: '2025-01-15T10:00:00Z',
        completed_at: null,
        created_at: '2025-01-15T10:00:00Z',
      };

      expect(() => ScreenSilkSessionSchema.parse(session)).not.toThrow();
    });

    it('rejects invalid session objects', () => {
      expect(() =>
        ScreenSilkSessionSchema.parse({
          id: 'invalid-uuid',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          duration_seconds: 120,
          blink_count: 10,
        })
      ).toThrow();

      expect(() =>
        ScreenSilkSessionSchema.parse({
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          duration_seconds: 30,
          blink_count: 10,
        })
      ).toThrow();

      expect(() =>
        ScreenSilkSessionSchema.parse({
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          duration_seconds: 120,
          blink_count: -5,
        })
      ).toThrow();
    });
  });

  describe('CreateScreenSilkSessionSchema', () => {
    it('validates session creation with valid duration', () => {
      const validDurations = [60, 90, 120, 150, 180, 300, 600];

      validDurations.forEach((duration) => {
        const payload = { duration_seconds: duration };
        expect(() => CreateScreenSilkSessionSchema.parse(payload)).not.toThrow();
      });
    });

    it('rejects durations outside allowed range', () => {
      expect(() =>
        CreateScreenSilkSessionSchema.parse({ duration_seconds: 30 })
      ).toThrow();

      expect(() =>
        CreateScreenSilkSessionSchema.parse({ duration_seconds: 700 })
      ).toThrow();

      expect(() =>
        CreateScreenSilkSessionSchema.parse({ duration_seconds: -60 })
      ).toThrow();
    });

    it('rejects missing duration', () => {
      expect(() => CreateScreenSilkSessionSchema.parse({})).toThrow();
    });
  });

  describe('CompleteScreenSilkSessionSchema', () => {
    it('validates complete session payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 42,
        completion_label: 'gain' as BreakLabel,
      };

      expect(() => CompleteScreenSilkSessionSchema.parse(payload)).not.toThrow();
    });

    it('validates all completion labels', () => {
      const labels: BreakLabel[] = ['gain', 'léger', 'incertain'];

      labels.forEach((label) => {
        const payload = {
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          blink_count: 20,
          completion_label: label,
        };
        expect(() => CompleteScreenSilkSessionSchema.parse(payload)).not.toThrow();
      });
    });

    it('rejects invalid completion payload', () => {
      expect(() =>
        CompleteScreenSilkSessionSchema.parse({
          session_id: 'invalid-uuid',
          blink_count: 10,
          completion_label: 'gain',
        })
      ).toThrow();

      expect(() =>
        CompleteScreenSilkSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          blink_count: -5,
          completion_label: 'gain',
        })
      ).toThrow();

      expect(() =>
        CompleteScreenSilkSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          blink_count: 10,
          completion_label: 'invalid_label',
        })
      ).toThrow();
    });
  });

  describe('InterruptScreenSilkSessionSchema', () => {
    it('validates interrupt payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 15,
      };

      expect(() => InterruptScreenSilkSessionSchema.parse(payload)).not.toThrow();
    });

    it('validates interrupt with zero blinks', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 0,
      };

      expect(() => InterruptScreenSilkSessionSchema.parse(payload)).not.toThrow();
    });

    it('rejects invalid interrupt payload', () => {
      expect(() =>
        InterruptScreenSilkSessionSchema.parse({
          session_id: 'invalid-uuid',
          blink_count: 10,
        })
      ).toThrow();

      expect(() =>
        InterruptScreenSilkSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          blink_count: -3,
        })
      ).toThrow();

      expect(() =>
        InterruptScreenSilkSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).toThrow();
    });
  });

  describe('ScreenSilkStatsSchema', () => {
    it('validates complete stats object', () => {
      const stats = {
        total_sessions: 156,
        total_completed: 120,
        total_interrupted: 36,
        total_break_time_minutes: 312,
        average_duration_minutes: 2.0,
        completion_rate: 76.92,
      };

      expect(() => ScreenSilkStatsSchema.parse(stats)).not.toThrow();
    });

    it('validates stats with zero values', () => {
      const stats = {
        total_sessions: 0,
        total_completed: 0,
        total_interrupted: 0,
        total_break_time_minutes: 0,
        average_duration_minutes: 0,
        completion_rate: 0,
      };

      expect(() => ScreenSilkStatsSchema.parse(stats)).not.toThrow();
    });

    it('validates stats with perfect completion rate', () => {
      const stats = {
        total_sessions: 50,
        total_completed: 50,
        total_interrupted: 0,
        total_break_time_minutes: 100,
        average_duration_minutes: 2.0,
        completion_rate: 100,
      };

      expect(() => ScreenSilkStatsSchema.parse(stats)).not.toThrow();
    });

    it('rejects invalid stats', () => {
      expect(() =>
        ScreenSilkStatsSchema.parse({
          total_sessions: -1,
          total_completed: 0,
          total_interrupted: 0,
          total_break_time_minutes: 100,
          average_duration_minutes: 2.0,
          completion_rate: 50,
        })
      ).toThrow();

      expect(() =>
        ScreenSilkStatsSchema.parse({
          total_sessions: 10,
          total_completed: 0,
          total_interrupted: 0,
          total_break_time_minutes: -50,
          average_duration_minutes: 2.0,
          completion_rate: 50,
        })
      ).toThrow();

      expect(() =>
        ScreenSilkStatsSchema.parse({
          total_sessions: 10,
          total_completed: 0,
          total_interrupted: 0,
          total_break_time_minutes: 100,
          average_duration_minutes: 2.0,
          completion_rate: 150,
        })
      ).toThrow();
    });
  });

  describe('Type exports', () => {
    it('exports all necessary types', () => {
      const label: BreakLabel = 'gain';
      const phase: SessionPhase = 'active';

      expect(label).toBe('gain');
      expect(phase).toBe('active');
    });
  });
});
