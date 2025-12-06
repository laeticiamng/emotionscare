/**
 * Tests pour les types weekly-bars
 */

import { describe, it, expect } from 'vitest';
import type { MetricType, WeeklyDataPoint, WeeklyMetric } from '../types';

describe('WeeklyBars Types', () => {
  it('should validate MetricType', () => {
    const validTypes: MetricType[] = ['mood', 'stress', 'energy', 'sleep', 'activity'];
    expect(validTypes).toHaveLength(5);
  });

  it('should create valid WeeklyDataPoint', () => {
    const point: WeeklyDataPoint = {
      date: '2025-01-01',
      value: 75,
      label: '01 jan'
    };
    
    expect(point.date).toBe('2025-01-01');
    expect(point.value).toBe(75);
    expect(point.label).toBe('01 jan');
  });

  it('should create valid WeeklyMetric', () => {
    const metric: WeeklyMetric = {
      type: 'mood',
      data: [{ date: '2025-01-01', value: 75 }],
      average: 75,
      trend: 'up',
      color: 'hsl(var(--chart-1))'
    };
    
    expect(metric.type).toBe('mood');
    expect(metric.average).toBe(75);
    expect(metric.trend).toBe('up');
  });
});
