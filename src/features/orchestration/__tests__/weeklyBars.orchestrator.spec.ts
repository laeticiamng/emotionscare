import { describe, expect, it } from 'vitest';

import { weeklyBarsOrchestrator } from '../weeklyBars.orchestrator';

describe('weeklyBarsOrchestrator', () => {
  it('returns calm bars when level is low', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 1 });
    expect(hints).toContainEqual({ action: 'show_bars_text', items: ['posé', 'doux'] });
  });

  it('returns active bars when level is high', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 3 });
    expect(hints).toContainEqual({ action: 'show_bars_text', items: ['clair', 'actif'] });
  });

  it('always adds the soft cta', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 2 });
    expect(hints).toContainEqual({ action: 'post_cta', key: 'flash_glow' });
  });
});
