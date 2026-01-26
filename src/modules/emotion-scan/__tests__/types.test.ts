/**
 * Tests pour les types du module Emotion Scan
 * Validation des schémas Zod et sécurité des données
 */

import { describe, it, expect } from 'vitest';
import {
  ScanMode,
  ScanSource,
  EmotionType,
  EmotionScore,
  EmotionVector,
  EmotionResult,
  EmotionAnalysisResult,
  FacialAnalysisResult,
  BiometricData,
  EmotionScanSession,
  EmotionScanDB,
  EmotionAnalysisConfig
} from '../types';

describe('Emotion Scan Types - Validation', () => {
  describe('ScanMode', () => {
    it('valide les modes de scan autorisés', () => {
      expect(ScanMode.parse('text')).toBe('text');
      expect(ScanMode.parse('voice')).toBe('voice');
      expect(ScanMode.parse('image')).toBe('image');
      expect(ScanMode.parse('facial')).toBe('facial');
      expect(ScanMode.parse('realtime')).toBe('realtime');
    });

    it('rejette les modes invalides', () => {
      expect(() => ScanMode.parse('invalid')).toThrow();
      expect(() => ScanMode.parse('')).toThrow();
      expect(() => ScanMode.parse(null)).toThrow();
    });
  });

  describe('EmotionType', () => {
    it('valide les émotions principales', () => {
      expect(EmotionType.parse('happy')).toBe('happy');
      expect(EmotionType.parse('sad')).toBe('sad');
      expect(EmotionType.parse('neutral')).toBe('neutral');
      expect(EmotionType.parse('anxious')).toBe('anxious');
    });

    it('valide les émotions étendues', () => {
      expect(EmotionType.parse('curious')).toBe('curious');
      expect(EmotionType.parse('reflective')).toBe('reflective');
      expect(EmotionType.parse('empathetic')).toBe('empathetic');
    });

    it('rejette les émotions non définies', () => {
      expect(() => EmotionType.parse('love')).toThrow(); // Not in enum
      expect(() => EmotionType.parse('rage')).toThrow();
    });
  });

  describe('EmotionScore', () => {
    it('valide un score valide', () => {
      const result = EmotionScore.parse({
        emotion: 'happy',
        score: 0.85,
        confidence: 0.92
      });
      expect(result.emotion).toBe('happy');
      expect(result.score).toBe(0.85);
      expect(result.confidence).toBe(0.92);
    });

    it('valide un score sans confidence (optionnel)', () => {
      const result = EmotionScore.parse({
        emotion: 'sad',
        score: 0.5
      });
      expect(result.confidence).toBeUndefined();
    });

    it('rejette un score hors limites (0-1)', () => {
      expect(() => EmotionScore.parse({
        emotion: 'happy',
        score: 1.5
      })).toThrow();

      expect(() => EmotionScore.parse({
        emotion: 'happy',
        score: -0.1
      })).toThrow();
    });
  });

  describe('EmotionVector', () => {
    it('valide un vecteur émotionnel complet', () => {
      const result = EmotionVector.parse({
        valence: 50,
        arousal: 75,
        dominance: 60
      });
      expect(result.valence).toBe(50);
      expect(result.arousal).toBe(75);
      expect(result.dominance).toBe(60);
    });

    it('valide valence négative (émotion négative)', () => {
      const result = EmotionVector.parse({
        valence: -50,
        arousal: 80
      });
      expect(result.valence).toBe(-50);
    });

    it('rejette valence hors limites (-100 à 100)', () => {
      expect(() => EmotionVector.parse({
        valence: 150,
        arousal: 50
      })).toThrow();
    });
  });

  describe('EmotionResult', () => {
    it('valide un résultat d\'analyse complet', () => {
      const result = EmotionResult.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        emotion: 'happy',
        valence: 80,
        arousal: 60,
        confidence: 92,
        source: 'facial',
        timestamp: '2024-01-15T10:30:00.000Z',
        summary: 'Émotion positive détectée',
        emotions: { happy: 0.9, neutral: 0.1 }
      });
      expect(result.emotion).toBe('happy');
      expect(result.source).toBe('facial');
    });

    it('valide un résultat minimal', () => {
      const result = EmotionResult.parse({
        id: '550e8400-e29b-41d4-a716-446655440001',
        emotion: 'neutral',
        valence: 0,
        arousal: 50,
        confidence: 70,
        source: 'text',
        timestamp: '2024-01-15T10:30:00.000Z'
      });
      expect(result.summary).toBeUndefined();
    });

    it('rejette un UUID invalide', () => {
      expect(() => EmotionResult.parse({
        id: 'not-a-uuid',
        emotion: 'happy',
        valence: 50,
        arousal: 50,
        confidence: 80,
        source: 'text',
        timestamp: '2024-01-15T10:30:00.000Z'
      })).toThrow();
    });
  });

  describe('FacialAnalysisResult', () => {
    it('valide une analyse faciale complète', () => {
      const result = FacialAnalysisResult.parse({
        emotion_scores: [
          { emotion: 'happy', score: 0.9, confidence: 0.95 }
        ],
        face_detected: true,
        confidence: 0.92,
        quality_metrics: {
          brightness: 0.8,
          sharpness: 0.9,
          face_size: 0.4
        },
        boundingBox: {
          x: 100,
          y: 50,
          width: 200,
          height: 250
        }
      });
      expect(result.face_detected).toBe(true);
      expect(result.emotion_scores[0].emotion).toBe('happy');
    });

    it('valide une analyse sans visage détecté', () => {
      const result = FacialAnalysisResult.parse({
        emotion_scores: [],
        face_detected: false,
        confidence: 0
      });
      expect(result.face_detected).toBe(false);
      expect(result.emotion_scores).toHaveLength(0);
    });
  });

  describe('BiometricData', () => {
    it('valide des données biométriques complètes', () => {
      const result = BiometricData.parse({
        heart_rate: 72,
        hrv: 45,
        skin_conductance: 3.5,
        temperature: 36.5,
        timestamp: '2024-01-15T10:30:00.000Z'
      });
      expect(result.heart_rate).toBe(72);
    });

    it('valide des données partielles', () => {
      const result = BiometricData.parse({
        heart_rate: 75,
        timestamp: '2024-01-15T10:30:00.000Z'
      });
      expect(result.hrv).toBeUndefined();
    });
  });

  describe('EmotionScanDB', () => {
    it('valide un enregistrement de base de données', () => {
      const result = EmotionScanDB.parse({
        id: '550e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        payload: { type: 'facial', result: {} },
        mood_score: 75,
        created_at: '2024-01-15T10:30:00.000Z'
      });
      expect(result.mood_score).toBe(75);
    });

    it('valide mood_score null', () => {
      const result = EmotionScanDB.parse({
        id: '550e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        payload: {},
        mood_score: null,
        created_at: '2024-01-15T10:30:00.000Z'
      });
      expect(result.mood_score).toBeNull();
    });

    it('rejette mood_score hors limites (0-100)', () => {
      expect(() => EmotionScanDB.parse({
        id: '550e8400-e29b-41d4-a716-446655440006',
        user_id: '550e8400-e29b-41d4-a716-446655440007',
        payload: {},
        mood_score: 150,
        created_at: '2024-01-15T10:30:00.000Z'
      })).toThrow();
    });
  });

  describe('EmotionAnalysisConfig', () => {
    it('valide une configuration avec valeurs par défaut', () => {
      const result = EmotionAnalysisConfig.parse({
        mode: 'facial'
      });
      expect(result.sensitivity).toBe(0.7);
      expect(result.sample_rate_ms).toBe(1000);
      expect(result.enable_biometric).toBe(false);
      expect(result.language).toBe('fr');
    });

    it('valide une configuration personnalisée', () => {
      const result = EmotionAnalysisConfig.parse({
        mode: 'realtime',
        sensitivity: 0.9,
        sample_rate_ms: 500,
        enable_biometric: true,
        enable_facial_landmarks: true,
        min_confidence: 0.8,
        language: 'en'
      });
      expect(result.sensitivity).toBe(0.9);
      expect(result.enable_biometric).toBe(true);
    });
  });
});

describe('Emotion Scan Types - Security', () => {
  it('rejette l\'injection dans les champs texte', () => {
    // Le schéma EmotionType est un enum, donc les injections sont rejetées
    expect(() => EmotionType.parse('<script>alert("xss")</script>')).toThrow();
    expect(() => EmotionType.parse('happy; DROP TABLE users;')).toThrow();
  });

  it('rejette les UUID non valides pour prévenir l\'injection', () => {
    expect(() => EmotionResult.parse({
      id: "'; DROP TABLE emotion_scans; --",
      emotion: 'happy',
      valence: 50,
      arousal: 50,
      confidence: 80,
      source: 'text',
      timestamp: '2024-01-15T10:30:00.000Z'
    })).toThrow();
  });

  it('valide que les scores sont des nombres', () => {
    expect(() => EmotionScore.parse({
      emotion: 'happy',
      score: '0.5' as unknown as number
    })).toThrow();
  });
});
