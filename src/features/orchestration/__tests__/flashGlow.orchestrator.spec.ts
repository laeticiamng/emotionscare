// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { computeFlashGlowActions } from '../flashGlow.orchestrator';

describe('computeFlashGlowActions', () => {
  it('returns extension instructions when post level stays high', () => {
    const result = computeFlashGlowActions({
      preLevel: 3,
      postLevel: 4,
      optedIn: true,
      prefersReducedMotion: false,
    });

    expect(result).toMatchObject({
      extend_session: 60_000,
      set_visuals_intensity: 'lowered',
      set_breath_pattern: 'exhale_longer',
      set_audio_fade: 'slow',
      set_haptics: 'calm',
    });
    expect(result.soft_exit).toBeUndefined();
    expect(result.post_cta).toBeUndefined();
  });

  it('prepares a soft exit flow when the post level calms down', () => {
    const result = computeFlashGlowActions({
      preLevel: 3,
      postLevel: 1,
      optedIn: true,
      prefersReducedMotion: false,
    });

    expect(result).toMatchObject({
      soft_exit: true,
      toast_text: 'gratitude',
      post_cta: 'screen_silk',
      set_visuals_intensity: 'lowered',
      set_breath_pattern: 'exhale_longer',
      set_audio_fade: 'slow',
      set_haptics: 'calm',
    });
    expect(result.extend_session).toBeUndefined();
  });

  it('prioritises motion reduction hints when prefers reduced motion', () => {
    const result = computeFlashGlowActions({
      preLevel: 2,
      postLevel: 2,
      optedIn: true,
      prefersReducedMotion: true,
    });

    expect(result.set_haptics).toBe('off');
    expect(result.set_visuals_intensity).toBe('lowered');
    expect(result.post_cta).toBe('screen_silk');
  });

  it('handles the no consent path gracefully', () => {
    const result = computeFlashGlowActions({
      optedIn: false,
      prefersReducedMotion: false,
    });

    expect(result).toEqual({});
  });
});
