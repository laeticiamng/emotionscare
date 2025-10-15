/**
 * Story Synth Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  StoryThemeSchema,
  StoryToneSchema,
  SessionPhaseSchema,
  StoryContentSchema,
  CreateStorySynthSessionSchema,
  CompleteStorySynthSessionSchema,
  StorySynthStatsSchema,
} from '../types';

describe('Story Synth Types', () => {
  describe('StoryThemeSchema', () => {
    it('accepts valid themes', () => {
      expect(StoryThemeSchema.parse('healing')).toBe('healing');
      expect(StoryThemeSchema.parse('growth')).toBe('growth');
      expect(StoryThemeSchema.parse('resilience')).toBe('resilience');
      expect(StoryThemeSchema.parse('acceptance')).toBe('acceptance');
      expect(StoryThemeSchema.parse('hope')).toBe('hope');
    });

    it('rejects invalid themes', () => {
      expect(() => StoryThemeSchema.parse('invalid')).toThrow();
    });
  });

  describe('StoryToneSchema', () => {
    it('accepts valid tones', () => {
      expect(StoryToneSchema.parse('gentle')).toBe('gentle');
      expect(StoryToneSchema.parse('empowering')).toBe('empowering');
      expect(StoryToneSchema.parse('reflective')).toBe('reflective');
      expect(StoryToneSchema.parse('uplifting')).toBe('uplifting');
    });

    it('rejects invalid tones', () => {
      expect(() => StoryToneSchema.parse('invalid')).toThrow();
    });
  });

  describe('SessionPhaseSchema', () => {
    it('accepts valid phases', () => {
      expect(SessionPhaseSchema.parse('idle')).toBe('idle');
      expect(SessionPhaseSchema.parse('generating')).toBe('generating');
      expect(SessionPhaseSchema.parse('reading')).toBe('reading');
      expect(SessionPhaseSchema.parse('completed')).toBe('completed');
      expect(SessionPhaseSchema.parse('error')).toBe('error');
    });

    it('rejects invalid phases', () => {
      expect(() => SessionPhaseSchema.parse('invalid')).toThrow();
    });
  });

  describe('StoryContentSchema', () => {
    it('accepts valid story content', () => {
      const story = {
        title: 'The Journey',
        paragraphs: ['Once upon a time...', 'The end.'],
        moral: 'Believe in yourself',
        reflection_prompts: ['What did you feel?'],
      };
      expect(StoryContentSchema.parse(story)).toEqual(story);
    });

    it('accepts story without optional fields', () => {
      const story = {
        title: 'The Journey',
        paragraphs: ['Once upon a time...'],
      };
      expect(StoryContentSchema.parse(story)).toEqual(story);
    });

    it('rejects empty title', () => {
      const story = {
        title: '',
        paragraphs: ['text'],
      };
      expect(() => StoryContentSchema.parse(story)).toThrow();
    });
  });

  describe('CreateStorySynthSessionSchema', () => {
    it('accepts valid session creation payload', () => {
      const payload = {
        theme: 'healing',
        tone: 'gentle',
        user_context: 'I need comfort',
      };
      expect(CreateStorySynthSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects payload with missing required fields', () => {
      expect(() => CreateStorySynthSessionSchema.parse({ theme: 'healing' })).toThrow();
    });

    it('rejects user_context longer than 500 chars', () => {
      const payload = {
        theme: 'healing',
        tone: 'gentle',
        user_context: 'x'.repeat(501),
      };
      expect(() => CreateStorySynthSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('CompleteStorySynthSessionSchema', () => {
    it('accepts valid completion payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        reading_duration_seconds: 300,
      };
      expect(CompleteStorySynthSessionSchema.parse(payload)).toEqual(payload);
    });

    it('rejects negative duration', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        reading_duration_seconds: -10,
      };
      expect(() => CompleteStorySynthSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('StorySynthStatsSchema', () => {
    it('accepts valid stats', () => {
      const stats = {
        total_stories_read: 10,
        total_reading_time_minutes: 120.5,
        favorite_theme: 'healing',
        favorite_tone: 'gentle',
        completion_rate: 85.5,
      };
      expect(StorySynthStatsSchema.parse(stats)).toEqual(stats);
    });

    it('accepts null favorites', () => {
      const stats = {
        total_stories_read: 0,
        total_reading_time_minutes: 0,
        favorite_theme: null,
        favorite_tone: null,
        completion_rate: 0,
      };
      expect(StorySynthStatsSchema.parse(stats)).toEqual(stats);
    });

    it('rejects completion_rate > 100', () => {
      const stats = {
        total_stories_read: 10,
        total_reading_time_minutes: 120,
        favorite_theme: null,
        favorite_tone: null,
        completion_rate: 101,
      };
      expect(() => StorySynthStatsSchema.parse(stats)).toThrow();
    });
  });
});
