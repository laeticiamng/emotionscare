import type { OrchestrationInputs } from './types';

export type VRActions =
  | { action: 'set_comfort'; key: 'very_low' | 'low' | 'medium' }
  | { action: 'set_duration'; key: 'short' | 'normal' }
  | { action: 'set_locomotion'; key: 'teleport' | 'smooth' }
  | { action: 'set_fov'; key: 'narrow' | 'default' }
  | { action: 'set_effects'; bloom: boolean; vignette: 'none' | 'soft' | 'comfort' }
  | { action: 'set_particles'; density: 'low' | 'medium' | 'high' }
  | { action: 'set_audio'; key: 'calm' | 'soft' }
  | { action: 'set_guidance'; key: 'long_exhale' | 'none' }
  | { action: 'fallback_2d_next'; enabled: boolean };

export function computeBreathActions(input: OrchestrationInputs): VRActions[] {
  const acts: VRActions[] = [];

  if (input.prm) {
    acts.push(
      { action: 'set_comfort', key: 'very_low' },
      { action: 'set_duration', key: 'short' },
      { action: 'set_locomotion', key: 'teleport' },
      { action: 'set_fov', key: 'narrow' },
      { action: 'set_effects', bloom: false, vignette: 'comfort' },
      { action: 'set_particles', density: 'low' },
      { action: 'set_audio', key: 'calm' },
      { action: 'set_guidance', key: 'long_exhale' },
    );
    return acts;
  }

  if (input.vrTier === 'low') {
    acts.push(
      { action: 'set_comfort', key: 'low' },
      { action: 'set_duration', key: 'short' },
      { action: 'set_locomotion', key: 'teleport' },
      { action: 'set_effects', bloom: false, vignette: 'comfort' },
      { action: 'set_particles', density: 'low' },
      { action: 'set_audio', key: 'calm' },
    );
  } else {
    acts.push(
      { action: 'set_comfort', key: 'medium' },
      { action: 'set_duration', key: 'normal' },
      { action: 'set_locomotion', key: 'smooth' },
      { action: 'set_effects', bloom: true, vignette: 'soft' },
      { action: 'set_particles', density: 'medium' },
      { action: 'set_audio', key: 'soft' },
    );
  }

  if (typeof input.ssqLevel === 'number') {
    if (input.ssqLevel >= 3) {
      acts.push({ action: 'fallback_2d_next', enabled: true });
      acts.push(
        { action: 'set_comfort', key: 'very_low' },
        { action: 'set_locomotion', key: 'teleport' },
        { action: 'set_fov', key: 'narrow' },
        { action: 'set_effects', bloom: false, vignette: 'comfort' },
        { action: 'set_particles', density: 'low' },
        { action: 'set_audio', key: 'calm' },
      );
    } else if (input.ssqLevel === 2) {
      acts.push(
        { action: 'set_comfort', key: 'low' },
        { action: 'set_locomotion', key: 'teleport' },
        { action: 'set_fov', key: 'narrow' },
        { action: 'set_effects', bloom: false, vignette: 'comfort' },
      );
    }
  }

  if (typeof input.tensionLevel === 'number' && input.tensionLevel >= 3) {
    acts.push(
      { action: 'set_duration', key: 'short' },
      { action: 'set_guidance', key: 'long_exhale' },
      { action: 'set_particles', density: 'low' },
      { action: 'set_audio', key: 'calm' },
    );
  }

  return acts;
}
