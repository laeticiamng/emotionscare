/**
 * AI Coach Types Tests
 * Tests unitaires pour les schémas Zod du module AI Coach
 */

import { describe, expect, it } from 'vitest';
import {
  CoachPersonalitySchema,
  SessionStatusSchema,
  MessageRoleSchema,
  TechniqueTypeSchema,
  CoachMessageSchema,
  EmotionDetectedSchema,
  ResourceProvidedSchema,
  CoachSessionSchema,
  CreateCoachSessionSchema,
  UpdateCoachSessionSchema,
  AddCoachMessageSchema,
  SendCoachMessageSchema,
  CompleteCoachSessionSchema,
  CoachStatsSchema,
  type CoachPersonality,
  type SessionStatus,
  type MessageRole,
  type TechniqueType,
} from '../types';

describe('AI Coach Types', () => {
  describe('CoachPersonalitySchema', () => {
    it('validates all coach personalities', () => {
      const validPersonalities: CoachPersonality[] = [
        'empathetic',
        'motivational',
        'analytical',
        'zen',
        'energetic',
      ];

      validPersonalities.forEach((personality) => {
        expect(() => CoachPersonalitySchema.parse(personality)).not.toThrow();
      });
    });

    it('rejects invalid personalities', () => {
      expect(() => CoachPersonalitySchema.parse('aggressive')).toThrow();
      expect(() => CoachPersonalitySchema.parse('')).toThrow();
    });
  });

  describe('SessionStatusSchema', () => {
    it('validates all session statuses', () => {
      const validStatuses: SessionStatus[] = ['active', 'paused', 'completed', 'abandoned'];

      validStatuses.forEach((status) => {
        expect(() => SessionStatusSchema.parse(status)).not.toThrow();
      });
    });

    it('rejects invalid statuses', () => {
      expect(() => SessionStatusSchema.parse('pending')).toThrow();
    });
  });

  describe('MessageRoleSchema', () => {
    it('validates all message roles', () => {
      const validRoles: MessageRole[] = ['user', 'assistant', 'system'];

      validRoles.forEach((role) => {
        expect(() => MessageRoleSchema.parse(role)).not.toThrow();
      });
    });

    it('rejects invalid roles', () => {
      expect(() => MessageRoleSchema.parse('bot')).toThrow();
    });
  });

  describe('TechniqueTypeSchema', () => {
    it('validates all technique types', () => {
      const validTechniques: TechniqueType[] = [
        'breathing',
        'meditation',
        'cognitive_reframing',
        'grounding',
        'progressive_relaxation',
        'mindfulness',
        'gratitude',
      ];

      validTechniques.forEach((technique) => {
        expect(() => TechniqueTypeSchema.parse(technique)).not.toThrow();
      });
    });

    it('rejects invalid techniques', () => {
      expect(() => TechniqueTypeSchema.parse('hypnosis')).toThrow();
    });
  });

  describe('CoachMessageSchema', () => {
    it('validates complete coach message', () => {
      const message = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        session_id: '123e4567-e89b-12d3-a456-426614174001',
        role: 'assistant' as MessageRole,
        content: 'How are you feeling today?',
        timestamp: '2025-01-15T10:00:00Z',
        metadata: { emotion: 'neutral' },
      };

      expect(() => CoachMessageSchema.parse(message)).not.toThrow();
    });

    it('validates message without metadata', () => {
      const message = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        session_id: '123e4567-e89b-12d3-a456-426614174001',
        role: 'user' as MessageRole,
        content: 'I feel stressed',
        timestamp: '2025-01-15T10:01:00Z',
      };

      expect(() => CoachMessageSchema.parse(message)).not.toThrow();
    });
  });

  describe('EmotionDetectedSchema', () => {
    it('validates emotion detection', () => {
      const emotion = {
        emotion: 'anxiety',
        confidence: 0.85,
        timestamp: '2025-01-15T10:00:00Z',
      };

      expect(() => EmotionDetectedSchema.parse(emotion)).not.toThrow();
    });

    it('rejects invalid confidence values', () => {
      expect(() =>
        EmotionDetectedSchema.parse({
          emotion: 'joy',
          confidence: 1.5,
          timestamp: '2025-01-15T10:00:00Z',
        })
      ).toThrow();

      expect(() =>
        EmotionDetectedSchema.parse({
          emotion: 'sadness',
          confidence: -0.1,
          timestamp: '2025-01-15T10:00:00Z',
        })
      ).toThrow();
    });
  });

  describe('ResourceProvidedSchema', () => {
    it('validates complete resource', () => {
      const resource = {
        title: 'Breathing Exercises Guide',
        type: 'article' as const,
        url: 'https://example.com/guide',
        description: 'A comprehensive guide to breathing exercises',
      };

      expect(() => ResourceProvidedSchema.parse(resource)).not.toThrow();
    });

    it('validates resource without optional fields', () => {
      const resource = {
        title: 'Quick Meditation',
        type: 'video' as const,
      };

      expect(() => ResourceProvidedSchema.parse(resource)).not.toThrow();
    });

    it('validates all resource types', () => {
      const types = ['article', 'video', 'exercise', 'tool', 'external'];

      types.forEach((type) => {
        const resource = {
          title: 'Test Resource',
          type: type as any,
        };
        expect(() => ResourceProvidedSchema.parse(resource)).not.toThrow();
      });
    });
  });

  describe('CoachSessionSchema', () => {
    it('validates complete session', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        coach_personality: 'empathetic' as CoachPersonality,
        session_duration: 1800,
        messages_count: 15,
        emotions_detected: [
          { emotion: 'stress', confidence: 0.9, timestamp: '2025-01-15T10:00:00Z' },
        ],
        techniques_suggested: ['breathing', 'mindfulness'],
        resources_provided: [
          { title: 'Guide', type: 'article' as const },
        ],
        user_satisfaction: 5,
        session_notes: 'Very helpful session',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:30:00Z',
      };

      expect(() => CoachSessionSchema.parse(session)).not.toThrow();
    });

    it('validates session with defaults', () => {
      const session = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        coach_personality: 'zen' as CoachPersonality,
        session_duration: 0,
        messages_count: 0,
        user_satisfaction: null,
        session_notes: null,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      expect(() => CoachSessionSchema.parse(session)).not.toThrow();
    });

    it('rejects invalid satisfaction scores', () => {
      expect(() =>
        CoachSessionSchema.parse({
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          coach_personality: 'empathetic',
          session_duration: 0,
          messages_count: 0,
          user_satisfaction: 6,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        })
      ).toThrow();
    });
  });

  describe('CreateCoachSessionSchema', () => {
    it('validates session creation with personality', () => {
      const payload = { coach_personality: 'motivational' as CoachPersonality };
      expect(() => CreateCoachSessionSchema.parse(payload)).not.toThrow();
    });

    it('uses default personality when not specified', () => {
      const payload = {};
      const result = CreateCoachSessionSchema.parse(payload);
      expect(result.coach_personality).toBe('empathetic');
    });
  });

  describe('UpdateCoachSessionSchema', () => {
    it('validates complete update payload', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        session_duration: 900,
        messages_count: 8,
        emotions_detected: [
          { emotion: 'calm', confidence: 0.8, timestamp: '2025-01-15T10:00:00Z' },
        ],
        techniques_suggested: ['breathing'],
        resources_provided: [],
        user_satisfaction: 4,
        session_notes: 'Good progress',
      };

      expect(() => UpdateCoachSessionSchema.parse(payload)).not.toThrow();
    });

    it('validates partial update', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        session_duration: 600,
      };

      expect(() => UpdateCoachSessionSchema.parse(payload)).not.toThrow();
    });
  });

  describe('AddCoachMessageSchema', () => {
    it('validates message addition', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'user' as MessageRole,
        content: 'I need help with anxiety',
        metadata: { source: 'web' },
      };

      expect(() => AddCoachMessageSchema.parse(payload)).not.toThrow();
    });

    it('rejects empty content', () => {
      expect(() =>
        AddCoachMessageSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          role: 'user',
          content: '',
        })
      ).toThrow();
    });

    it('rejects content exceeding max length', () => {
      const longContent = 'a'.repeat(5001);
      expect(() =>
        AddCoachMessageSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          role: 'user',
          content: longContent,
        })
      ).toThrow();
    });
  });

  describe('SendCoachMessageSchema', () => {
    it('validates message sending', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        message: 'How can I manage stress better?',
      };

      expect(() => SendCoachMessageSchema.parse(payload)).not.toThrow();
    });

    it('rejects messages exceeding 2000 characters', () => {
      const longMessage = 'a'.repeat(2001);
      expect(() =>
        SendCoachMessageSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          message: longMessage,
        })
      ).toThrow();
    });
  });

  describe('CompleteCoachSessionSchema', () => {
    it('validates session completion', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        user_satisfaction: 5,
        session_notes: 'Excellent session, very helpful',
      };

      expect(() => CompleteCoachSessionSchema.parse(payload)).not.toThrow();
    });

    it('validates completion without notes', () => {
      const payload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        user_satisfaction: 3,
      };

      expect(() => CompleteCoachSessionSchema.parse(payload)).not.toThrow();
    });

    it('rejects invalid satisfaction scores', () => {
      expect(() =>
        CompleteCoachSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          user_satisfaction: 0,
        })
      ).toThrow();

      expect(() =>
        CompleteCoachSessionSchema.parse({
          session_id: '123e4567-e89b-12d3-a456-426614174000',
          user_satisfaction: 6,
        })
      ).toThrow();
    });
  });

  describe('CoachStatsSchema', () => {
    it('validates complete stats', () => {
      const stats = {
        total_sessions: 42,
        completed_sessions: 35,
        total_duration_seconds: 75600,
        average_duration_seconds: 1800,
        total_messages: 630,
        average_messages_per_session: 15,
        average_satisfaction: 4.2,
        favorite_personality: 'empathetic' as CoachPersonality,
        most_detected_emotions: ['stress', 'anxiety', 'calm'],
        most_suggested_techniques: ['breathing', 'mindfulness'],
      };

      expect(() => CoachStatsSchema.parse(stats)).not.toThrow();
    });

    it('validates stats with null optional fields', () => {
      const stats = {
        total_sessions: 0,
        completed_sessions: 0,
        total_duration_seconds: 0,
        average_duration_seconds: 0,
        total_messages: 0,
        average_messages_per_session: 0,
        average_satisfaction: null,
        favorite_personality: null,
        most_detected_emotions: [],
        most_suggested_techniques: [],
      };

      expect(() => CoachStatsSchema.parse(stats)).not.toThrow();
    });

    it('rejects invalid stats values', () => {
      expect(() =>
        CoachStatsSchema.parse({
          total_sessions: -1,
          completed_sessions: 0,
          total_duration_seconds: 0,
          average_duration_seconds: 0,
          total_messages: 0,
          average_messages_per_session: 0,
        })
      ).toThrow();

      expect(() =>
        CoachStatsSchema.parse({
          total_sessions: 10,
          completed_sessions: 0,
          total_duration_seconds: 0,
          average_duration_seconds: 0,
          total_messages: 0,
          average_messages_per_session: 0,
          average_satisfaction: 6,
        })
      ).toThrow();
    });
  });

  describe('Type exports', () => {
    it('exports all necessary types', () => {
      const personality: CoachPersonality = 'empathetic';
      const status: SessionStatus = 'active';
      const role: MessageRole = 'assistant';
      const technique: TechniqueType = 'breathing';

      expect(personality).toBe('empathetic');
      expect(status).toBe('active');
      expect(role).toBe('assistant');
      expect(technique).toBe('breathing');
    });
  });
});
