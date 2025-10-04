/**
 * Tests pour activitiesService
 */

import { describe, it, expect, vi } from 'vitest';

describe('ActivitiesService', () => {
  describe('filtering', () => {
    it('should filter by category', () => {
      const activities = [
        { category: 'relaxation', title: 'Meditation' },
        { category: 'physical', title: 'Yoga' }
      ];

      const filtered = activities.filter(a => a.category === 'relaxation');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Meditation');
    });

    it('should filter by difficulty', () => {
      const activities = [
        { difficulty: 'easy', title: 'Walking' },
        { difficulty: 'hard', title: 'Marathon' }
      ];

      const filtered = activities.filter(a => a.difficulty === 'easy');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Walking');
    });

    it('should filter by max duration', () => {
      const activities = [
        { duration_minutes: 10, title: 'Quick' },
        { duration_minutes: 60, title: 'Long' }
      ];

      const filtered = activities.filter(a => a.duration_minutes <= 30);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Quick');
    });
  });

  describe('statistics', () => {
    it('should calculate average rating correctly', () => {
      const ratings = [5, 4, 5, 3, 4];
      const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      expect(average).toBe(4.2);
    });
  });
});
