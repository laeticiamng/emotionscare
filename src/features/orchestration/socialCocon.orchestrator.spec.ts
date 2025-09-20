import { describe, expect, it } from 'vitest';

import { socialCoconOrchestrator } from './socialCocon.orchestrator';

describe('socialCoconOrchestrator', () => {
  it('prioritises CTA and promotes rooms when MSPSS is low', () => {
    const hints = socialCoconOrchestrator({ mspssLevel: 1 });
    expect(hints).toEqual([
      { action: 'prioritize_cta', key: 'plan_pause' },
      { action: 'promote_rooms_private', enabled: true },
    ]);
  });

  it('returns empty hints when MSPSS is not low', () => {
    const hints = socialCoconOrchestrator({ mspssLevel: 3 });
    expect(hints).toEqual([]);
  });

  it('ignores undefined level', () => {
    expect(socialCoconOrchestrator({})).toEqual([]);
  });
});
