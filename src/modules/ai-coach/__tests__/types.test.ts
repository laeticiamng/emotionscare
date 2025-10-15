import { describe, it, expect } from 'vitest';
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
  CompleteCoachSessionSchema,
  CoachStatsSchema,
} from '../types';

describe('AI Coach Types', () => {
  describe('Enum Schemas', () => {
    it('should validate coach personalities', () => {
      expect(CoachPersonalitySchema.parse('empathetic')).toBe('empathetic');
      expect(CoachPersonalitySchema.parse('motivational')).toBe('motivational');
      expect(CoachPersonalitySchema.parse('zen')).toBe('zen');
      expect(() => CoachPersonalitySchema.parse('invalid')).toThrow();
    });

    it('should validate message roles', () => {
      expect(MessageRoleSchema.parse('user')).toBe('user');
      expect(MessageRoleSchema.parse('assistant')).toBe('assistant');
      expect(MessageRoleSchema.parse('system')).toBe('system');
      expect(() => MessageRoleSchema.parse('invalid')).toThrow();
    });

    it('should validate technique types', () => {
      expect(TechniqueTypeSchema.parse('breathing')).toBe('breathing');
      expect(TechniqueTypeSchema.parse('meditation')).toBe('meditation');
      expect(TechniqueTypeSchema.parse('grounding')).toBe('grounding');
      expect(() => TechniqueTypeSchema.parse('invalid')).toThrow();
    });
  });

  describe('Entity Schemas', () => {
    it('should validate CoachMessage', () => {
      const validMessage = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        session_id: '123e4567-e89b-12d3-a456-426614174001',
        role: 'user',
        content: 'I feel anxious today',
        timestamp: '2025-01-20T10:00:00Z',
        metadata: { sentiment: 'negative' },
      };

      const result = CoachMessageSchema.parse(validMessage);
      expect(result.role).toBe('user');
      expect(result.content).toBe('I feel anxious today');
    });

    it('should validate EmotionDetected', () => {
      const validEmotion = {
        emotion: 'anxiety',
        confidence: 0.85,
        timestamp: '2025-01-20T10:00:00Z',
      };

      const result = EmotionDetectedSchema.parse(validEmotion);
      expect(result.confidence).toBe(0.85);
    });

    it('should reject invalid emotion confidence', () => {
      const invalidEmotion = {
        emotion: 'joy',
        confidence: 1.5, // Invalid: max is 1
        timestamp: '2025-01-20T10:00:00Z',
      };

      expect(() => EmotionDetectedSchema.parse(invalidEmotion)).toThrow();
    });

    it('should validate ResourceProvided', () => {
      const validResource = {
        title: 'Breathing Exercise',
        type: 'exercise',
        url: 'https://example.com/breathing',
        description: 'A simple breathing technique',
      };

      const result = ResourceProvidedSchema.parse(validResource);
      expect(result.type).toBe('exercise');
    });

    it('should validate CoachSession', () => {
      const validSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        coach_personality: 'empathetic',
        session_duration: 600,
        messages_count: 10,
        emotions_detected: [
          {
            emotion: 'calm',
            confidence: 0.9,
            timestamp: '2025-01-20T10:00:00Z',
          },
        ],
        techniques_suggested: ['breathing', 'meditation'],
        resources_provided: [],
        user_satisfaction: 4,
        session_notes: 'Great session',
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-20T10:10:00Z',
      };

      const result = CoachSessionSchema.parse(validSession);
      expect(result.coach_personality).toBe('empathetic');
      expect(result.user_satisfaction).toBe(4);
    });
  });

  describe('Create/Update Schemas', () => {
    it('should validate CreateCoachSession with default personality', () => {
      const result = CreateCoachSessionSchema.parse({});
      expect(result.coach_personality).toBe('empathetic');
    });

    it('should validate UpdateCoachSession with partial data', () => {
      const validPayload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        messages_count: 5,
        user_satisfaction: 5,
      };

      const result = UpdateCoachSessionSchema.parse(validPayload);
      expect(result.user_satisfaction).toBe(5);
    });

    it('should validate AddCoachMessage', () => {
      const validPayload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'assistant',
        content: 'How are you feeling today?',
      };

      const result = AddCoachMessageSchema.parse(validPayload);
      expect(result.role).toBe('assistant');
    });

    it('should reject messages that are too long', () => {
      const invalidPayload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'user',
        content: 'a'.repeat(5001), // Too long
      };

      expect(() => AddCoachMessageSchema.parse(invalidPayload)).toThrow();
    });

    it('should validate CompleteCoachSession', () => {
      const validPayload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        user_satisfaction: 4,
        session_notes: 'Very helpful',
      };

      const result = CompleteCoachSessionSchema.parse(validPayload);
      expect(result.user_satisfaction).toBe(4);
    });

    it('should reject invalid satisfaction values', () => {
      const invalidPayload = {
        session_id: '123e4567-e89b-12d3-a456-426614174000',
        user_satisfaction: 6, // Invalid: max is 5
      };

      expect(() => CompleteCoachSessionSchema.parse(invalidPayload)).toThrow();
    });
  });

  describe('Stats Schema', () => {
    it('should validate CoachStats', () => {
      const validStats = {
        total_sessions: 15,
        completed_sessions: 12,
        total_duration_seconds: 7200,
        average_duration_seconds: 600.0,
        total_messages: 150,
        average_messages_per_session: 10.0,
        average_satisfaction: 4.2,
        favorite_personality: 'motivational',
        most_detected_emotions: ['anxiety', 'calm', 'joy'],
        most_suggested_techniques: ['breathing', 'meditation', 'grounding'],
      };

      const result = CoachStatsSchema.parse(validStats);
      expect(result.average_satisfaction).toBe(4.2);
      expect(result.favorite_personality).toBe('motivational');
    });

    it('should validate CoachStats with null values', () => {
      const validStats = {
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

      const result = CoachStatsSchema.parse(validStats);
      expect(result.average_satisfaction).toBeNull();
      expect(result.favorite_personality).toBeNull();
    });
  });
});
