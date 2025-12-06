// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { aurasOrchestrator } from '../auras.orchestrator';

describe('aurasOrchestrator', () => {
  it('returns cool aura for low WHO-5 level', () => {
    const hints = aurasOrchestrator({ who5Level: 0 });
    expect(hints).toEqual([{ action: 'set_aura', key: 'cool_gentle' }]);
  });

  it('returns warm aura for high WHO-5 level', () => {
    const hints = aurasOrchestrator({ who5Level: 4 });
    expect(hints).toEqual([{ action: 'set_aura', key: 'warm_soft' }]);
  });

  it('returns neutral aura for medium WHO-5 level', () => {
    const hints = aurasOrchestrator({ who5Level: 2 });
    expect(hints).toEqual([{ action: 'set_aura', key: 'neutral' }]);
  });

  it('defaults to neutral aura when level is undefined', () => {
    const hints = aurasOrchestrator({});
    expect(hints).toEqual([{ action: 'set_aura', key: 'neutral' }]);
  });
});
