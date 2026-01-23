/**
 * Boss Grit Module - Types Tests
 * Tests unitaires pour les schemas Zod du module Boss Grit
 */

import { describe, it, expect } from 'vitest';
import {
  BattleMode,
  BattleStatus,
  BounceBattle,
  CopingResponse,
  BounceEventType,
  BounceEventData,
  BounceEvent,
} from '../types';

describe('Boss Grit Module - Zod Schemas', () => {
  describe('BattleMode', () => {
    it('valide les modes corrects', () => {
      expect(() => BattleMode.parse('standard')).not.toThrow();
      expect(() => BattleMode.parse('challenge')).not.toThrow();
      expect(() => BattleMode.parse('timed')).not.toThrow();
    });

    it('rejette les modes invalides', () => {
      expect(() => BattleMode.parse('invalid')).toThrow();
      expect(() => BattleMode.parse('')).toThrow();
      expect(() => BattleMode.parse(null)).toThrow();
    });
  });

  describe('BattleStatus', () => {
    it('valide les statuts corrects', () => {
      expect(() => BattleStatus.parse('created')).not.toThrow();
      expect(() => BattleStatus.parse('in_progress')).not.toThrow();
      expect(() => BattleStatus.parse('completed')).not.toThrow();
      expect(() => BattleStatus.parse('cancelled')).not.toThrow();
    });

    it('rejette les statuts invalides', () => {
      expect(() => BattleStatus.parse('pending')).toThrow();
      expect(() => BattleStatus.parse('active')).toThrow();
    });
  });

  describe('BounceBattle', () => {
    it('valide une battle complète', () => {
      const battle = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        mode: 'standard',
        status: 'in_progress',
        duration_seconds: 300,
        started_at: '2025-01-15T10:00:00Z',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => BounceBattle.parse(battle)).not.toThrow();
    });

    it('valide une battle minimale', () => {
      const battle = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        mode: 'challenge',
        status: 'created',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => BounceBattle.parse(battle)).not.toThrow();
    });

    it('rejette un UUID invalide', () => {
      const battle = {
        id: 'invalid-uuid',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        mode: 'standard',
        status: 'created',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => BounceBattle.parse(battle)).toThrow();
    });

    it('rejette une durée négative', () => {
      const battle = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        mode: 'standard',
        status: 'in_progress',
        duration_seconds: -100,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => BounceBattle.parse(battle)).toThrow();
    });
  });

  describe('CopingResponse', () => {
    it('valide une réponse valide', () => {
      const response = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        question_id: 'q1',
        response_value: 7,
        created_at: '2025-01-15T10:05:00Z',
      };
      expect(() => CopingResponse.parse(response)).not.toThrow();
    });

    it('rejette une valeur hors limites (< 1)', () => {
      const response = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        question_id: 'q1',
        response_value: 0,
        created_at: '2025-01-15T10:05:00Z',
      };
      expect(() => CopingResponse.parse(response)).toThrow();
    });

    it('rejette une valeur hors limites (> 10)', () => {
      const response = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        question_id: 'q1',
        response_value: 11,
        created_at: '2025-01-15T10:05:00Z',
      };
      expect(() => CopingResponse.parse(response)).toThrow();
    });

    it('valide les valeurs limites (1 et 10)', () => {
      const responseMin = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        question_id: 'q1',
        response_value: 1,
        created_at: '2025-01-15T10:05:00Z',
      };
      const responseMax = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        question_id: 'q2',
        response_value: 10,
        created_at: '2025-01-15T10:05:00Z',
      };
      expect(() => CopingResponse.parse(responseMin)).not.toThrow();
      expect(() => CopingResponse.parse(responseMax)).not.toThrow();
    });
  });

  describe('BounceEventType', () => {
    it('valide tous les types d\'événements', () => {
      const eventTypes = [
        'battle_started',
        'question_answered',
        'milestone_reached',
        'battle_paused',
        'battle_resumed',
        'battle_completed',
        'battle_abandoned',
        'power_up_used',
        'achievement_unlocked',
      ];
      eventTypes.forEach((type) => {
        expect(() => BounceEventType.parse(type)).not.toThrow();
      });
    });

    it('rejette les types invalides', () => {
      expect(() => BounceEventType.parse('invalid_event')).toThrow();
    });
  });

  describe('BounceEventData', () => {
    it('valide des données d\'événement complètes', () => {
      const data = {
        action: 'answer',
        value: 8,
        question_id: 'q5',
        milestone_type: 'halfway',
        power_up_type: 'time_extend',
        achievement_id: 'first_battle',
        metadata: { bonus: true },
      };
      expect(() => BounceEventData.parse(data)).not.toThrow();
    });

    it('valide des données vides', () => {
      expect(() => BounceEventData.parse({})).not.toThrow();
    });

    it('valide des données partielles', () => {
      const data = {
        action: 'skip',
        question_id: 'q3',
      };
      expect(() => BounceEventData.parse(data)).not.toThrow();
    });
  });

  describe('BounceEvent', () => {
    it('valide un événement complet', () => {
      const event = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        event_type: 'battle_started',
        timestamp: 1705312800000,
        event_data: {
          action: 'start',
          metadata: { difficulty: 'normal' },
        },
      };
      expect(() => BounceEvent.parse(event)).not.toThrow();
    });

    it('valide un événement minimal', () => {
      const event = {
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        event_type: 'battle_completed',
        timestamp: 1705313100000,
      };
      expect(() => BounceEvent.parse(event)).not.toThrow();
    });

    it('rejette un timestamp négatif', () => {
      const event = {
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        event_type: 'battle_started',
        timestamp: -1,
      };
      expect(() => BounceEvent.parse(event)).toThrow();
    });

    it('rejette un timestamp à zéro', () => {
      const event = {
        battle_id: '550e8400-e29b-41d4-a716-446655440000',
        event_type: 'battle_started',
        timestamp: 0,
      };
      expect(() => BounceEvent.parse(event)).toThrow();
    });
  });
});
