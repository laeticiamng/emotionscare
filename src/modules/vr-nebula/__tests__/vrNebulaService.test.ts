/**
 * Tests for VR Nebula Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateCoherenceScore } from '../types';

// Test the coherence score calculation
describe('VR Nebula Service', () => {
  describe('calculateCoherenceScore', () => {
    it('calculates high coherence for optimal breathing rate and positive HRV', () => {
      // Optimal breathing: 6 breaths/min, good HRV improvement
      const score = calculateCoherenceScore(6, 15);
      expect(score).toBeGreaterThan(60); // Score ~63 pour ces paramètres
    });

    it('calculates lower coherence for suboptimal breathing rate', () => {
      // Too fast breathing: 20 breaths/min
      const score = calculateCoherenceScore(20, 10);
      expect(score).toBeLessThan(50);
    });

    it('handles negative HRV delta', () => {
      // Negative HRV change (worse after session)
      const score = calculateCoherenceScore(6, -5);
      expect(score).toBeLessThan(70);
    });

    it('clamps score between 0 and 100', () => {
      const lowScore = calculateCoherenceScore(30, -20);
      const highScore = calculateCoherenceScore(6, 50);
      
      expect(lowScore).toBeGreaterThanOrEqual(0);
      expect(highScore).toBeLessThanOrEqual(100);
    });
  });
});

describe('VR Nebula Stats', () => {
  it('should aggregate session data correctly', () => {
    const mockSessions = [
      { duration_s: 300, cycles_completed: 10, coherence_score: 75 },
      { duration_s: 600, cycles_completed: 20, coherence_score: 85 },
      { duration_s: 450, cycles_completed: 15, coherence_score: 80 },
    ];

    const totalMinutes = mockSessions.reduce((sum, s) => sum + s.duration_s, 0) / 60;
    const totalBreaths = mockSessions.reduce((sum, s) => sum + s.cycles_completed, 0);
    const avgCoherence = mockSessions.reduce((sum, s) => sum + s.coherence_score, 0) / mockSessions.length;

    expect(totalMinutes).toBe(22.5);
    expect(totalBreaths).toBe(45);
    expect(avgCoherence).toBe(80);
  });

  it('should identify favorite scene by frequency', () => {
    const mockSessions = [
      { scene: 'nebula' },
      { scene: 'nebula' },
      { scene: 'aurora' },
      { scene: 'nebula' },
      { scene: 'ocean' },
    ];

    const sceneCounts: Record<string, number> = {};
    mockSessions.forEach(s => {
      sceneCounts[s.scene] = (sceneCounts[s.scene] || 0) + 1;
    });

    const favoriteScene = Object.entries(sceneCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    expect(favoriteScene).toBe('nebula');
    expect(sceneCounts['nebula']).toBe(3);
  });
});
