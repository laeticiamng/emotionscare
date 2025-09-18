import { describe, expect, it } from 'vitest';
import {
  BREATH_PROTOCOL_SEQUENCE,
  DEFAULT_PROTOCOL_ID,
  PROTOCOLS_BY_ID,
  calculateCadence,
  calculateCycleDuration,
} from '../protocols';

describe('breath constellation – protocoles', () => {
  it('déclare les protocoles clés avec les durées attendues', () => {
    const coherence = PROTOCOLS_BY_ID['coherence-5-5'];
    expect(coherence.cycleDuration).toBe(10);
    expect(coherence.cadence).toBe(6);
    expect(coherence.pattern.map(step => step.phase)).toEqual(['inhale', 'exhale']);

    const fourSevenEight = PROTOCOLS_BY_ID['4-7-8'];
    expect(fourSevenEight.cycleDuration).toBe(19);
    expect(fourSevenEight.cadence).toBeCloseTo(3.16, 2);
    expect(fourSevenEight.pattern.map(step => step.phase)).toEqual([
      'inhale',
      'hold',
      'exhale',
    ]);
  });

  it('expose une séquence cohérente et un protocole par défaut', () => {
    expect(BREATH_PROTOCOL_SEQUENCE[0].id).toBe(DEFAULT_PROTOCOL_ID);
    const ids = BREATH_PROTOCOL_SEQUENCE.map(protocol => protocol.id);
    expect(new Set(ids).size).toBe(BREATH_PROTOCOL_SEQUENCE.length);
  });

  it('calcule la cadence même sur des entrées extrêmes', () => {
    expect(calculateCycleDuration([{ phase: 'inhale', sec: 0 }])).toBe(0);
    expect(calculateCadence(0)).toBe(0);
    expect(calculateCadence(15)).toBeCloseTo(4, 0);
  });
});

