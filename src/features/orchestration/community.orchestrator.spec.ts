import { describe, expect, it } from 'vitest';

import { communityOrchestrator } from './community.orchestrator';

describe('communityOrchestrator', () => {
  it('returns banner and pinned card when UCLA level is high', () => {
    const hints = communityOrchestrator({ ucla3Level: 3 });
    expect(hints).toEqual([
      { action: 'show_banner', key: 'listen_two_minutes' },
      { action: 'pin_card', key: 'social_cocon' },
    ]);
  });

  it('returns empathic reply suggestions when MSPSS is low', () => {
    const hints = communityOrchestrator({ mspssLevel: 1 });
    expect(hints).toEqual([{ action: 'suggest_replies', key: 'empathic_templates' }]);
  });

  it('combines hints when both signals are present', () => {
    const hints = communityOrchestrator({ ucla3Level: 4, mspssLevel: 0 });
    expect(hints).toEqual([
      { action: 'show_banner', key: 'listen_two_minutes' },
      { action: 'pin_card', key: 'social_cocon' },
      { action: 'suggest_replies', key: 'empathic_templates' },
    ]);
  });

  it('ignores undefined levels', () => {
    const hints = communityOrchestrator({});
    expect(hints).toEqual([]);
  });
});
