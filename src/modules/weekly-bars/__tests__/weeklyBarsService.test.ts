/**
 * Tests pour weeklyBarsService
 */

import { describe, it, expect } from 'vitest';
import { WeeklyBarsService } from '../weeklyBarsService';
import type { WeeklyDataPoint } from '../types';

describe('WeeklyBarsService', () => {
  describe('calculateAverage', () => {
    it('should calculate average correctly', () => {
      const data: WeeklyDataPoint[] = [
        { date: '2025-01-01', value: 10 },
        { date: '2025-01-02', value: 20 },
        { date: '2025-01-03', value: 30 }
      ];
      
      expect(WeeklyBarsService.calculateAverage(data)).toBe(20);
    });

    it('should return 0 for empty data', () => {
      expect(WeeklyBarsService.calculateAverage([])).toBe(0);
    });
  });

  describe('calculateTrend', () => {
    it('should detect upward trend', () => {
      const data: WeeklyDataPoint[] = [
        { date: '2025-01-01', value: 10 },
        { date: '2025-01-02', value: 15 },
        { date: '2025-01-03', value: 30 },
        { date: '2025-01-04', value: 35 }
      ];
      
      expect(WeeklyBarsService.calculateTrend(data)).toBe('up');
    });

    it('should detect downward trend', () => {
      const data: WeeklyDataPoint[] = [
        { date: '2025-01-01', value: 30 },
        { date: '2025-01-02', value: 25 },
        { date: '2025-01-03', value: 15 },
        { date: '2025-01-04', value: 10 }
      ];
      
      expect(WeeklyBarsService.calculateTrend(data)).toBe('down');
    });

    it('should detect stable trend', () => {
      const data: WeeklyDataPoint[] = [
        { date: '2025-01-01', value: 20 },
        { date: '2025-01-02', value: 21 },
        { date: '2025-01-03', value: 20 },
        { date: '2025-01-04', value: 19 }
      ];
      
      expect(WeeklyBarsService.calculateTrend(data)).toBe('stable');
    });
  });

  describe('getMetricColor', () => {
    it('should return correct colors for each metric', () => {
      expect(WeeklyBarsService.getMetricColor('mood')).toBe('hsl(var(--chart-1))');
      expect(WeeklyBarsService.getMetricColor('stress')).toBe('hsl(var(--chart-2))');
      expect(WeeklyBarsService.getMetricColor('energy')).toBe('hsl(var(--chart-3))');
      expect(WeeklyBarsService.getMetricColor('sleep')).toBe('hsl(var(--chart-4))');
      expect(WeeklyBarsService.getMetricColor('activity')).toBe('hsl(var(--chart-5))');
    });
  });
});
