/**
 * Tests pour les types du module Emotion Atlas
 */

import { describe, it, expect } from 'vitest';
import {
  EMOTION_COLORS,
  EMOTION_CATEGORIES,
} from '../types';
import type {
  EmotionNode,
  EmotionConnection,
  AtlasData,
  AtlasFilter,
  AtlasInsight,
} from '../types';

describe('Emotion Atlas Types', () => {
  describe('EmotionNode', () => {
    it('should validate complete emotion node', () => {
      const node: EmotionNode = {
        id: 'node-joie',
        emotion: 'joie',
        intensity: 75,
        frequency: 42,
        color: 'hsl(48, 95%, 53%)',
        x: 150,
        y: 200,
        size: 30,
        connections: ['node-amour', 'node-gratitude'],
      };

      expect(node.id).toBeDefined();
      expect(node.intensity).toBeGreaterThanOrEqual(0);
      expect(node.intensity).toBeLessThanOrEqual(100);
      expect(node.connections).toHaveLength(2);
    });

    it('should accept node without connections', () => {
      const isolatedNode: EmotionNode = {
        id: 'node-isolated',
        emotion: 'confusion',
        intensity: 30,
        frequency: 5,
        color: 'hsl(300, 30%, 50%)',
        x: 50,
        y: 100,
        size: 10,
        connections: [],
      };

      expect(isolatedNode.connections).toHaveLength(0);
    });

    it('should handle high-frequency emotions', () => {
      const frequentNode: EmotionNode = {
        id: 'node-calme',
        emotion: 'calme',
        intensity: 60,
        frequency: 200,
        color: 'hsl(200, 60%, 55%)',
        x: 300,
        y: 250,
        size: 50,
        connections: ['node-sérénité', 'node-espoir', 'node-gratitude'],
      };

      expect(frequentNode.frequency).toBeGreaterThan(100);
      expect(frequentNode.size).toBeGreaterThan(30);
    });
  });

  describe('EmotionConnection', () => {
    it('should validate connection structure', () => {
      const connection: EmotionConnection = {
        source: 'node-joie',
        target: 'node-amour',
        strength: 0.85,
      };

      expect(connection.source).toBeDefined();
      expect(connection.target).toBeDefined();
      expect(connection.strength).toBeGreaterThanOrEqual(0);
      expect(connection.strength).toBeLessThanOrEqual(1);
    });

    it('should accept weak connections', () => {
      const weakConnection: EmotionConnection = {
        source: 'node-colère',
        target: 'node-tristesse',
        strength: 0.15,
      };

      expect(weakConnection.strength).toBeLessThan(0.5);
    });

    it('should accept strong connections', () => {
      const strongConnection: EmotionConnection = {
        source: 'node-calme',
        target: 'node-sérénité',
        strength: 0.95,
      };

      expect(strongConnection.strength).toBeGreaterThan(0.9);
    });
  });

  describe('AtlasData', () => {
    it('should validate complete atlas data', () => {
      const atlas: AtlasData = {
        nodes: [
          {
            id: 'node-1',
            emotion: 'joie',
            intensity: 80,
            frequency: 50,
            color: 'hsl(48, 95%, 53%)',
            x: 100,
            y: 100,
            size: 25,
            connections: ['node-2'],
          },
          {
            id: 'node-2',
            emotion: 'calme',
            intensity: 60,
            frequency: 30,
            color: 'hsl(200, 60%, 55%)',
            x: 200,
            y: 150,
            size: 20,
            connections: ['node-1'],
          },
        ],
        connections: [
          { source: 'node-1', target: 'node-2', strength: 0.7 },
        ],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        totalEntries: 150,
        dominantEmotion: 'joie',
      };

      expect(atlas.nodes).toHaveLength(2);
      expect(atlas.connections).toHaveLength(1);
      expect(atlas.totalEntries).toBe(150);
      expect(atlas.dominantEmotion).toBe('joie');
    });

    it('should handle empty atlas', () => {
      const emptyAtlas: AtlasData = {
        nodes: [],
        connections: [],
        timeRange: {
          start: new Date(),
          end: new Date(),
        },
        totalEntries: 0,
        dominantEmotion: '',
      };

      expect(emptyAtlas.nodes).toHaveLength(0);
      expect(emptyAtlas.totalEntries).toBe(0);
    });
  });

  describe('AtlasFilter', () => {
    it('should validate filter structure', () => {
      const filter: AtlasFilter = {
        timeRange: 'month',
        minIntensity: 20,
        sources: ['scan', 'journal'],
        categories: ['positive', 'neutral'],
      };

      expect(filter.timeRange).toBe('month');
      expect(filter.minIntensity).toBe(20);
      expect(filter.sources).toHaveLength(2);
    });

    it('should accept all time range values', () => {
      const ranges: AtlasFilter['timeRange'][] = ['week', 'month', 'quarter', 'year', 'all'];
      expect(ranges).toHaveLength(5);
    });

    it('should accept all source values', () => {
      const sources: AtlasFilter['sources'] = ['scan', 'journal', 'voice', 'text'];
      expect(sources).toHaveLength(4);
    });

    it('should accept all category values', () => {
      const categories: AtlasFilter['categories'] = ['positive', 'neutral', 'negative'];
      expect(categories).toHaveLength(3);
    });

    it('should handle strict filter', () => {
      const strictFilter: AtlasFilter = {
        timeRange: 'week',
        minIntensity: 80,
        sources: ['scan'],
        categories: ['negative'],
      };

      expect(strictFilter.minIntensity).toBeGreaterThan(70);
    });
  });

  describe('AtlasInsight', () => {
    it('should validate insight structure', () => {
      const insight: AtlasInsight = {
        id: 'insight-1',
        type: 'pattern',
        title: 'Pattern détecté',
        description: 'Vous ressentez souvent de la joie le matin',
        emotion: 'joie',
        severity: 'info',
        actionable: false,
      };

      expect(insight.type).toBe('pattern');
      expect(insight.severity).toBe('info');
    });

    it('should accept all insight types', () => {
      const types: AtlasInsight['type'][] = ['pattern', 'trend', 'recommendation'];
      expect(types).toHaveLength(3);
    });

    it('should accept all severity levels', () => {
      const severities: AtlasInsight['severity'][] = ['info', 'success', 'warning'];
      expect(severities).toHaveLength(3);
    });

    it('should handle actionable recommendation', () => {
      const recommendation: AtlasInsight = {
        id: 'insight-rec',
        type: 'recommendation',
        title: 'Essayez la respiration',
        description: 'La respiration guidée peut réduire votre anxiété',
        emotion: 'anxiété',
        severity: 'warning',
        actionable: true,
      };

      expect(recommendation.actionable).toBe(true);
      expect(recommendation.type).toBe('recommendation');
    });

    it('should handle insight without emotion', () => {
      const generalInsight: AtlasInsight = {
        id: 'insight-general',
        type: 'trend',
        title: 'Tendance globale',
        description: 'Votre bien-être s\'améliore cette semaine',
        severity: 'success',
        actionable: false,
      };

      expect(generalInsight.emotion).toBeUndefined();
    });
  });

  describe('EMOTION_COLORS', () => {
    it('should have 18 emotion colors', () => {
      expect(Object.keys(EMOTION_COLORS)).toHaveLength(18);
    });

    it('should have HSL color format', () => {
      Object.values(EMOTION_COLORS).forEach(color => {
        expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      });
    });

    it('should include primary emotions', () => {
      expect(EMOTION_COLORS['joie']).toBeDefined();
      expect(EMOTION_COLORS['tristesse']).toBeDefined();
      expect(EMOTION_COLORS['colère']).toBeDefined();
      expect(EMOTION_COLORS['peur']).toBeDefined();
      expect(EMOTION_COLORS['surprise']).toBeDefined();
      expect(EMOTION_COLORS['dégoût']).toBeDefined();
    });

    it('should include secondary emotions', () => {
      expect(EMOTION_COLORS['calme']).toBeDefined();
      expect(EMOTION_COLORS['anxiété']).toBeDefined();
      expect(EMOTION_COLORS['amour']).toBeDefined();
      expect(EMOTION_COLORS['espoir']).toBeDefined();
      expect(EMOTION_COLORS['gratitude']).toBeDefined();
    });
  });

  describe('EMOTION_CATEGORIES', () => {
    it('should have 18 emotion categories', () => {
      expect(Object.keys(EMOTION_CATEGORIES)).toHaveLength(18);
    });

    it('should categorize positive emotions', () => {
      const positiveEmotions = ['joie', 'calme', 'amour', 'espoir', 'gratitude', 'fierté', 'sérénité', 'enthousiasme'];
      positiveEmotions.forEach(emotion => {
        expect(EMOTION_CATEGORIES[emotion]).toBe('positive');
      });
    });

    it('should categorize negative emotions', () => {
      const negativeEmotions = ['tristesse', 'colère', 'peur', 'dégoût', 'anxiété', 'frustration', 'mélancolie'];
      negativeEmotions.forEach(emotion => {
        expect(EMOTION_CATEGORIES[emotion]).toBe('negative');
      });
    });

    it('should categorize neutral emotions', () => {
      const neutralEmotions = ['surprise', 'confusion', 'ennui'];
      neutralEmotions.forEach(emotion => {
        expect(EMOTION_CATEGORIES[emotion]).toBe('neutral');
      });
    });

    it('should have matching keys with EMOTION_COLORS', () => {
      const colorKeys = Object.keys(EMOTION_COLORS).sort();
      const categoryKeys = Object.keys(EMOTION_CATEGORIES).sort();
      expect(colorKeys).toEqual(categoryKeys);
    });
  });

  describe('Atlas Visualization', () => {
    it('should calculate node size based on frequency', () => {
      const calculateSize = (frequency: number): number => {
        return Math.min(50, Math.max(10, frequency / 5));
      };

      expect(calculateSize(50)).toBe(10);
      expect(calculateSize(100)).toBe(20);
      expect(calculateSize(250)).toBe(50);
    });

    it('should position nodes in 2D space', () => {
      const node: EmotionNode = {
        id: 'node-test',
        emotion: 'test',
        intensity: 50,
        frequency: 25,
        color: 'hsl(0, 0%, 50%)',
        x: 150,
        y: 200,
        size: 20,
        connections: [],
      };

      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeGreaterThanOrEqual(0);
    });
  });
});
