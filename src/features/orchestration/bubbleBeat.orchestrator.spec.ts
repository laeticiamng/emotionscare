import { describe, expect, it } from 'vitest';

import { bubbleBeatOrchestrator } from './bubbleBeat.orchestrator';

describe('bubbleBeatOrchestrator', () => {
  it('activates the gentle path when stress level is elevated', () => {
    const actions = bubbleBeatOrchestrator({ pss10Level: 3 });

    expect(actions).toContainEqual({ action: 'set_path_variant', key: 'hr' });
    expect(actions).toContainEqual({ action: 'set_path_duration', ms: 120_000 });
    expect(actions).toContainEqual({ action: 'post_cta', key: 'nyvee_suggest' });
  });

  it('keeps the default journey when stress is lower', () => {
    const actions = bubbleBeatOrchestrator({ pss10Level: 1 });

    expect(actions).toEqual([]);
  });
});
