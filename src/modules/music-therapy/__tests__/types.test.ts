/**
 * Tests pour les types du module Music Therapy
 * Validation des structures de données
 */

import { describe, it, expect } from 'vitest';
import type {
  ListeningPatterns,
  HistorySummary,
  MusicRecommendation,
  MusicTherapyStats
} from '../types';

describe('Music Therapy Types', () => {
  describe('ListeningPatterns', () => {
    it('structure valide pour les patterns d\'écoute', () => {
      const pattern: ListeningPatterns = {
        preferredDurations: [5, 10, 15],
        moodResponses: { happy: 0.8, calm: 0.9 },
        therapeuticEffectiveness: { relaxation: 0.85 },
        timePreferences: { morning: 0.7, evening: 0.9 }
      };

      expect(pattern.preferredDurations).toHaveLength(3);
      expect(pattern.moodResponses.happy).toBe(0.8);
    });

    it('gère les patterns vides', () => {
      const pattern: ListeningPatterns = {
        preferredDurations: [],
        moodResponses: {},
        therapeuticEffectiveness: {},
        timePreferences: {}
      };

      expect(pattern.preferredDurations).toHaveLength(0);
    });
  });

  describe('HistorySummary', () => {
    it('structure valide pour le résumé historique', () => {
      const summary: HistorySummary = {
        totalSessions: 42,
        avgImprovement: 0.23,
        totalListeningTime: 3600,
        adaptationRate: 0.85
      };

      expect(summary.totalSessions).toBe(42);
      expect(summary.adaptationRate).toBeLessThanOrEqual(1);
    });

    it('gère les valeurs à zéro', () => {
      const summary: HistorySummary = {
        totalSessions: 0,
        avgImprovement: 0,
        totalListeningTime: 0,
        adaptationRate: 0
      };

      expect(summary.totalSessions).toBe(0);
    });
  });

  describe('MusicRecommendation', () => {
    it('structure valide pour une recommandation', () => {
      const rec: MusicRecommendation = {
        trackId: 'track-123',
        trackName: 'Calm Waters',
        artist: 'Therapy Sounds',
        genre: 'ambient',
        therapeuticValue: 0.92,
        reason: 'Recommandé pour réduire le stress'
      };

      expect(rec.trackId).toBe('track-123');
      expect(rec.therapeuticValue).toBeGreaterThan(0.9);
    });
  });

  describe('MusicTherapyStats', () => {
    it('structure valide pour les statistiques', () => {
      const stats: MusicTherapyStats = {
        totalSessions: 100,
        totalListeningTime: 7200,
        averageMoodImprovement: 0.35,
        favoriteGenres: ['ambient', 'classical', 'nature'],
        effectivenessByTime: { morning: 0.8, afternoon: 0.7, evening: 0.9 }
      };

      expect(stats.favoriteGenres).toContain('ambient');
      expect(stats.totalSessions).toBe(100);
    });

    it('gère les genres favoris vides', () => {
      const stats: MusicTherapyStats = {
        totalSessions: 0,
        totalListeningTime: 0,
        averageMoodImprovement: 0,
        favoriteGenres: [],
        effectivenessByTime: {}
      };

      expect(stats.favoriteGenres).toHaveLength(0);
    });
  });
});

describe('Music Therapy - Validation métier', () => {
  it('therapeuticValue doit être entre 0 et 1', () => {
    const rec: MusicRecommendation = {
      trackId: 'track-456',
      trackName: 'Test',
      artist: 'Test',
      genre: 'test',
      therapeuticValue: 0.5,
      reason: 'Test'
    };

    expect(rec.therapeuticValue).toBeGreaterThanOrEqual(0);
    expect(rec.therapeuticValue).toBeLessThanOrEqual(1);
  });

  it('totalListeningTime est en secondes', () => {
    const summary: HistorySummary = {
      totalSessions: 10,
      avgImprovement: 0.2,
      totalListeningTime: 3600, // 1 heure
      adaptationRate: 0.8
    };

    // Vérification: 3600 secondes = 1 heure
    expect(summary.totalListeningTime / 60).toBe(60);
  });
});
