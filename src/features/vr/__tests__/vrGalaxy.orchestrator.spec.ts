// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { deriveGalaxyProfile } from '../deriveProfile';
import { computeGalaxyActions } from '../vrGalaxy.orchestrator';

describe('computeGalaxyActions', () => {
  it('keeps a conservative profile on low tier hardware', () => {
    const actions = computeGalaxyActions({ vrTier: 'low', prm: false });
    const profile = deriveGalaxyProfile(actions);

    expect(profile.comfort).toBe('low');
    expect(profile.duration).toBe('short');
    expect(profile.navigation).toBe('gentle');
    expect(profile.stellarDensity).toBe('balanced');
  });

  it('applies fallback and drift navigation when SSQ is high', () => {
    const actions = computeGalaxyActions({ vrTier: 'mid', prm: false, ssqLevel: 4 });
    const profile = deriveGalaxyProfile(actions);

    expect(profile.fallback2dNext).toBe(true);
    expect(profile.navigation).toBe('drift');
    expect(profile.stellarDensity).toBe('thin');
  });
});
