/**
 * Tests pour les types breathing-vr
 */

import { describe, it, expect } from 'vitest';
import { BREATHING_PATTERNS } from '../types';
import type { BreathingPattern, BreathingPhase } from '../types';

describe('BreathingVR Types', () => {
  it('should have 5 breathing patterns', () => {
    const patterns = Object.keys(BREATHING_PATTERNS);
    expect(patterns).toHaveLength(5);
  });

  it('should validate BreathingPattern', () => {
    const validPatterns: BreathingPattern[] = ['box', 'calm', '478', 'energy', 'coherence'];
    expect(validPatterns).toHaveLength(5);
  });

  it('should validate BreathingPhase', () => {
    const validPhases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
    expect(validPhases).toHaveLength(4);
  });

  it('should have valid box breathing pattern', () => {
    const box = BREATHING_PATTERNS.box;
    expect(box.inhale).toBe(4);
    expect(box.hold).toBe(4);
    expect(box.exhale).toBe(4);
    expect(box.rest).toBe(4);
  });

  it('should have valid 4-7-8 pattern', () => {
    const pattern478 = BREATHING_PATTERNS['478'];
    expect(pattern478.inhale).toBe(4);
    expect(pattern478.hold).toBe(7);
    expect(pattern478.exhale).toBe(8);
  });

  it('should have valid coherence pattern', () => {
    const coherence = BREATHING_PATTERNS.coherence;
    expect(coherence.inhale).toBe(5);
    expect(coherence.exhale).toBe(5);
    expect(coherence.hold).toBeUndefined();
  });
});
