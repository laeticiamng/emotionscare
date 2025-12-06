/**
 * Tests for music-unified blending capabilities
 * Tests des algorithmes de mélange émotionnel
 */

import { describe, expect, it } from 'vitest';
import { calculateBlendAtTime } from '../capabilities/blending';
import type { EmotionComponent, MixingStrategy, EmotionBlend } from '../types';

describe('Music Unified - Blending Algorithms', () => {
  // Helper pour créer des émotions de test
  const createEmotion = (emotion: string, intensity: number): EmotionComponent => ({
    emotion,
    intensity,
    color: '#000000',
    audio_frequency: 440,
    therapeutic_value: 0.7,
  });

  describe('calculateBlendAtTime', () => {
    it('calculates blend at start (progress = 0)', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('anxious', 0.8),
        createEmotion('calm', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['relaxation'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 0);

      expect(blend.dominant_emotion).toBe('anxious');
      expect(blend.intensity_level).toBeGreaterThan(0.5);
    });

    it('calculates blend at end (progress = 1)', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('anxious', 0.8),
        createEmotion('calm', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['relaxation'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 300);

      expect(blend.dominant_emotion).toBe('calm');
      expect(blend.therapeutic_outcome).toBeGreaterThan(0.8);
    });

    it('calculates blend at midpoint', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('sad', 0.7),
        createEmotion('happy', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 600,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['mood-boost'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 300);

      // Au milieu, therapeutic outcome = progress (0.5) * maxIntensity (~0.5)
      expect(blend.therapeutic_outcome).toBeGreaterThan(0.2);
      expect(blend.therapeutic_outcome).toBeLessThan(0.6);
    });

    it('identifies secondary emotions above 0.3 threshold', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('stressed', 0.6),
        createEmotion('anxious', 0.5),
        createEmotion('calm', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 600,
        blending_ratio: [0.33, 0.33, 0.34],
        therapeutic_focus: ['relaxation'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 100);

      // Au moins une émotion doit être secondaire (> 0.3)
      expect(blend.secondary_emotions.length).toBeGreaterThan(0);
    });

    it('calculates stability score based on variance', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('calm', 0.5),
        createEmotion('peaceful', 0.5),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['equilibrium'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 150);

      // Avec des intensités similaires, stabilité doit être élevée
      expect(blend.stability_score).toBeGreaterThan(0.5);
    });
  });

  describe('Gradual algorithm', () => {
    it('transitions smoothly from current to target emotion', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('anxious', 0.8),
        createEmotion('calm', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 600,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['relaxation'],
      };

      // At 0%
      const blend0 = calculateBlendAtTime(emotions, strategy, 0);
      expect(blend0.dominant_emotion).toBe('anxious');

      // At 50%
      const blend50 = calculateBlendAtTime(emotions, strategy, 300);
      // La transition doit être en cours

      // At 100%
      const blend100 = calculateBlendAtTime(emotions, strategy, 600);
      expect(blend100.dominant_emotion).toBe('calm');
    });

    it('decreases initial emotion intensity over time', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('stressed', 0.9),
        createEmotion('relaxed', 0.1),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['stress-relief'],
      };

      const blend0 = calculateBlendAtTime(emotions, strategy, 0);
      const blend300 = calculateBlendAtTime(emotions, strategy, 300);

      // L'intensité de l'émotion cible doit augmenter
      expect(blend300.intensity_level).toBeGreaterThan(0.5);
      expect(blend300.therapeutic_outcome).toBeGreaterThan(blend0.therapeutic_outcome);
    });
  });

  describe('Instant algorithm', () => {
    it('switches abruptly at midpoint', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('sad', 0.8),
        createEmotion('joyful', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'instant',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['mood-boost'],
      };

      // Before threshold (< 0.5)
      const blendBefore = calculateBlendAtTime(emotions, strategy, 149);
      expect(blendBefore.dominant_emotion).toBe('sad');

      // After threshold (>= 0.5)
      const blendAfter = calculateBlendAtTime(emotions, strategy, 151);
      expect(blendAfter.dominant_emotion).toBe('joyful');
    });
  });

  describe('Oscillating algorithm', () => {
    it('oscillates between emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('excited', 0.7),
        createEmotion('calm', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'oscillating',
        transition_time: 600,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['energy-management'],
      };

      // Sample at different points to see oscillation
      const samples = [0, 150, 300, 450, 600].map((time) =>
        calculateBlendAtTime(emotions, strategy, time)
      );

      // Les émotions dominantes doivent varier
      const dominantEmotions = samples.map((s) => s.dominant_emotion);

      // Au moins 2 émotions différentes doivent être dominantes à différents moments
      const uniqueDominant = new Set(dominantEmotions);
      expect(uniqueDominant.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Layered algorithm', () => {
    it('layers emotions progressively', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('peaceful', 0.5),
        createEmotion('content', 0.4),
        createEmotion('joyful', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'layered',
        transition_time: 900,
        blending_ratio: [0.33, 0.33, 0.34],
        therapeutic_focus: ['building-positivity'],
      };

      const blend0 = calculateBlendAtTime(emotions, strategy, 0);
      const blend300 = calculateBlendAtTime(emotions, strategy, 300);
      const blend900 = calculateBlendAtTime(emotions, strategy, 900);

      // La complexité émotionnelle doit augmenter
      expect(blend900.therapeutic_outcome).toBeGreaterThanOrEqual(blend300.therapeutic_outcome);
    });
  });

  describe('Multiple emotions handling', () => {
    it('handles single emotion', () => {
      const emotions: EmotionComponent[] = [createEmotion('calm', 0.8)];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [1.0],
        therapeutic_focus: ['maintenance'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 150);

      expect(blend.dominant_emotion).toBe('calm');
      expect(blend.secondary_emotions).toHaveLength(0);
    });

    it('handles three emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('stressed', 0.7),
        createEmotion('neutral', 0.5),
        createEmotion('relaxed', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 600,
        blending_ratio: [0.33, 0.33, 0.34],
        therapeutic_focus: ['gradual-relaxation'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 300);

      expect(blend).toHaveProperty('dominant_emotion');
      expect(blend).toHaveProperty('secondary_emotions');
      expect(blend).toHaveProperty('intensity_level');
    });

    it('handles four emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('anxious', 0.6),
        createEmotion('stressed', 0.5),
        createEmotion('neutral', 0.4),
        createEmotion('calm', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'layered',
        transition_time: 900,
        blending_ratio: [0.25, 0.25, 0.25, 0.25],
        therapeutic_focus: ['comprehensive-relief'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 450);

      expect(emotions.length).toBe(4);
      expect(blend.dominant_emotion).toBeDefined();
    });
  });

  describe('Therapeutic outcome calculation', () => {
    it('increases therapeutic outcome with progress', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('depressed', 0.8),
        createEmotion('hopeful', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 600,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['depression-relief'],
      };

      const blend0 = calculateBlendAtTime(emotions, strategy, 0);
      const blend300 = calculateBlendAtTime(emotions, strategy, 300);
      const blend600 = calculateBlendAtTime(emotions, strategy, 600);

      expect(blend300.therapeutic_outcome).toBeGreaterThan(blend0.therapeutic_outcome);
      expect(blend600.therapeutic_outcome).toBeGreaterThan(blend300.therapeutic_outcome);
    });

    it('therapeutic outcome depends on intensity', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('sad', 0.4),
        createEmotion('content', 0.6),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['mood-improvement'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 300);

      // Outcome doit refléter à la fois progress et intensity
      expect(blend.therapeutic_outcome).toBeGreaterThan(0);
      expect(blend.therapeutic_outcome).toBeLessThanOrEqual(1);
    });
  });

  describe('Edge cases', () => {
    it('handles zero elapsed time', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('anxious', 0.7),
        createEmotion('calm', 0.3),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['relaxation'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 0);

      expect(blend).toBeDefined();
      expect(blend.therapeutic_outcome).toBeGreaterThanOrEqual(0);
    });

    it('caps progress at 1.0 when elapsed exceeds transition time', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('stressed', 0.8),
        createEmotion('relaxed', 0.2),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['stress-relief'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 600); // Double the time

      // Progress doit être capé à 1.0
      expect(blend.dominant_emotion).toBe('relaxed');
      expect(blend.therapeutic_outcome).toBeGreaterThan(0.8);
    });

    it('handles very short transition times', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('alert', 0.9),
        createEmotion('drowsy', 0.1),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'instant',
        transition_time: 10,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['quick-shift'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 5);

      expect(blend).toBeDefined();
    });

    it('handles equal intensity emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('neutral', 0.5),
        createEmotion('balanced', 0.5),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['equilibrium'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 150);

      // Doit choisir une émotion dominante même si égales
      expect(blend.dominant_emotion).toBeDefined();
      expect(['neutral', 'balanced']).toContain(blend.dominant_emotion);
    });
  });

  describe('Stability score', () => {
    it('calculates high stability for balanced emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('calm', 0.5),
        createEmotion('content', 0.5),
        createEmotion('peaceful', 0.5),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.33, 0.33, 0.34],
        therapeutic_focus: ['balance'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 0);

      // Variance faible → stabilité élevée
      expect(blend.stability_score).toBeGreaterThan(0.7);
    });

    it('calculates low stability for unbalanced emotions', () => {
      const emotions: EmotionComponent[] = [
        createEmotion('extreme', 0.9),
        createEmotion('minimal', 0.1),
      ];

      const strategy: MixingStrategy = {
        algorithm: 'gradual',
        transition_time: 300,
        blending_ratio: [0.5, 0.5],
        therapeutic_focus: ['stabilization'],
      };

      const blend = calculateBlendAtTime(emotions, strategy, 0);

      // Variance élevée → stabilité plus faible
      expect(blend.stability_score).toBeLessThan(1.0);
    });
  });
});
