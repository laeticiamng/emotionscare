/**
 * Bubble Beat Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  BubbleDifficultySchema,
  BubbleMoodSchema,
  SessionPhaseSchema,
  CreateBubbleBeatSessionSchema,
  CompleteBubbleBeatSessionSchema,
  BubbleBeatStatsSchema,
} from '../types';

describe('Bubble Beat Types', () => {
  describe('BubbleDifficultySchema', () => {
    it('accepts valid difficulties', () => {
      expect(BubbleDifficultySchema.parse('easy')).toBe('easy');
      expect(BubbleDifficultySchema.parse('medium')).toBe('medium');
      expect(BubbleDifficultySchema.parse('hard')).toBe('hard');
    });

    it('rejects invalid difficulties', () => {
      expect(() => BubbleDifficultySchema.parse('invalid')).toThrow();
    });
  });

  describe('BubbleMoodSchema', () => {
    it('accepts valid moods', () => {
      expect(BubbleMoodSchema.parse('calm')).toBe('calm');
      expect(BubbleMoodSchema.parse('energetic')).toBe('energetic');
      expect(BubbleMoodSchema.parse('focus')).toBe('focus');
    });

    it('rejects invalid moods', () => {
      expect(() => BubbleMoodSchema.parse('invalid')).toThrow();
    });
  });

  describe('SessionPhaseSchema', () => {
    it('accepts valid phases', () => {
      expect(SessionPhaseSchema.parse('idle')).toBe('idle');
      expect(SessionPhaseSchema.parse('playing')).toBe('playing');
      expect(SessionPhaseSchema.parse('paused')).toBe('paused');
      expect(SessionPhaseSchema.parse('completed')).toBe('completed');
    });

    it('rejects invalid phases', () => {
      expect(() => SessionPhaseSchema.parse('invalid')).toThrow();
    });
  });

  describe('CreateBubbleBeatSessionSchema', () => {
    it('accepts valid session creation payload', () => {
      const payload = {
        difficulty: 'medium',
        mood: 'calm',
      };
      expect(CreateBubbleBeatSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects payload with missing fields', () => {
      expect(() => CreateBubbleBeatSessionSchema.parse({})).toThrow();
    });
  });

  describe('CompleteBubbleBeatSessionSchema', () => {
    it('accepts valid completion payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        score: 500,
        bubbles_popped: 25,
        duration_seconds: 180,
      };
      expect(CompleteBubbleBeatSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects negative values', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        score: -10,
        bubbles_popped: 25,
        duration_seconds: 180,
      };
      expect(() => CompleteBubbleBeatSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('BubbleBeatStatsSchema', () => {
    it('accepts valid stats', () => {
      const stats = {
        total_sessions: 10,
        total_score: 5000,
        total_bubbles_popped: 250,
        average_score: 500,
        best_score: 800,
        total_playtime_minutes: 45.5,
      };
      expect(BubbleBeatStatsSchema.parse(stats)).toEqual(stats);
    });

    it('rejects negative values', () => {
      const stats = {
        total_sessions: -1,
        total_score: 5000,
        total_bubbles_popped: 250,
        average_score: 500,
        best_score: 800,
        total_playtime_minutes: 45.5,
      };
      expect(() => BubbleBeatStatsSchema.parse(stats)).toThrow();
    });
  });
});
