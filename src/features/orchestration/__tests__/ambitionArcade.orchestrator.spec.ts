// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { ambitionArcadeOrchestrator } from '../ambitionArcade.orchestrator';

const MICRO_LEVERS = ['1 geste simple', '2 minutes de marche', 'respirer 1 minute'];

describe('ambitionArcadeOrchestrator', () => {
  it('returns gently progressing label for low GAS level', () => {
    const actions = ambitionArcadeOrchestrator({ gasLevel: 1 });

    expect(actions).toContainEqual({ action: 'set_progress_text', key: 'doucement' });
    const microLeverAction = actions.find((action) => action.action === 'inject_micro_levers');
    expect(microLeverAction).toBeDefined();
    expect(microLeverAction).toMatchObject({ items: MICRO_LEVERS });
  });

  it('returns on-track label for mid GAS level', () => {
    const actions = ambitionArcadeOrchestrator({ gasLevel: 2 });

    expect(actions).toContainEqual({ action: 'set_progress_text', key: 'sur la bonne voie' });
  });

  it('returns almost-there label for high GAS level', () => {
    const actions = ambitionArcadeOrchestrator({ gasLevel: 4 });

    expect(actions).toContainEqual({ action: 'set_progress_text', key: 'presque là' });
  });

  it('defaults to on-track label when level is missing', () => {
    const actions = ambitionArcadeOrchestrator({});

    expect(actions).toContainEqual({ action: 'set_progress_text', key: 'sur la bonne voie' });
  });
});
