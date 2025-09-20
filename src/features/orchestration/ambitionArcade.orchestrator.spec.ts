import { describe, expect, it } from 'vitest';

import { ambitionOrchestrator } from './ambitionArcade.orchestrator';

const MICRO_LEVERS = ['1 geste simple', '2 minutes de marche', 'respirer 1 minute'];

describe('ambitionOrchestrator', () => {
  it('returns gently progressing label for low GAS level', () => {
    const actions = ambitionOrchestrator({ gasLevel: 1 });

    expect(actions).toContainEqual({ action: 'set_text_progress', key: 'doucement' });
    const microLeverAction = actions.find((action) => action.action === 'inject_micro_levers');
    expect(microLeverAction).toBeDefined();
    expect(microLeverAction).toMatchObject({ items: MICRO_LEVERS });
  });

  it('returns on-track label for mid GAS level', () => {
    const actions = ambitionOrchestrator({ gasLevel: 2 });

    expect(actions).toContainEqual({ action: 'set_text_progress', key: 'sur la bonne voie' });
  });

  it('returns almost-there label for high GAS level', () => {
    const actions = ambitionOrchestrator({ gasLevel: 4 });

    expect(actions).toContainEqual({ action: 'set_text_progress', key: 'presque là' });
  });
});
