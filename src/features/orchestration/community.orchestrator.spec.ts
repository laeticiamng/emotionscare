// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { communityOrchestrator } from './community.orchestrator';

describe('communityOrchestrator', () => {
  it('returns banner and pinned card when UCLA level is high', () => {
    const hints = communityOrchestrator({ uclaLevel: 3, consented: true });
    expect(hints).toEqual([
      { action: 'show_banner', key: 'listen_two_minutes' },
      { action: 'pin_card', key: 'social_cocon' },
    ]);
  });

  it('returns empathic reply suggestions when MSPSS is low', () => {
    const hints = communityOrchestrator({ mspssLevel: 1, consented: true });
    expect(hints).toEqual([{ action: 'show_empathic_replies' }]);
  });

  it('combines hints when both signals are present', () => {
    const hints = communityOrchestrator({ uclaLevel: 4, mspssLevel: 0, consented: true });
    expect(hints).toEqual([
      { action: 'show_banner', key: 'listen_two_minutes' },
      { action: 'pin_card', key: 'social_cocon' },
      { action: 'show_empathic_replies' },
    ]);
  });

  it('ignores undefined levels', () => {
    const hints = communityOrchestrator({ consented: true });
    expect(hints).toEqual([{ action: 'none' }]);
  });

  it('suppresses orchestration when consent is missing', () => {
    const hints = communityOrchestrator({ uclaLevel: 4, mspssLevel: 0, consented: false });
    expect(hints).toEqual([{ action: 'none' }]);
  });
});
