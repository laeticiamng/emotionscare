import { describe, expect, it } from 'vitest';

import { screenSilkOrchestrator } from '../screenSilk.orchestrator';

describe('screenSilkOrchestrator', () => {
  it('activates gentle blink reminder and low blur when cvsq is high enough', () => {
    const hints = screenSilkOrchestrator({ cvsqLevel: 2, prm: false });
    expect(hints).toContainEqual({ action: 'set_blink_reminder', key: 'gentle' });
    expect(hints).toContainEqual({ action: 'set_blur_opacity', key: 'low' });
    expect(hints).toContainEqual({ action: 'post_cta', key: 'screen_silk' });
  });

  it('lowers blur further when prefers reduced motion is true', () => {
    const hints = screenSilkOrchestrator({ cvsqLevel: 1, prm: true });
    expect(hints).toContainEqual({ action: 'set_blur_opacity', key: 'very_low' });
  });

  it('returns none when nothing applies', () => {
    const hints = screenSilkOrchestrator({ cvsqLevel: 0, prm: false });
    expect(hints).toEqual([{ action: 'none' }]);
  });
});
