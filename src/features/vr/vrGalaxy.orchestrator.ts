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
  | { action: 'fallback_2d_next'; enabled: boolean }
  | { action: 'set_navigation'; speed: 'drift' | 'gentle' | 'cruise' }
  | { action: 'set_stars'; density: 'thin' | 'balanced' | 'lush' };

export function computeGalaxyActions(input: OrchestrationInputs): VRActions[] {
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
      { action: 'set_navigation', speed: 'drift' },
      { action: 'set_stars', density: 'thin' },
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
      { action: 'set_navigation', speed: 'gentle' },
      { action: 'set_stars', density: 'balanced' },
    );
  } else {
    acts.push(
      { action: 'set_comfort', key: 'medium' },
      { action: 'set_duration', key: 'normal' },
      { action: 'set_locomotion', key: 'smooth' },
      { action: 'set_effects', bloom: true, vignette: 'soft' },
      { action: 'set_particles', density: 'medium' },
      { action: 'set_audio', key: 'soft' },
      { action: 'set_navigation', speed: input.vrTier === 'high' ? 'cruise' : 'gentle' },
      { action: 'set_stars', density: input.vrTier === 'high' ? 'lush' : 'balanced' },
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
        { action: 'set_navigation', speed: 'drift' },
        { action: 'set_stars', density: 'thin' },
      );
    } else if (input.ssqLevel === 2) {
      acts.push(
        { action: 'set_comfort', key: 'low' },
        { action: 'set_locomotion', key: 'teleport' },
        { action: 'set_fov', key: 'narrow' },
        { action: 'set_effects', bloom: false, vignette: 'comfort' },
        { action: 'set_navigation', speed: 'gentle' },
      );
    }
  }

  if (typeof input.tensionLevel === 'number' && input.tensionLevel >= 3) {
    acts.push(
      { action: 'set_duration', key: 'short' },
      { action: 'set_particles', density: 'low' },
      { action: 'set_audio', key: 'calm' },
      { action: 'set_navigation', speed: 'drift' },
      { action: 'set_stars', density: 'thin' },
    );
  }

  return acts;
}
