import { describe, expect, it } from 'vitest';

import { computeMixerActions, type MixerAction } from './moodMixer.orchestrator';

const findAction = <T extends MixerAction['action']>(actions: MixerAction[], action: T) =>
  actions.find((item): item is Extract<MixerAction, { action: T }> => item.action === action);

const filterActions = <T extends MixerAction['action']>(actions: MixerAction[], action: T) =>
  actions.filter((item): item is Extract<MixerAction, { action: T }> => item.action === action);

describe('moodMixer.orchestrator', () => {
  it('steers towards bright yet calm textures when valence is high and arousal low', () => {
    const actions = computeMixerActions({ targetValence: 4, targetArousal: 0, prm: false });

    expect(filterActions(actions, 'set_warmth')).toContainEqual({ action: 'set_warmth', key: 'high' });
    expect(filterActions(actions, 'set_brightness')).toContainEqual({ action: 'set_brightness', key: 'high' });
    expect(filterActions(actions, 'set_tempo')).toContainEqual({ action: 'set_tempo', key: 'slow' });
    expect(filterActions(actions, 'set_rhythm_density')).toContainEqual({ action: 'set_rhythm_density', key: 'sparse' });
    expect(filterActions(actions, 'set_dynamics')).toContainEqual({ action: 'set_dynamics', key: 'soft' });
    expect(filterActions(actions, 'set_reverb')).toContainEqual({ action: 'set_reverb', key: 'lush' });
    expect(filterActions(actions, 'micro_gesture')).toContainEqual({ action: 'micro_gesture', key: 'long_exhale' });
  });

  it('shifts towards mellow tones with quick tempo when arousal climbs and valence dips', () => {
    const actions = computeMixerActions({ targetValence: 1, targetArousal: 3, prm: false });

    expect(filterActions(actions, 'set_warmth')).toContainEqual({ action: 'set_warmth', key: 'low' });
    expect(filterActions(actions, 'set_brightness')).toContainEqual({ action: 'set_brightness', key: 'low' });
    expect(filterActions(actions, 'set_tempo')).toContainEqual({ action: 'set_tempo', key: 'fast' });
    expect(filterActions(actions, 'set_rhythm_density')).toContainEqual({ action: 'set_rhythm_density', key: 'dense' });
    expect(filterActions(actions, 'set_dynamics')).toContainEqual({ action: 'set_dynamics', key: 'punchy' });
    expect(filterActions(actions, 'set_reverb')).toContainEqual({ action: 'set_reverb', key: 'dry' });
  });

  it('reduces preview crossfade duration under reduced motion', () => {
    const actions = computeMixerActions({ targetValence: 2, targetArousal: 2, prm: true });
    const crossfade = findAction(actions, 'crossfade_preview');

    expect(crossfade).toEqual({ action: 'crossfade_preview', ms: 120 });
  });

  it('reinforces warmth when the target valence exceeds the current snapshot', () => {
    const actions = computeMixerActions({ targetValence: 3, targetArousal: 2, currentValence: 1, prm: false });
    const warmth = filterActions(actions, 'set_warmth');

    expect(warmth).toContainEqual({ action: 'set_warmth', key: 'high' });
    expect(warmth.length).toBeGreaterThan(1);
  });

  it('only emits textual hints without digits', () => {
    const actions = computeMixerActions({ targetValence: 4, targetArousal: 4, prm: false });
    const hints = filterActions(actions, 'ui_hint');

    expect(hints).not.toHaveLength(0);
    expect(hints.every((hint) => !/\d/.test(hint.key))).toBe(true);
  });
});
