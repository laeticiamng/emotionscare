import { describe, expect, it } from 'vitest';

import { bossGritOrchestrator } from '../bossGrit.orchestrator';

describe('bossGritOrchestrator', () => {
  it('shortens the challenge when grit or brs levels are low', () => {
    const actions = bossGritOrchestrator({ gritLevel: 1, brsLevel: 3 });

    expect(actions).toContainEqual({ action: 'set_challenge_duration', ms: 180_000 });
    expect(actions).toContainEqual({ action: 'enable_compassion_streak', enabled: true });
  });

  it('keeps the standard duration when resilience is steady', () => {
    const actions = bossGritOrchestrator({ gritLevel: 3, brsLevel: 3 });

    expect(actions).toContainEqual({ action: 'set_challenge_duration', ms: 600_000 });
  });

  it('defaults to the standard duration when levels are missing', () => {
    const actions = bossGritOrchestrator({});

    expect(actions).toContainEqual({ action: 'set_challenge_duration', ms: 600_000 });
  });
});
