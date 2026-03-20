export type MixerAction =
  | { action: 'set_warmth'; key: 'low' | 'med' | 'high' }
  | { action: 'set_brightness'; key: 'low' | 'med' | 'high' }
  | { action: 'set_tempo'; key: 'slow' | 'mid' | 'fast' }
  | { action: 'set_rhythm_density'; key: 'sparse' | 'normal' | 'dense' }
  | { action: 'set_dynamics'; key: 'soft' | 'balanced' | 'punchy' }
  | { action: 'set_reverb'; key: 'dry' | 'soft' | 'lush' }
  | { action: 'crossfade_preview'; ms: number }
  | { action: 'apply_params' }
  | { action: 'ui_hint'; key: 'plus_doux' | 'plus_clair' | 'plus_posé' | 'plus_energique' }
  | { action: 'micro_gesture'; key: 'long_exhale' | 'soft_breath' | 'none' };

export interface MixerOrchestratorInputs {
  targetValence: 0 | 1 | 2 | 3 | 4;
  targetArousal: 0 | 1 | 2 | 3 | 4;
  currentValence?: 0 | 1 | 2 | 3 | 4;
  prm: boolean;
}

export function computeMixerActions({
  targetValence: v,
  targetArousal: a,
  currentValence,
  prm,
}: MixerOrchestratorInputs): MixerAction[] {
  const actions: MixerAction[] = [];

  actions.push({ action: 'crossfade_preview', ms: prm ? 120 : 200 });

  if (v <= 1) {
    actions.push(
      { action: 'set_warmth', key: 'low' },
      { action: 'set_brightness', key: 'low' },
      { action: 'ui_hint', key: 'plus_doux' },
    );
  } else if (v === 2) {
    actions.push(
      { action: 'set_warmth', key: 'med' },
      { action: 'set_brightness', key: 'med' },
    );
  } else {
    actions.push(
      { action: 'set_warmth', key: 'high' },
      { action: 'set_brightness', key: 'high' },
      { action: 'ui_hint', key: 'plus_clair' },
    );
  }

  if (a <= 1) {
    actions.push(
      { action: 'set_tempo', key: 'slow' },
      { action: 'set_rhythm_density', key: 'sparse' },
      { action: 'set_dynamics', key: 'soft' },
      { action: 'set_reverb', key: 'lush' },
      { action: 'micro_gesture', key: 'long_exhale' },
      { action: 'ui_hint', key: 'plus_posé' },
    );
  } else if (a === 2) {
    actions.push(
      { action: 'set_tempo', key: 'mid' },
      { action: 'set_rhythm_density', key: 'normal' },
      { action: 'set_dynamics', key: 'balanced' },
      { action: 'set_reverb', key: 'soft' },
      { action: 'micro_gesture', key: 'soft_breath' },
    );
  } else {
    actions.push(
      { action: 'set_tempo', key: 'fast' },
      { action: 'set_rhythm_density', key: 'dense' },
      { action: 'set_dynamics', key: 'punchy' },
      { action: 'set_reverb', key: 'dry' },
      { action: 'ui_hint', key: 'plus_energique' },
    );
  }

  if (typeof currentValence === 'number' && v > currentValence) {
    actions.push({ action: 'set_warmth', key: 'high' });
  }

  actions.push({ action: 'apply_params' });

  return actions;
}
