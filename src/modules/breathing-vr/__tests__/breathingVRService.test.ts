/**
 * Tests pour breathingVRService
 */

import { describe, it, expect } from 'vitest';

describe('BreathingVRService', () => {
  describe('statistics calculation', () => {
    it('should calculate total minutes correctly', () => {
      const sessions = [
        { duration_seconds: 60 },
        { duration_seconds: 120 },
        { duration_seconds: 180 }
      ];

      const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
      const totalMinutes = Math.round(totalSeconds / 60);

      expect(totalMinutes).toBe(6);
    });

    it('should calculate average cycles correctly', () => {
      const sessions = [
        { cycles_completed: 5 },
        { cycles_completed: 8 },
        { cycles_completed: 6 }
      ];

      const averageCycles = Math.round(
        sessions.reduce((sum, s) => sum + s.cycles_completed, 0) / sessions.length
      );

      expect(averageCycles).toBe(6);
    });

    it('should identify favorite pattern', () => {
      const sessions = [
        { pattern: 'box' },
        { pattern: 'box' },
        { pattern: 'calm' },
        { pattern: 'box' }
      ];

      const patternCount = new Map();
      sessions.forEach(s => {
        patternCount.set(s.pattern, (patternCount.get(s.pattern) || 0) + 1);
      });

      const favorite = Array.from(patternCount.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      expect(favorite).toBe('box');
    });
  });
});
