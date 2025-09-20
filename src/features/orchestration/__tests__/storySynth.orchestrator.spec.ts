import { describe, expect, it } from 'vitest';

import { storySynthOrchestrator } from '../storySynth.orchestrator';

const SHORT_SCENE_MS = 60_000;

describe('storySynthOrchestrator', () => {
  it('returns bed cocon when tension is high', () => {
    const hints = storySynthOrchestrator({ tensionLevel: 3 });
    expect(hints).toContainEqual({ action: 'set_story_bed', key: 'cocon' });
  });

  it('shortens scene and slows voice when fatigue is high', () => {
    const hints = storySynthOrchestrator({ fatigueLevel: 3 });
    expect(hints).toContainEqual({ action: 'shorten_scene', ms: SHORT_SCENE_MS });
    expect(hints).toContainEqual({ action: 'set_story_voice', key: 'slow' });
  });

  it('returns none when no hints apply', () => {
    const hints = storySynthOrchestrator({ tensionLevel: 1, fatigueLevel: 1 });
    expect(hints).toEqual([{ action: 'none' }]);
  });
});
