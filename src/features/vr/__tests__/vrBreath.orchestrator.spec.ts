import { describe, expect, it } from 'vitest';

import { deriveBreathProfile } from '../deriveProfile';
import { computeBreathActions } from '../vrBreath.orchestrator';

describe('computeBreathActions', () => {
  it('forces very soft profile when prefers reduced motion', () => {
    const actions = computeBreathActions({ vrTier: 'high', prm: true });
    const profile = deriveBreathProfile(actions);

    expect(profile.comfort).toBe('very_low');
    expect(profile.duration).toBe('short');
    expect(profile.locomotion).toBe('teleport');
    expect(profile.vignette).toBe('comfort');
    expect(profile.particles).toBe('low');
    expect(profile.audio).toBe('calm');
  });

  it('enables fallback and applies very low comfort when SSQ is high', () => {
    const actions = computeBreathActions({ vrTier: 'mid', prm: false, ssqLevel: 3 });
    const profile = deriveBreathProfile(actions);

    expect(profile.fallback2dNext).toBe(true);
    expect(profile.comfort).toBe('very_low');
    expect(profile.locomotion).toBe('teleport');
    expect(profile.vignette).toBe('comfort');
  });

  it('shortens scene and extends guidance when tension is elevated', () => {
    const actions = computeBreathActions({ vrTier: 'high', prm: false, tensionLevel: 4 });
    const profile = deriveBreathProfile(actions);

    expect(profile.duration).toBe('short');
    expect(profile.guidance).toBe('long_exhale');
    expect(profile.particles).toBe('low');
  });
});
