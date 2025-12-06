import { describe, expect, it } from 'vitest';

import { screenSilkOrchestrator } from '../screenSilk.orchestrator';

describe('screenSilkOrchestrator', () => {
  it('returns none when signals are calm and no prm', () => {
    expect(screenSilkOrchestrator({ cvsqLevel: 0, prm: false })).toEqual([{ action: 'none' }]);
  });

  it('activates blink reminders and gentle blur when level is elevated', () => {
    const hints = screenSilkOrchestrator({ cvsqLevel: 2, prm: false });
    expect(hints).toContainEqual({ action: 'set_blink_reminder', key: 'gentle' });
    expect(hints).toContainEqual({ action: 'set_blur_opacity', key: 'low' });
    expect(hints).toContainEqual({ action: 'post_cta', key: 'screen_silk' });
  });

  it('lowers blur further when reduced motion is requested', () => {
    const hints = screenSilkOrchestrator({ cvsqLevel: 3, prm: true });
    expect(hints).toContainEqual({ action: 'set_blur_opacity', key: 'very_low' });
  });
});
