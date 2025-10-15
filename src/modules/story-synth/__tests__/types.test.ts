/**
 * Story Synth Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  StoryThemeSchema,
  StoryToneSchema,
  StoryContentSchema,
  StorySynthSessionSchema,
  CreateStorySynthSessionSchema,
  CompleteStorySynthSessionSchema,
  StorySynthStateSchema,
  StorySynthStatsSchema,
  StoryGenerationConfigSchema,
} from '../types';

describe('Story Synth Schemas', () => {
  describe('StoryTheme', () => {
    it('should validate valid themes', () => {
      const themes = ['calme', 'aventure', 'poetique', 'mysterieux', 'romance', 'introspection', 'nature'];
      themes.forEach(theme => {
        expect(() => StoryThemeSchema.parse(theme)).not.toThrow();
      });
    });

    it('should reject invalid themes', () => {
      expect(() => StoryThemeSchema.parse('invalid')).toThrow();
    });
  });

  describe('StoryTone', () => {
    it('should validate valid tones', () => {
      const tones = ['apaisant', 'encourageant', 'contemplatif', 'joyeux', 'nostalgique', 'esperant'];
      tones.forEach(tone => {
        expect(() => StoryToneSchema.parse(tone)).not.toThrow();
      });
    });

    it('should reject invalid tones', () => {
      expect(() => StoryToneSchema.parse('invalid')).toThrow();
    });
  });

  describe('StoryContent', () => {
    it('should validate valid story content', () => {
      const content = {
        title: 'Une histoire apaisante',
        paragraphs: [
          { id: 'p1', text: 'Il était une fois...' },
          { id: 'p2', text: 'Dans un monde paisible...', emphasis: 'soft' },
        ],
        estimated_duration_seconds: 180,
      };
      expect(() => StoryContentSchema.parse(content)).not.toThrow();
    });

    it('should require title and paragraphs', () => {
      expect(() => StoryContentSchema.parse({ title: 'Test' })).toThrow();
      expect(() => StoryContentSchema.parse({ paragraphs: [] })).toThrow();
    });
  });

  describe('StorySynthSession', () => {
    it('should validate complete session', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        theme: 'calme',
        tone: 'apaisant',
        reading_duration_seconds: 0,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      };
      expect(() => StorySynthSessionSchema.parse(session)).not.toThrow();
    });

    it('should require valid UUIDs', () => {
      const session = {
        id: 'invalid-uuid',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        theme: 'calme',
        tone: 'apaisant',
        reading_duration_seconds: 0,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      };
      expect(() => StorySynthSessionSchema.parse(session)).toThrow();
    });
  });

  describe('CreateStorySynthSession', () => {
    it('should validate creation payload', () => {
      const payload = {
        theme: 'aventure',
        tone: 'encourageant',
        user_context: 'Besoin de motivation',
      };
      expect(() => CreateStorySynthSessionSchema.parse(payload)).not.toThrow();
    });

    it('should accept minimal payload', () => {
      const payload = {
        theme: 'calme',
        tone: 'apaisant',
      };
      expect(() => CreateStorySynthSessionSchema.parse(payload)).not.toThrow();
    });
  });

  describe('CompleteStorySynthSession', () => {
    it('should validate completion payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        reading_duration_seconds: 300,
      };
      expect(() => CompleteStorySynthSessionSchema.parse(payload)).not.toThrow();
    });

    it('should reject negative duration', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        reading_duration_seconds: -10,
      };
      expect(() => CompleteStorySynthSessionSchema.parse(payload)).toThrow();
    });
  });

  describe('StorySynthState', () => {
    it('should validate idle state', () => {
      const state = {
        phase: 'idle',
        session: null,
        currentStory: null,
        startTime: null,
        error: null,
      };
      expect(() => StorySynthStateSchema.parse(state)).not.toThrow();
    });

    it('should validate reading state', () => {
      const state = {
        phase: 'reading',
        session: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          theme: 'calme',
          tone: 'apaisant',
          reading_duration_seconds: 0,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        currentStory: {
          title: 'Test',
          paragraphs: [{ id: 'p1', text: 'Test' }],
        },
        startTime: Date.now(),
        error: null,
      };
      expect(() => StorySynthStateSchema.parse(state)).not.toThrow();
    });
  });

  describe('StorySynthStats', () => {
    it('should validate stats with data', () => {
      const stats = {
        total_stories_read: 5,
        total_reading_time_minutes: 45.5,
        favorite_theme: 'calme',
        favorite_tone: 'apaisant',
        completion_rate: 80,
      };
      expect(() => StorySynthStatsSchema.parse(stats)).not.toThrow();
    });

    it('should accept null favorites', () => {
      const stats = {
        total_stories_read: 0,
        total_reading_time_minutes: 0,
        favorite_theme: null,
        favorite_tone: null,
        completion_rate: 0,
      };
      expect(() => StorySynthStatsSchema.parse(stats)).not.toThrow();
    });
  });

  describe('StoryGenerationConfig', () => {
    it('should validate full config', () => {
      const config = {
        theme: 'aventure',
        tone: 'encourageant',
        pov: 'je',
        style: 'lyrique',
        protagonist: 'Marie',
        location: 'la forêt',
        length: 7,
        seed: 'abc123',
        user_context: 'Besoin d\'évasion',
      };
      expect(() => StoryGenerationConfigSchema.parse(config)).not.toThrow();
    });

    it('should apply defaults', () => {
      const config = {
        theme: 'calme',
        tone: 'apaisant',
      };
      const result = StoryGenerationConfigSchema.parse(config);
      expect(result.pov).toBe('je');
      expect(result.style).toBe('sobre');
      expect(result.protagonist).toBe('Alex');
      expect(result.length).toBe(5);
    });

    it('should enforce length constraints', () => {
      expect(() =>
        StoryGenerationConfigSchema.parse({
          theme: 'calme',
          tone: 'apaisant',
          length: 2,
        })
      ).toThrow();

      expect(() =>
        StoryGenerationConfigSchema.parse({
          theme: 'calme',
          tone: 'apaisant',
          length: 15,
        })
      ).toThrow();
    });
  });
});
