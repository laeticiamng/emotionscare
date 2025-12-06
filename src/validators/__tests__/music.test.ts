/**
 * Tests pour validateurs music.ts
 */

import { describe, it, expect } from 'vitest';
import {
  SunoModelSchema,
  MusicGenerationInputSchema,
  CreatePlaylistSchema,
  AddToPlaylistSchema,
  ShareMusicSchema,
  MusicPreferencesSchema,
  MusicSessionConfigSchema,
  EmotionUpdateSchema,
  SessionFeedbackSchema,
  StartChallengeSchema,
  validateInput,
  validateInputAsync,
  sanitizeText,
  isValidUUID,
  isValidURL
} from '../music';

describe('Music Validators', () => {
  describe('SunoModelSchema', () => {
    it('should accept valid Suno models', () => {
      expect(() => SunoModelSchema.parse('V3_5')).not.toThrow();
      expect(() => SunoModelSchema.parse('V4')).not.toThrow();
      expect(() => SunoModelSchema.parse('V4_5')).not.toThrow();
      expect(() => SunoModelSchema.parse('V4_5PLUS')).not.toThrow();
      expect(() => SunoModelSchema.parse('V5')).not.toThrow();
    });

    it('should reject invalid models', () => {
      expect(() => SunoModelSchema.parse('V6')).toThrow();
      expect(() => SunoModelSchema.parse('invalid')).toThrow();
      expect(() => SunoModelSchema.parse('')).toThrow();
    });
  });

  describe('MusicGenerationInputSchema', () => {
    const validInput = {
      title: 'Test Music',
      style: 'ambient, calm',
      model: 'V4' as const,
      instrumental: true,
      durationSeconds: 180
    };

    it('should accept valid input', () => {
      const result = MusicGenerationInputSchema.parse(validInput);
      expect(result.title).toBe('Test Music');
      expect(result.style).toBe('ambient, calm');
      expect(result.model).toBe('V4');
      expect(result.instrumental).toBe(true);
      expect(result.durationSeconds).toBe(180);
    });

    it('should trim whitespace from title', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        title: '  Test Music  '
      });
      expect(result.title).toBe('Test Music');
    });

    it('should trim whitespace from style', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        style: '  ambient, calm  '
      });
      expect(result.style).toBe('ambient, calm');
    });

    it('should trim whitespace from optional prompt', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        prompt: '  Nice music  '
      });
      expect(result.prompt).toBe('Nice music');
    });

    it('should reject empty title', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        title: ''
      })).toThrow('Le titre est requis');
    });

    it('should reject too long title', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        title: 'a'.repeat(101)
      })).toThrow();
    });

    it('should reject empty style', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        style: ''
      })).toThrow('Le style est requis');
    });

    it('should reject too long style', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        style: 'a'.repeat(201)
      })).toThrow();
    });

    it('should reject too long prompt', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        prompt: 'a'.repeat(501)
      })).toThrow();
    });

    it('should reject duration too short', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        durationSeconds: 29
      })).toThrow('Durée minimum: 30 secondes');
    });

    it('should reject duration too long', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        durationSeconds: 601
      })).toThrow();
    });

    it('should apply default values', () => {
      const result = MusicGenerationInputSchema.parse({
        title: 'Test',
        style: 'ambient'
      });
      expect(result.model).toBe('V4');
      expect(result.instrumental).toBe(true);
      expect(result.durationSeconds).toBe(180);
    });

    it('should accept valid vocalGender', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        vocalGender: 'm'
      });
      expect(result.vocalGender).toBe('m');
    });

    it('should reject invalid vocalGender', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        vocalGender: 'invalid'
      })).toThrow();
    });

    it('should accept styleWeight in range', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        styleWeight: 50
      });
      expect(result.styleWeight).toBe(50);
    });

    it('should reject styleWeight out of range', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        styleWeight: -1
      })).toThrow();

      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        styleWeight: 101
      })).toThrow();
    });

    it('should accept negativeTags array', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        negativeTags: ['noise', 'distortion']
      });
      expect(result.negativeTags).toEqual(['noise', 'distortion']);
    });

    it('should reject too many negativeTags', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        negativeTags: Array(11).fill('tag')
      })).toThrow();
    });

    it('should accept weirdnessConstraint in range', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        weirdnessConstraint: 0.5
      });
      expect(result.weirdnessConstraint).toBe(0.5);
    });

    it('should reject weirdnessConstraint out of range', () => {
      expect(() => MusicGenerationInputSchema.parse({
        ...validInput,
        weirdnessConstraint: 1.5
      })).toThrow();
    });

    it('should accept audioWeight in range', () => {
      const result = MusicGenerationInputSchema.parse({
        ...validInput,
        audioWeight: 0.7
      });
      expect(result.audioWeight).toBe(0.7);
    });
  });

  describe('CreatePlaylistSchema', () => {
    const validInput = {
      name: 'My Playlist',
      description: 'Test description',
      isPublic: false,
      tags: ['chill', 'relax']
    };

    it('should accept valid input', () => {
      const result = CreatePlaylistSchema.parse(validInput);
      expect(result.name).toBe('My Playlist');
      expect(result.description).toBe('Test description');
      expect(result.isPublic).toBe(false);
      expect(result.tags).toEqual(['chill', 'relax']);
    });

    it('should trim whitespace from name', () => {
      const result = CreatePlaylistSchema.parse({
        ...validInput,
        name: '  My Playlist  '
      });
      expect(result.name).toBe('My Playlist');
    });

    it('should trim whitespace from description', () => {
      const result = CreatePlaylistSchema.parse({
        ...validInput,
        description: '  Test description  '
      });
      expect(result.description).toBe('Test description');
    });

    it('should reject empty name', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        name: ''
      })).toThrow('Le nom de la playlist est requis');
    });

    it('should reject too long name', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        name: 'a'.repeat(101)
      })).toThrow();
    });

    it('should reject too long description', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        description: 'a'.repeat(501)
      })).toThrow();
    });

    it('should reject too many tags', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        tags: Array(21).fill('tag')
      })).toThrow();
    });

    it('should reject tags that are too long', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        tags: ['a'.repeat(51)]
      })).toThrow();
    });

    it('should apply default values', () => {
      const result = CreatePlaylistSchema.parse({
        name: 'Test'
      });
      expect(result.isPublic).toBe(false);
      expect(result.tags).toEqual([]);
    });

    it('should accept valid coverImageUrl', () => {
      const result = CreatePlaylistSchema.parse({
        ...validInput,
        coverImageUrl: 'https://example.com/image.jpg'
      });
      expect(result.coverImageUrl).toBe('https://example.com/image.jpg');
    });

    it('should reject invalid coverImageUrl', () => {
      expect(() => CreatePlaylistSchema.parse({
        ...validInput,
        coverImageUrl: 'not-a-url'
      })).toThrow();
    });
  });

  describe('AddToPlaylistSchema', () => {
    const validUUID1 = '123e4567-e89b-12d3-a456-426614174000';
    const validUUID2 = '123e4567-e89b-12d3-a456-426614174001';

    it('should accept valid UUIDs', () => {
      const result = AddToPlaylistSchema.parse({
        playlistId: validUUID1,
        musicGenerationId: validUUID2
      });
      expect(result.playlistId).toBe(validUUID1);
      expect(result.musicGenerationId).toBe(validUUID2);
    });

    it('should reject invalid playlist UUID', () => {
      expect(() => AddToPlaylistSchema.parse({
        playlistId: 'invalid-uuid',
        musicGenerationId: validUUID2
      })).toThrow();
    });

    it('should reject invalid music generation UUID', () => {
      expect(() => AddToPlaylistSchema.parse({
        playlistId: validUUID1,
        musicGenerationId: 'invalid-uuid'
      })).toThrow();
    });
  });

  describe('ShareMusicSchema', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';

    const validInput = {
      musicGenerationId: validUUID,
      isPublic: false,
      message: 'Check this out!',
      expiresInDays: 7
    };

    it('should accept valid input', () => {
      const result = ShareMusicSchema.parse(validInput);
      expect(result.musicGenerationId).toBe(validUUID);
      expect(result.isPublic).toBe(false);
      expect(result.message).toBe('Check this out!');
      expect(result.expiresInDays).toBe(7);
    });

    it('should trim whitespace from message', () => {
      const result = ShareMusicSchema.parse({
        ...validInput,
        message: '  Check this out!  '
      });
      expect(result.message).toBe('Check this out!');
    });

    it('should reject invalid musicGenerationId', () => {
      expect(() => ShareMusicSchema.parse({
        ...validInput,
        musicGenerationId: 'invalid-uuid'
      })).toThrow();
    });

    it('should reject too long message', () => {
      expect(() => ShareMusicSchema.parse({
        ...validInput,
        message: 'a'.repeat(501)
      })).toThrow();
    });

    it('should reject expiresInDays too short', () => {
      expect(() => ShareMusicSchema.parse({
        ...validInput,
        expiresInDays: 0
      })).toThrow();
    });

    it('should reject expiresInDays too long', () => {
      expect(() => ShareMusicSchema.parse({
        ...validInput,
        expiresInDays: 366
      })).toThrow();
    });

    it('should apply default isPublic', () => {
      const result = ShareMusicSchema.parse({
        musicGenerationId: validUUID
      });
      expect(result.isPublic).toBe(false);
    });

    it('should accept valid sharedWith UUID', () => {
      const result = ShareMusicSchema.parse({
        ...validInput,
        sharedWith: validUUID
      });
      expect(result.sharedWith).toBe(validUUID);
    });

    it('should reject invalid sharedWith UUID', () => {
      expect(() => ShareMusicSchema.parse({
        ...validInput,
        sharedWith: 'invalid-uuid'
      })).toThrow();
    });
  });

  describe('MusicPreferencesSchema', () => {
    const validInput = {
      favoriteGenres: ['ambient', 'electronic'],
      dislikedGenres: ['heavy metal'],
      preferredDuration: 180,
      autoplay: true,
      languagePreference: 'fr'
    };

    it('should accept valid input', () => {
      const result = MusicPreferencesSchema.parse(validInput);
      expect(result.favoriteGenres).toEqual(['ambient', 'electronic']);
      expect(result.dislikedGenres).toEqual(['heavy metal']);
      expect(result.preferredDuration).toBe(180);
      expect(result.autoplay).toBe(true);
      expect(result.languagePreference).toBe('fr');
    });

    it('should apply default values', () => {
      const result = MusicPreferencesSchema.parse({});
      expect(result.favoriteGenres).toEqual([]);
      expect(result.dislikedGenres).toEqual([]);
      expect(result.autoplay).toBe(true);
    });

    it('should reject too many favoriteGenres', () => {
      expect(() => MusicPreferencesSchema.parse({
        favoriteGenres: Array(21).fill('genre')
      })).toThrow();
    });

    it('should reject too long genre names', () => {
      expect(() => MusicPreferencesSchema.parse({
        favoriteGenres: ['a'.repeat(51)]
      })).toThrow();
    });

    it('should reject invalid preferredDuration', () => {
      expect(() => MusicPreferencesSchema.parse({
        preferredDuration: 29
      })).toThrow();

      expect(() => MusicPreferencesSchema.parse({
        preferredDuration: 601
      })).toThrow();
    });

    it('should reject invalid language code', () => {
      expect(() => MusicPreferencesSchema.parse({
        languagePreference: 'fra' // Should be 2 chars
      })).toThrow();
    });
  });

  describe('MusicSessionConfigSchema', () => {
    const validInput = {
      emotion: 'calm',
      duration: 30,
      intensity: 5,
      adaptiveMode: true,
      targetMood: 'relaxed',
      biofeedbackEnabled: false
    };

    it('should accept valid input', () => {
      const result = MusicSessionConfigSchema.parse(validInput);
      expect(result.emotion).toBe('calm');
      expect(result.duration).toBe(30);
      expect(result.intensity).toBe(5);
      expect(result.adaptiveMode).toBe(true);
    });

    it('should apply default values', () => {
      const result = MusicSessionConfigSchema.parse({
        emotion: 'calm'
      });
      expect(result.duration).toBe(30);
      expect(result.intensity).toBe(5);
      expect(result.adaptiveMode).toBe(true);
      expect(result.biofeedbackEnabled).toBe(false);
    });

    it('should reject empty emotion', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: ''
      })).toThrow();
    });

    it('should reject too long emotion', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: 'a'.repeat(101)
      })).toThrow();
    });

    it('should reject duration too short', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: 'calm',
        duration: 4
      })).toThrow();
    });

    it('should reject duration too long', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: 'calm',
        duration: 121
      })).toThrow();
    });

    it('should reject intensity too low', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: 'calm',
        intensity: 0
      })).toThrow();
    });

    it('should reject intensity too high', () => {
      expect(() => MusicSessionConfigSchema.parse({
        emotion: 'calm',
        intensity: 11
      })).toThrow();
    });
  });

  describe('EmotionUpdateSchema', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const validInput = {
      sessionId: validUUID,
      emotionData: {
        valence: 70,
        arousal: 50,
        dominance: 60,
        timestamp: '2025-11-14T10:00:00Z'
      }
    };

    it('should accept valid input', () => {
      const result = EmotionUpdateSchema.parse(validInput);
      expect(result.sessionId).toBe(validUUID);
      expect(result.emotionData.valence).toBe(70);
      expect(result.emotionData.arousal).toBe(50);
      expect(result.emotionData.dominance).toBe(60);
    });

    it('should reject invalid sessionId', () => {
      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        sessionId: 'invalid-uuid'
      })).toThrow();
    });

    it('should reject valence out of range', () => {
      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        emotionData: { ...validInput.emotionData, valence: -1 }
      })).toThrow();

      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        emotionData: { ...validInput.emotionData, valence: 101 }
      })).toThrow();
    });

    it('should reject arousal out of range', () => {
      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        emotionData: { ...validInput.emotionData, arousal: -1 }
      })).toThrow();

      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        emotionData: { ...validInput.emotionData, arousal: 101 }
      })).toThrow();
    });

    it('should accept optional dominance', () => {
      const { dominance, ...emotionDataWithoutDominance } = validInput.emotionData;
      const result = EmotionUpdateSchema.parse({
        sessionId: validUUID,
        emotionData: emotionDataWithoutDominance
      });
      expect(result.emotionData.dominance).toBeUndefined();
    });

    it('should reject invalid timestamp format', () => {
      expect(() => EmotionUpdateSchema.parse({
        ...validInput,
        emotionData: { ...validInput.emotionData, timestamp: 'invalid-date' }
      })).toThrow();
    });
  });

  describe('SessionFeedbackSchema', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const validInput = {
      sessionId: validUUID,
      rating: 4,
      effectiveness: 8,
      comment: 'Great session!',
      wouldRecommend: true,
      tags: ['relaxing', 'helpful']
    };

    it('should accept valid input', () => {
      const result = SessionFeedbackSchema.parse(validInput);
      expect(result.sessionId).toBe(validUUID);
      expect(result.rating).toBe(4);
      expect(result.effectiveness).toBe(8);
      expect(result.comment).toBe('Great session!');
      expect(result.wouldRecommend).toBe(true);
      expect(result.tags).toEqual(['relaxing', 'helpful']);
    });

    it('should trim whitespace from comment', () => {
      const result = SessionFeedbackSchema.parse({
        ...validInput,
        comment: '  Great session!  '
      });
      expect(result.comment).toBe('Great session!');
    });

    it('should reject rating out of range', () => {
      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        rating: 0
      })).toThrow();

      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        rating: 6
      })).toThrow();
    });

    it('should reject effectiveness out of range', () => {
      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        effectiveness: 0
      })).toThrow();

      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        effectiveness: 11
      })).toThrow();
    });

    it('should reject too long comment', () => {
      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        comment: 'a'.repeat(1001)
      })).toThrow();
    });

    it('should reject too many tags', () => {
      expect(() => SessionFeedbackSchema.parse({
        ...validInput,
        tags: Array(11).fill('tag')
      })).toThrow();
    });

    it('should apply default tags', () => {
      const { tags, ...inputWithoutTags } = validInput;
      const result = SessionFeedbackSchema.parse(inputWithoutTags);
      expect(result.tags).toEqual([]);
    });
  });

  describe('StartChallengeSchema', () => {
    const validInput = {
      challengeId: 'daily-meditation',
      metadata: { difficulty: 'easy' }
    };

    it('should accept valid input', () => {
      const result = StartChallengeSchema.parse(validInput);
      expect(result.challengeId).toBe('daily-meditation');
      expect(result.metadata).toEqual({ difficulty: 'easy' });
    });

    it('should reject empty challengeId', () => {
      expect(() => StartChallengeSchema.parse({
        challengeId: ''
      })).toThrow();
    });

    it('should reject too long challengeId', () => {
      expect(() => StartChallengeSchema.parse({
        challengeId: 'a'.repeat(101)
      })).toThrow();
    });

    it('should accept optional metadata', () => {
      const result = StartChallengeSchema.parse({
        challengeId: 'daily-meditation'
      });
      expect(result.metadata).toBeUndefined();
    });
  });

  describe('validateInput helper', () => {
    it('should return success with valid data', () => {
      const result = validateInput(CreatePlaylistSchema, {
        name: 'Test Playlist'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test Playlist');
      }
    });

    it('should return errors with invalid data', () => {
      const result = validateInput(CreatePlaylistSchema, {
        name: ''
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toContain('name');
      }
    });

    it('should handle non-Zod errors', () => {
      const badSchema = {
        parse: () => {
          throw new Error('Custom error');
        }
      } as any;

      const result = validateInput(badSchema, {});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual(['Validation error']);
      }
    });
  });

  describe('validateInputAsync helper', () => {
    it('should return success with valid data', async () => {
      const result = await validateInputAsync(CreatePlaylistSchema, {
        name: 'Test Playlist'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test Playlist');
      }
    });

    it('should return errors with invalid data', async () => {
      const result = await validateInputAsync(CreatePlaylistSchema, {
        name: ''
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('sanitizeText helper', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape quotes', () => {
      expect(sanitizeText('Test "quoted" text')).toContain('&quot;');
      expect(sanitizeText("Test 'quoted' text")).toContain('&#x27;');
    });

    it('should escape forward slashes', () => {
      expect(sanitizeText('path/to/file')).toContain('&#x2F;');
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('should handle normal text', () => {
      expect(sanitizeText('Normal text')).toBe('Normal text');
    });
  });

  describe('isValidUUID helper', () => {
    it('should accept valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400')).toBe(false); // Too short
      expect(isValidUUID('123e4567e89b12d3a456426614174000')).toBe(false); // No hyphens
      expect(isValidUUID('')).toBe(false);
    });

    it('should reject UUID with wrong version', () => {
      expect(isValidUUID('123e4567-e89b-52d3-a456-426614174000')).toBe(false); // Version 5, not 4
    });
  });

  describe('isValidURL helper', () => {
    it('should accept valid URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://example.com/path')).toBe(true);
      expect(isValidURL('https://example.com:8080/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('ftp://example.com')).toBe(true); // FTP is valid
      expect(isValidURL('')).toBe(false);
      expect(isValidURL('example.com')).toBe(false); // Missing protocol
    });
  });
});
