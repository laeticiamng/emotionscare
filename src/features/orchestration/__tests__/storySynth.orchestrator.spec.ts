// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { storySynthOrchestrator } from '../storySynth.orchestrator';

describe('storySynthOrchestrator', () => {
  it('returns none when no signals', () => {
    expect(storySynthOrchestrator({ tensionLevel: 1, fatigueLevel: 1 })).toEqual([{ action: 'none' }]);
  });

  it('sets the story bed when tension is elevated', () => {
    const hints = storySynthOrchestrator({ tensionLevel: 3, fatigueLevel: 1 });
    expect(hints).toContainEqual({ action: 'set_story_bed', key: 'cocon' });
  });

  it('shortens and slows the scene when fatigue is high', () => {
    const hints = storySynthOrchestrator({ tensionLevel: 1, fatigueLevel: 3 });
    expect(hints).toContainEqual({ action: 'shorten_scene', ms: 60_000 });
    expect(hints).toContainEqual({ action: 'set_story_voice', key: 'slow' });
  });
});
