import { describe, expect, it } from 'vitest';

import { computeMusicActions } from '../music.orchestrator';

describe('computeMusicActions', () => {
  it('selects very soft profile and Nyvée CTA when tension is very high', () => {
    const result = computeMusicActions({ tensionLevel: 4, fatigueLevel: 1, vigorLevel: 3, consented: true, prm: false });

    expect(result).toContainEqual({ action: 'set_texture', key: 'ambient_very_low' });
    expect(result).toContainEqual({ action: 'set_intensity', key: 'very_low' });
    expect(result).toContainEqual({ action: 'set_bpm_profile', key: 'slow' });
    expect(result).toContainEqual({ action: 'set_crossfade', ms: 18000 });
    expect(result).toContainEqual({ action: 'post_cta', key: 'nyvee' });
  });

  it('chooses warm texture and encore CTA when tension is very low', () => {
    const result = computeMusicActions({ tensionLevel: 0, fatigueLevel: 1, vigorLevel: 4, consented: true, prm: false });

    expect(result).toContainEqual({ action: 'set_texture', key: 'warm_soft' });
    expect(result).toContainEqual({ action: 'set_intensity', key: 'low' });
    expect(result).toContainEqual({ action: 'set_bpm_profile', key: 'neutral' });
    expect(result).toContainEqual({ action: 'set_crossfade', ms: 12000 });
    expect(result).toContainEqual({ action: 'post_cta', key: 'encore_2min' });
  });

  it('prefers very low intensity when fatigue is high or vigor is low', () => {
    const fatigued = computeMusicActions({ tensionLevel: 2, fatigueLevel: 4, vigorLevel: 3, consented: true, prm: false });
    const lowVigor = computeMusicActions({ tensionLevel: 2, fatigueLevel: 2, vigorLevel: 0, consented: true, prm: false });

    for (const actions of [fatigued, lowVigor]) {
      expect(actions).toContainEqual({ action: 'set_texture', key: 'ambient_very_low' });
      expect(actions).toContainEqual({ action: 'set_intensity', key: 'very_low' });
      expect(actions).toContainEqual({ action: 'set_bpm_profile', key: 'slow' });
    }
  });

  it('keeps soft defaults and reduced visualizer when consent missing but PRM true', () => {
    const result = computeMusicActions({ consented: false, prm: true });

    expect(result).toContainEqual({ action: 'set_texture', key: 'calm_low' });
    expect(result).toContainEqual({ action: 'set_intensity', key: 'low' });
    expect(result).toContainEqual({ action: 'set_bpm_profile', key: 'slow' });
    expect(result).toContainEqual({ action: 'set_crossfade', ms: 12000 });
    expect(result).toContainEqual({ action: 'visualizer_mode', key: 'reduced' });
  });
});
