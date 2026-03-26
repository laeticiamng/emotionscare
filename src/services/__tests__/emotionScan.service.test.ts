// @ts-nocheck
import { describe, expect, test } from 'vitest';
import { mapScanRow, type EmotionScanRow } from '../emotionScan.service';

describe('emotionScan.service mapScanRow', () => {
  test('normalizes nested payloads with computed balance and insights fallback', () => {
    const row: EmotionScanRow = {
      id: 'scan-1',
      user_id: 'user-123',
      created_at: '2024-04-01T10:15:00.000Z',
      updated_at: null,
      scan_type: 'text',
      mood: 'joie',
      summary: 'Émotion dominante: joie · Confiance: 92% · Équilibre émotionnel: 74/100',
      confidence: 92,
      emotional_balance: null,
      recommendations: ['Respiration cohérente', 'Marche consciente'],
      insights: null,
      emotions: {
        scores: {
          joie: 8.5,
          confiance: 7.9,
          anticipation: 6.3,
          surprise: 5.4,
          tristesse: 2.1,
          colere: 1.4,
          peur: 1.2,
          degout: 0.8,
        },
        insights: ['Belle harmonie émotionnelle détectée'],
        context: 'Auto-évaluation I-PANAS-SF',
        previousEmotions: {
          joie: 7.5,
          tristesse: 3,
        },
      },
    };

    const entry = mapScanRow(row);

    expect(entry.id).toBe('scan-1');
    expect(entry.mood).toBe('joie');
    expect(entry.confidence).toBe(92);
    expect(entry.normalizedBalance).toBeGreaterThan(0);
    expect(entry.normalizedBalance).toBeLessThanOrEqual(100);
    expect(entry.scores.joie).toBeCloseTo(8.5);
    expect(entry.insights).toEqual(['Belle harmonie émotionnelle détectée']);
  });

  test('keeps top-level insights and balance when provided by the row', () => {
    const row: EmotionScanRow = {
      id: 'scan-2',
      user_id: 'user-456',
      created_at: '2024-04-02T08:00:00.000Z',
      updated_at: null,
      scan_type: 'self-report',
      mood: null,
      summary: null,
      confidence: 64.2,
      emotional_balance: 71,
      recommendations: [],
      insights: ['Privilégier un ancrage quotidien'],
      emotions: {
        joie: 6.1,
        tristesse: 4.3,
        confiance: 5.4,
        anticipation: 5.8,
      },
    } as unknown as EmotionScanRow;

    const entry = mapScanRow(row);

    expect(entry.summary).toBeNull();
    expect(entry.normalizedBalance).toBe(71);
    expect(entry.insights).toEqual(['Privilégier un ancrage quotidien']);
    expect(entry.scores.joie).toBe(6.1);
    expect(entry.scores.tristesse).toBe(4.3);
  });
});
