// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { weeklyBarsOrchestrator } from '../weeklyBars.orchestrator';

describe('weeklyBarsOrchestrator', () => {
  it('defaults to calm bars when level is missing', () => {
    const hints = weeklyBarsOrchestrator({});
    expect(hints).toContainEqual({ action: 'show_bars_text', items: ['posé', 'doux'] });
  });

  it('keeps calm palette for low wellbeing', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 1 });
    expect(hints).toContainEqual({ action: 'show_bars_text', items: ['posé', 'doux'] });
  });

  it('activates brighter bars when level is high', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 4 });
    expect(hints).toContainEqual({ action: 'show_bars_text', items: ['clair', 'actif'] });
  });

  it('always includes the flash glow cta', () => {
    const hints = weeklyBarsOrchestrator({ who5Level: 2 });
    expect(hints).toContainEqual({ action: 'post_cta', key: 'flash_glow' });
  });
});
