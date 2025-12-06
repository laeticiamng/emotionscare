import { describe, expect, it } from 'vitest'

import { computeMoodDelta } from '../moodDelta'

describe('computeMoodDelta', () => {
  it('retourne null quand les snapshots sont incomplets', () => {
    expect(computeMoodDelta()).toBeNull()
    expect(computeMoodDelta({ valence: 0.2 }, undefined)).toBeNull()
  })

  it('calcule un delta borné entre -10 et 10', () => {
    const delta = computeMoodDelta({ valence: -0.2, arousal: 0 }, { valence: 0.6, arousal: 0.1 })
    expect(delta).toBe(8)
  })

  it('applique un amortissement en fonction de la variation d’arousal', () => {
    const delta = computeMoodDelta({ valence: 0.1, arousal: 0.3 }, { valence: 0.2, arousal: -0.5 })
    expect(delta).toBeLessThanOrEqual(1)
  })

  it('clamp le résultat à la plage attendue', () => {
    const delta = computeMoodDelta({ valence: -1, arousal: -1 }, { valence: 1, arousal: -1 })
    expect(delta).toBe(10)
    const negative = computeMoodDelta({ valence: 1, arousal: 1 }, { valence: -1, arousal: 1 })
    expect(negative).toBe(-10)
  })
})

