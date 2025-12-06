// @ts-nocheck
import { defaultBreathProfile, defaultGalaxyProfile, type VRBreathProfile, type VRGalaxyProfile } from './types';
import type { VRActions as BreathActions } from './vrBreath.orchestrator';
import type { VRActions as GalaxyActions } from './vrGalaxy.orchestrator';

export const deriveBreathProfile = (actions: BreathActions[]): VRBreathProfile => {
  const profile: VRBreathProfile = { ...defaultBreathProfile };

  actions.forEach((action) => {
    switch (action.action) {
      case 'set_comfort':
        profile.comfort = action.key;
        break;
      case 'set_duration':
        profile.duration = action.key;
        break;
      case 'set_locomotion':
        profile.locomotion = action.key;
        break;
      case 'set_fov':
        profile.fov = action.key;
        break;
      case 'set_effects':
        profile.bloom = action.bloom;
        profile.vignette = action.vignette;
        break;
      case 'set_particles':
        profile.particles = action.density;
        break;
      case 'set_audio':
        profile.audio = action.key;
        break;
      case 'set_guidance':
        profile.guidance = action.key;
        break;
      case 'fallback_2d_next':
        profile.fallback2dNext = action.enabled;
        break;
      default:
        break;
    }
  });

  return profile;
};

export const deriveGalaxyProfile = (actions: GalaxyActions[]): VRGalaxyProfile => {
  const profile: VRGalaxyProfile = { ...defaultGalaxyProfile };

  actions.forEach((action) => {
    switch (action.action) {
      case 'set_comfort':
        profile.comfort = action.key;
        break;
      case 'set_duration':
        profile.duration = action.key;
        break;
      case 'set_locomotion':
        profile.locomotion = action.key;
        break;
      case 'set_fov':
        profile.fov = action.key;
        break;
      case 'set_effects':
        profile.bloom = action.bloom;
        profile.vignette = action.vignette;
        break;
      case 'set_particles':
        profile.particles = action.density;
        break;
      case 'set_audio':
        profile.audio = action.key;
        break;
      case 'set_guidance':
        profile.guidance = action.key;
        break;
      case 'fallback_2d_next':
        profile.fallback2dNext = action.enabled;
        break;
      case 'set_navigation':
        profile.navigation = action.speed;
        break;
      case 'set_stars':
        profile.stellarDensity = action.density;
        break;
      default:
        break;
    }
  });

  return profile;
};
