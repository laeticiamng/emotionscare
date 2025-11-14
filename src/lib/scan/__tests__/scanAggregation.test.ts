// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateEmotionStatistics,
  calculateEmotionTrends,
  generateDailySummaries,
  calculateAverageEmotionVector,
  detectEmotionPatterns,
  calculateWellbeingScore,
} from '../scanAggregation';
import { EmotionResult } from '@/types/emotion';

describe('scanAggregation', () => {
  const createMockResult = (
    emotion: string,
    confidence: number,
    valence: number,
    arousal: number,
    timestamp: Date
  ): EmotionResult => ({
    emotion,
    confidence,
    valence,
    arousal,
    timestamp,
  });

  describe('calculateEmotionStatistics', () => {
    it('should calculate statistics correctly', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T10:00:00')),
        createMockResult('happy', 80, 0.7, 0.5, new Date('2024-01-01T11:00:00')),
        createMockResult('calm', 90, 0.5, 0.3, new Date('2024-01-01T12:00:00')),
        createMockResult('sad', 75, -0.6, 0.4, new Date('2024-01-01T13:00:00')),
      ];

      const stats = calculateEmotionStatistics(results);

      expect(stats.totalScans).toBe(4);
      expect(stats.averageConfidence).toBeCloseTo(82.5);
      expect(stats.dominantEmotion).toBe('happy');
      expect(stats.emotionDistribution).toHaveProperty('happy', 2);
      expect(stats.emotionDistribution).toHaveProperty('calm', 1);
      expect(stats.emotionDistribution).toHaveProperty('sad', 1);
      expect(stats.averageValence).toBeCloseTo(0.35);
    });

    it('should throw error for empty results', () => {
      expect(() => calculateEmotionStatistics([])).toThrow('Aucun résultat à analyser');
    });

    it('should filter by date range', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T10:00:00')),
        createMockResult('calm', 90, 0.5, 0.3, new Date('2024-01-15T12:00:00')),
        createMockResult('sad', 75, -0.6, 0.4, new Date('2024-01-20T13:00:00')),
      ];

      const stats = calculateEmotionStatistics(
        results,
        new Date('2024-01-10'),
        new Date('2024-01-16')
      );

      expect(stats.totalScans).toBe(1);
      expect(stats.dominantEmotion).toBe('calm');
    });
  });

  describe('calculateEmotionTrends', () => {
    it('should detect increasing trend', () => {
      const results: EmotionResult[] = [
        createMockResult('sad', 80, -0.5, 0.4, new Date('2024-01-01T10:00:00')),
        createMockResult('sad', 75, -0.6, 0.4, new Date('2024-01-01T11:00:00')),
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T12:00:00')),
        createMockResult('happy', 90, 0.9, 0.7, new Date('2024-01-01T13:00:00')),
        createMockResult('happy', 88, 0.85, 0.65, new Date('2024-01-01T14:00:00')),
      ];

      const trends = calculateEmotionTrends(results);
      const happyTrend = trends.find(t => t.emotion === 'happy');

      expect(happyTrend).toBeDefined();
      expect(happyTrend?.trend).toBe('increasing');
    });

    it('should detect decreasing trend', () => {
      const results: EmotionResult[] = [
        createMockResult('anxious', 85, -0.6, 0.8, new Date('2024-01-01T10:00:00')),
        createMockResult('anxious', 80, -0.7, 0.9, new Date('2024-01-01T11:00:00')),
        createMockResult('anxious', 78, -0.75, 0.85, new Date('2024-01-01T12:00:00')),
        createMockResult('calm', 90, 0.5, 0.3, new Date('2024-01-01T13:00:00')),
        createMockResult('calm', 88, 0.6, 0.2, new Date('2024-01-01T14:00:00')),
      ];

      const trends = calculateEmotionTrends(results);
      const anxiousTrend = trends.find(t => t.emotion === 'anxious');

      expect(anxiousTrend).toBeDefined();
      expect(anxiousTrend?.trend).toBe('decreasing');
    });

    it('should return empty array for insufficient data', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T10:00:00')),
      ];

      const trends = calculateEmotionTrends(results);
      expect(trends).toHaveLength(0);
    });
  });

  describe('generateDailySummaries', () => {
    it('should generate daily summaries correctly', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T10:00:00')),
        createMockResult('happy', 80, 0.7, 0.5, new Date('2024-01-01T15:00:00')),
        createMockResult('calm', 90, 0.5, 0.3, new Date('2024-01-02T10:00:00')),
        createMockResult('sad', 75, -0.6, 0.4, new Date('2024-01-02T15:00:00')),
      ];

      const summaries = generateDailySummaries(results);

      expect(summaries).toHaveLength(2);
      expect(summaries[0].date).toBe('2024-01-01');
      expect(summaries[0].scansCount).toBe(2);
      expect(summaries[0].dominantEmotion).toBe('happy');
      expect(summaries[1].date).toBe('2024-01-02');
      expect(summaries[1].scansCount).toBe(2);
    });
  });

  describe('calculateAverageEmotionVector', () => {
    it('should calculate average VAD correctly', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date()),
        createMockResult('calm', 90, 0.4, 0.2, new Date()),
      ];

      const avgVector = calculateAverageEmotionVector(results);

      expect(avgVector.valence).toBeCloseTo(0.6);
      expect(avgVector.arousal).toBeCloseTo(0.4);
    });

    it('should return default values for empty results', () => {
      const avgVector = calculateAverageEmotionVector([]);

      expect(avgVector.valence).toBe(0);
      expect(avgVector.arousal).toBe(0);
      expect(avgVector.dominance).toBe(0);
    });
  });

  describe('detectEmotionPatterns', () => {
    it('should detect time-of-day patterns', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date('2024-01-01T08:00:00')),
        createMockResult('happy', 80, 0.7, 0.5, new Date('2024-01-02T09:00:00')),
        createMockResult('calm', 90, 0.5, 0.3, new Date('2024-01-01T14:00:00')),
        createMockResult('calm', 88, 0.4, 0.2, new Date('2024-01-02T15:00:00')),
        createMockResult('tired', 75, -0.2, 0.1, new Date('2024-01-01T20:00:00')),
        createMockResult('tired', 70, -0.3, 0.15, new Date('2024-01-02T21:00:00')),
      ];

      const patterns = detectEmotionPatterns(results);

      expect(patterns.morningMood).toBe('happy');
      expect(patterns.afternoonMood).toBe('calm');
      expect(patterns.eveningMood).toBe('tired');
    });

    it('should return empty object for insufficient data', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.8, 0.6, new Date()),
      ];

      const patterns = detectEmotionPatterns(results);
      expect(Object.keys(patterns)).toHaveLength(0);
    });
  });

  describe('calculateWellbeingScore', () => {
    it('should return high score for positive emotions', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 90, 0.8, 0.6, new Date()),
        createMockResult('happy', 85, 0.9, 0.7, new Date()),
        createMockResult('calm', 88, 0.7, 0.3, new Date()),
        createMockResult('content', 92, 0.75, 0.4, new Date()),
      ];

      const score = calculateWellbeingScore(results);

      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return low score for negative emotions', () => {
      const results: EmotionResult[] = [
        createMockResult('sad', 80, -0.7, 0.3, new Date()),
        createMockResult('anxious', 75, -0.6, 0.8, new Date()),
        createMockResult('stressed', 78, -0.8, 0.9, new Date()),
      ];

      const score = calculateWellbeingScore(results);

      expect(score).toBeLessThan(50);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return neutral score for mixed emotions', () => {
      const results: EmotionResult[] = [
        createMockResult('happy', 85, 0.7, 0.6, new Date()),
        createMockResult('sad', 80, -0.6, 0.4, new Date()),
        createMockResult('neutral', 75, 0, 0.5, new Date()),
      ];

      const score = calculateWellbeingScore(results);

      expect(score).toBeGreaterThan(40);
      expect(score).toBeLessThan(70);
    });

    it('should return neutral score for empty results', () => {
      const score = calculateWellbeingScore([]);
      expect(score).toBe(50);
    });
  });
});
