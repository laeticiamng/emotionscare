/**
 * Story Synth Types Tests
 * Tests unitaires pour les schémas Zod du module Story Synth
 */

import { describe, expect, it } from 'vitest';
import {
  StoryThemeSchema,
  StoryToneSchema,
  StorySynthSessionSchema,
  StoryContentSchema,
  StorySynthStatsSchema,
  CreateStorySynthSessionSchema,
  CompleteStorySynthSessionSchema,
  type StoryTheme,
  type StoryTone,
} from '../types';

describe('Story Synth Types', () => {
  describe('StoryThemeSchema', () => {
    it('validates valid story themes', () => {
      const validThemes: StoryTheme[] = [
        'calme',
        'aventure',
        'poetique',
        'mysterieux',
        'romance',
        'introspection',
        'nature',
      ];

      validThemes.forEach((theme) => {
        expect(() => StoryThemeSchema.parse(theme)).not.toThrow();
      });
    });

    it('rejects invalid themes', () => {
      expect(() => StoryThemeSchema.parse('invalid_theme')).toThrow();
      expect(() => StoryThemeSchema.parse('')).toThrow();
      expect(() => StoryThemeSchema.parse(123)).toThrow();
    });
  });

  describe('StoryToneSchema', () => {
    it('validates valid story tones', () => {
      const validTones: StoryTone[] = [
        'apaisant',
        'encourageant',
        'contemplatif',
        'joyeux',
        'nostalgique',
        'esperant',
      ];

      validTones.forEach((tone) => {
        expect(() => StoryToneSchema.parse(tone)).not.toThrow();
      });
    });

    it('rejects invalid tones', () => {
      expect(() => StoryToneSchema.parse('aggressive')).toThrow();
      expect(() => StoryToneSchema.parse(null)).toThrow();
    });
  });

  describe('StorySynthSessionSchema', () => {
    it('validates complete session object', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        theme: 'nature' as StoryTheme,
        tone: 'apaisant' as StoryTone,
        user_context: 'Feeling stressed at work',
        reading_duration_seconds: 0,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      expect(() => StorySynthSessionSchema.parse(session)).not.toThrow();
    });

    it('validates session with completed data', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        theme: 'calme' as StoryTheme,
        tone: 'esperant' as StoryTone,
        reading_duration_seconds: 420,
        completed_at: '2025-01-15T10:07:00Z',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:07:00Z',
      };

      expect(() => StorySynthSessionSchema.parse(session)).not.toThrow();
    });

    it('rejects invalid session objects', () => {
      expect(() =>
        StorySynthSessionSchema.parse({
          id: 'invalid-uuid',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          theme: 'hope',
          tone: 'calm',
        })
      ).toThrow();

      expect(() =>
        StorySynthSessionSchema.parse({
          id: '123e4567-e89b-12d3-a456-426614174000',
          theme: 'invalid_theme',
          tone: 'calm',
        })
      ).toThrow();
    });
  });

  describe('StoryContentSchema', () => {
    it('validates complete story content', () => {
      const content = {
        title: 'A Journey of Hope',
        paragraphs: [
          { id: 'p1', text: 'Once upon a time, in a world where courage mattered...', emphasis: 'normal' as const },
          { id: 'p2', text: 'And so the journey began.', emphasis: 'soft' as const },
        ],
        estimated_duration_seconds: 360,
        ambient_music: 'calm-piano',
      };

      expect(() => StoryContentSchema.parse(content)).not.toThrow();
    });

    it('validates story content without optional fields', () => {
      const content = {
        title: 'Simple Story',
        paragraphs: [
          { id: 'p1', text: 'A brief tale of transformation.' },
        ],
      };

      expect(() => StoryContentSchema.parse(content)).not.toThrow();
    });

    it('rejects invalid story content', () => {
      expect(() =>
        StoryContentSchema.parse({
          title: '',
          narrative: 'Story',
          reflection_prompts: [],
          duration_seconds: 120,
        })
      ).toThrow();

      expect(() =>
        StoryContentSchema.parse({
          title: 'Title',
          narrative: '',
          reflection_prompts: [],
          duration_seconds: -10,
        })
      ).toThrow();

      expect(() =>
        StoryContentSchema.parse({
          title: 'Title',
          narrative: 'Story',
          reflection_prompts: 'not an array',
          duration_seconds: 120,
        })
      ).toThrow();
    });
  });

  describe('StorySynthStatsSchema', () => {
    it('validates complete stats object', () => {
      const stats = {
        total_stories_read: 42,
        total_reading_time_minutes: 300,
        favorite_theme: 'nature' as StoryTheme,
        favorite_tone: 'apaisant' as StoryTone,
        completion_rate: 0.85,
      };

      expect(() => StorySynthStatsSchema.parse(stats)).not.toThrow();
    });

    it('validates stats with null optional fields', () => {
      const stats = {
        total_stories_read: 0,
        total_reading_time_minutes: 0,
        favorite_theme: null,
        favorite_tone: null,
        completion_rate: 0,
      };

      expect(() => StorySynthStatsSchema.parse(stats)).not.toThrow();
    });

    it('rejects invalid stats', () => {
      expect(() =>
        StorySynthStatsSchema.parse({
          total_stories_read: -1,
          total_reading_time_minutes: 0,
          completion_rate: 0,
        })
      ).toThrow();

      expect(() =>
        StorySynthStatsSchema.parse({
          total_stories_read: 10,
          total_reading_time_minutes: -500,
          completion_rate: 0.5,
        })
      ).toThrow();

      expect(() =>
        StorySynthStatsSchema.parse({
          total_stories_read: 10,
          total_reading_time_minutes: 1000,
          completion_rate: 1.5,
        })
      ).toThrow();
    });
  });

  describe('CreateStorySynthSessionSchema', () => {
    it('validates session creation with all fields', () => {
      const payload = {
        theme: 'poetique' as StoryTheme,
        tone: 'contemplatif' as StoryTone,
        user_context: 'Preparing for a difficult conversation',
      };

      expect(() => CreateStorySynthSessionSchema.parse(payload)).not.toThrow();
    });

    it('validates session creation without optional context', () => {
      const payload = {
        theme: 'aventure' as StoryTheme,
        tone: 'joyeux' as StoryTone,
      };

      expect(() => CreateStorySynthSessionSchema.parse(payload)).not.toThrow();
    });

    it('rejects invalid creation payload', () => {
      expect(() =>
        CreateStorySynthSessionSchema.parse({
          theme: 'invalid',
          tone: 'apaisant',
        })
      ).toThrow();

      expect(() =>
        CreateStorySynthSessionSchema.parse({
          theme: 'calme',
        })
      ).toThrow();
    });
  });

  describe('CompleteStorySynthSessionSchema', () => {
    it('validates complete session payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        reading_duration_seconds: 360,
      };

      expect(() => CompleteStorySynthSessionSchema.parse(payload)).not.toThrow();
    });

    it('rejects invalid completion payload', () => {
      expect(() =>
        CompleteStorySynthSessionSchema.parse({
          session_id: 'invalid-uuid',
          reading_duration_seconds: 300,
        })
      ).toThrow();

      expect(() =>
        CompleteStorySynthSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          reading_duration_seconds: -10,
        })
      ).toThrow();

      expect(() =>
        CompleteStorySynthSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).toThrow();
    });
  });

  describe('Type exports', () => {
    it('exports all necessary types', () => {
      // This test ensures TypeScript compilation succeeds with proper exports
      const theme: StoryTheme = 'nature';
      const tone: StoryTone = 'apaisant';

      expect(theme).toBe('nature');
      expect(tone).toBe('apaisant');
    });
  });
});
