import { describe, it, expect } from 'vitest';
import { mapScanRow } from '@/services/emotionScan.service';
import type { EmotionScanRow } from '@/services/emotionScan.service';

describe('emotionScan.service mapScanRow', () => {
  const baseRow: EmotionScanRow = {
    id: 'scan-1',
    user_id: 'user-1',
    created_at: '2024-09-01T10:00:00.000Z',
    updated_at: null,
    summary: 'Énergie positive et centrée.',
    mood: 'calme',
    confidence: 82,
    emotional_balance: 64,
    emotions: {
      scores: {
        joie: 6,
        confiance: 5,
        anticipation: 4,
        surprise: 3,
        tristesse: 1,
        colere: 0,
        peur: 1,
        degout: 0,
      },
      insights: ['Respiration équilibrée.'],
      context: 'Auto-évaluation I-PANAS-SF',
    },
    insights: ['Focus sur la respiration.'],
    recommendations: ['Programmer une séance Breath Constellation.'],
    scan_type: 'ipanassf',
  } as EmotionScanRow;

  it('conserve les champs principaux et normalise le score', () => {
    const entry = mapScanRow(baseRow);

    expect(entry.id).toBe('scan-1');
    expect(entry.mood).toBe('calme');
    expect(entry.summary).toMatch(/Énergie positive/);
    expect(entry.confidence).toBe(82);
    expect(entry.normalizedBalance).toBe(64);
    expect(entry.insights).toEqual(['Focus sur la respiration.']);
    expect(entry.recommendations).toEqual(['Programmer une séance Breath Constellation.']);
    expect(entry.scores.joie).toBe(6);
    expect(entry.scanType).toBe('ipanassf');
  });

  it('reconstitue le payload lorsque emotions est un dictionnaire simple', () => {
    const rawRow: EmotionScanRow = {
      ...baseRow,
      id: 'scan-2',
      emotional_balance: null,
      emotions: {
        joie: 7,
        confiance: 6,
        anticipation: 5,
        surprise: 3,
        tristesse: 2,
        colere: 1,
        peur: 0,
        degout: 0,
      } as unknown as EmotionScanRow['emotions'],
      insights: null,
      recommendations: [],
    };

    const entry = mapScanRow(rawRow);

    expect(entry.id).toBe('scan-2');
    expect(entry.normalizedBalance).toBeGreaterThan(0);
    expect(entry.insights).toEqual([]);
    expect(entry.recommendations).toEqual([]);
    expect(entry.scores.joie).toBe(7);
  });

  it('utilise les insights embarqués lorsque la colonne est vide', () => {
    const rowWithEmbeddedInsights: EmotionScanRow = {
      ...baseRow,
      id: 'scan-3',
      insights: null,
      emotions: {
        scores: baseRow.emotions?.scores,
        insights: ['Hydrate-toi avant la séance suivante.'],
      } as unknown as EmotionScanRow['emotions'],
    };

    const entry = mapScanRow(rowWithEmbeddedInsights);

    expect(entry.insights).toEqual(['Hydrate-toi avant la séance suivante.']);
  });
});
