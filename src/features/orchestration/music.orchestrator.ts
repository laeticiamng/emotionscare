export type MusicTextureKey = 'ambient_very_low' | 'calm_low' | 'warm_soft' | 'neutral';
export type MusicIntensityKey = 'very_low' | 'low' | 'medium';
export type MusicBpmProfile = 'slow' | 'neutral';

export type MusicAction =
  | { action: 'set_texture'; key: MusicTextureKey }
  | { action: 'set_intensity'; key: MusicIntensityKey }
  | { action: 'set_bpm_profile'; key: MusicBpmProfile }
  | { action: 'set_crossfade'; ms: number }
  | { action: 'post_cta'; key: 'nyvee' | 'encore_2min' | 'none' }
  | { action: 'visualizer_mode'; key: 'reduced' | 'standard' };

export interface MusicOrchestrationInputs {
  tensionLevel?: number;
  fatigueLevel?: number;
  vigorLevel?: number;
  consented: boolean;
  prm: boolean;
}

const DEFAULT_ACTIONS: MusicAction[] = [
  { action: 'set_texture', key: 'calm_low' },
  { action: 'set_intensity', key: 'low' },
  { action: 'set_bpm_profile', key: 'slow' },
  { action: 'set_crossfade', ms: 12000 },
];

const clamp = (value: number): number => {
  if (Number.isNaN(value)) return 2;
  if (value < 0) return 0;
  if (value > 4) return 4;
  return value;
};

export function computeMusicActions(inputs: MusicOrchestrationInputs): MusicAction[] {
  const actions: MusicAction[] = [];

  if (!inputs.consented) {
    actions.push(...DEFAULT_ACTIONS);
    if (inputs.prm) {
      actions.push({ action: 'visualizer_mode', key: 'reduced' });
    }
    return actions;
  }

  const tensionLevel = clamp(inputs.tensionLevel ?? 2);
  const fatigueLevel = clamp(inputs.fatigueLevel ?? 2);
  const vigorLevel = clamp(inputs.vigorLevel ?? 2);

  const highTension = tensionLevel >= 3;
  const lowTension = tensionLevel <= 1;
  const highFatigue = fatigueLevel >= 3;
  const lowVigor = vigorLevel <= 1;

  if (inputs.prm) {
    actions.push({ action: 'visualizer_mode', key: 'reduced' });
  }

  if (highTension || highFatigue || lowVigor) {
    actions.push(
      { action: 'set_texture', key: 'ambient_very_low' },
      { action: 'set_intensity', key: 'very_low' },
      { action: 'set_bpm_profile', key: 'slow' },
    );
  } else if (lowTension) {
    actions.push(
      { action: 'set_texture', key: 'warm_soft' },
      { action: 'set_intensity', key: 'low' },
      { action: 'set_bpm_profile', key: 'neutral' },
    );
  } else {
    actions.push(
      { action: 'set_texture', key: 'calm_low' },
      { action: 'set_intensity', key: 'low' },
      { action: 'set_bpm_profile', key: 'slow' },
    );
  }

  if (highTension) {
    actions.push({ action: 'set_crossfade', ms: 18000 }, { action: 'post_cta', key: 'nyvee' });
  } else if (lowTension) {
    actions.push({ action: 'set_crossfade', ms: 12000 }, { action: 'post_cta', key: 'encore_2min' });
  } else {
    actions.push({ action: 'set_crossfade', ms: 12000 }, { action: 'post_cta', key: 'none' });
  }

  return actions;
}
