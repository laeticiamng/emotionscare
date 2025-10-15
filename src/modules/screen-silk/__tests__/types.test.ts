/**
 * Screen Silk Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  BreakLabelSchema,
  SessionPhaseSchema,
  CreateScreenSilkSessionSchema,
  CompleteScreenSilkSessionSchema,
  InterruptScreenSilkSessionSchema,
  ScreenSilkStatsSchema,
} from '../types';

describe('Screen Silk Types', () => {
  describe('BreakLabelSchema', () => {
    it('accepts valid labels', () => {
      expect(BreakLabelSchema.parse('gain')).toBe('gain');
      expect(BreakLabelSchema.parse('léger')).toBe('léger');
      expect(BreakLabelSchema.parse('incertain')).toBe('incertain');
    });

    it('rejects invalid labels', () => {
      expect(() => BreakLabelSchema.parse('invalid')).toThrow();
    });
  });

  describe('SessionPhaseSchema', () => {
    it('accepts valid phases', () => {
      expect(SessionPhaseSchema.parse('idle')).toBe('idle');
      expect(SessionPhaseSchema.parse('loading')).toBe('loading');
      expect(SessionPhaseSchema.parse('preparation')).toBe('preparation');
      expect(SessionPhaseSchema.parse('active')).toBe('active');
      expect(SessionPhaseSchema.parse('ending')).toBe('ending');
      expect(SessionPhaseSchema.parse('completed')).toBe('completed');
      expect(SessionPhaseSchema.parse('error')).toBe('error');
    });

    it('rejects invalid phases', () => {
      expect(() => SessionPhaseSchema.parse('invalid')).toThrow();
    });
  });

  describe('CreateScreenSilkSessionSchema', () => {
    it('accepts valid session creation payload', () => {
      const payload = {
        duration_seconds: 180,
      };
      expect(CreateScreenSilkSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects duration below minimum', () => {
      const payload = {
        duration_seconds: 30,
      };
      expect(() => CreateScreenSilkSessionSchema.parse(payload)).toThrow();
    });

    it('rejects duration above maximum', () => {
      const payload = {
        duration_seconds: 1000,
      };
      expect(() => CreateScreenSilkSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('CompleteScreenSilkSessionSchema', () => {
    it('accepts valid completion payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 15,
        completion_label: 'gain',
      };
      expect(CompleteScreenSilkSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects negative blink count', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: -5,
        completion_label: 'gain',
      };
      expect(() => CompleteScreenSilkSessionSchema.parse(payload)).toThrow();
    });

    it('rejects invalid completion label', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 15,
        completion_label: 'invalid',
      };
      expect(() => CompleteScreenSilkSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('InterruptScreenSilkSessionSchema', () => {
    it('accepts valid interrupt payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: 5,
      };
      expect(InterruptScreenSilkSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects negative blink count', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        blink_count: -1,
      };
      expect(() => InterruptScreenSilkSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('ScreenSilkStatsSchema', () => {
    it('accepts valid stats', () => {
      const stats = {
        total_sessions: 20,
        total_completed: 15,
        total_interrupted: 5,
        total_break_time_minutes: 60,
        average_duration_minutes: 3,
        completion_rate: 75,
      };
      expect(ScreenSilkStatsSchema.parse(stats)).toEqual(stats);
    });

    it('rejects negative values', () => {
      const stats = {
        total_sessions: -1,
        total_completed: 15,
        total_interrupted: 5,
        total_break_time_minutes: 60,
        average_duration_minutes: 3,
        completion_rate: 75,
      };
      expect(() => ScreenSilkStatsSchema.parse(stats)).toThrow();
    });

    it('rejects completion_rate > 100', () => {
      const stats = {
        total_sessions: 20,
        total_completed: 15,
        total_interrupted: 5,
        total_break_time_minutes: 60,
        average_duration_minutes: 3,
        completion_rate: 150,
      };
      expect(() => ScreenSilkStatsSchema.parse(stats)).toThrow();
    });
  });
});
