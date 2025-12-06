import { describe, expect, it } from 'vitest';

import { socialCoconOrchestrator } from './socialCocon.orchestrator';

describe('socialCoconOrchestrator', () => {
  it('promotes planning and highlights rooms when MSPSS is low', () => {
    const hints = socialCoconOrchestrator({ mspssLevel: 1, consented: true });
    expect(hints).toEqual([
      { action: 'promote_cta', key: 'schedule_break' },
      { action: 'highlight_rooms_private' },
    ]);
  });

  it('returns empty hints when MSPSS is not low', () => {
    const hints = socialCoconOrchestrator({ mspssLevel: 3, consented: true });
    expect(hints).toEqual([{ action: 'none' }]);
  });

  it('ignores undefined level', () => {
    expect(socialCoconOrchestrator({ consented: true })).toEqual([{ action: 'none' }]);
  });

  it('suppresses orchestration when consent missing', () => {
    expect(socialCoconOrchestrator({ mspssLevel: 0, consented: false })).toEqual([{ action: 'none' }]);
  });
});
