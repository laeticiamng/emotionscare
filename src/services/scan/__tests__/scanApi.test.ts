import { describe, expect, it } from 'vitest'

import { mapScanResponse } from '@/services/scan/scanApi'

describe('scanApi mapScanResponse', () => {
  it('normalise les labels et valeurs numériques', () => {
    const raw = {
      labels: ['joie', 'confiance'],
      valence: 0.42,
      arousal: 0.25,
      mood_score: 76,
    }

    const result = mapScanResponse(raw)

    expect(result.labels).toEqual(['joie', 'confiance'])
    expect(result.valence).toBeCloseTo(0.42)
    expect(result.arousal).toBeCloseTo(0.25)
    expect(result.mood_score).toBe(76)
  })

  it('dérive les labels à partir du payload émotionnel', () => {
    const raw = {
      emotions: { calme: 0.8, stress: 0.2 },
      dominantEmotion: 'calme',
      emotionalBalance: 64,
    }

    const result = mapScanResponse(raw as any)

    expect(result.labels[0]).toBe('calme')
    expect(result.mood_score).toBe(64)
    expect(result.valence).toBeCloseTo((64 - 50) / 50)
  })

  it('rejette un payload sans labels exploitables', () => {
    expect(() => mapScanResponse({} as any)).toThrowError('invalid_scan_payload')
  })
})
