export type VRTier = 'low' | 'mid' | 'high';

export type ComfortKey = 'very_low' | 'low' | 'medium';
export type DurationKey = 'short' | 'normal';
export type LocomotionKey = 'teleport' | 'smooth';
export type FovKey = 'narrow' | 'default';
export type AudioKey = 'calm' | 'soft';
export type GuidanceKey = 'long_exhale' | 'none';
export type VignetteKey = 'none' | 'soft' | 'comfort';
export type ParticleDensity = 'low' | 'medium' | 'high';

export interface VRProfileBase {
  comfort: ComfortKey;
  duration: DurationKey;
  locomotion: LocomotionKey;
  fov: FovKey;
  audio: AudioKey;
  guidance: GuidanceKey;
  vignette: VignetteKey;
  bloom: boolean;
  particles: ParticleDensity;
  fallback2dNext: boolean;
}

export interface VRBreathProfile extends VRProfileBase {
  module: 'vr_breath';
}

export interface VRGalaxyProfile extends VRProfileBase {
  module: 'vr_galaxy';
  navigation: 'drift' | 'gentle' | 'cruise';
  stellarDensity: 'thin' | 'balanced' | 'lush';
}

export type VRProfile = VRBreathProfile | VRGalaxyProfile;

export const defaultBreathProfile: VRBreathProfile = {
  module: 'vr_breath',
  comfort: 'medium',
  duration: 'normal',
  locomotion: 'smooth',
  fov: 'default',
  audio: 'soft',
  guidance: 'none',
  vignette: 'soft',
  bloom: true,
  particles: 'medium',
  fallback2dNext: false,
};

export const defaultGalaxyProfile: VRGalaxyProfile = {
  module: 'vr_galaxy',
  comfort: 'medium',
  duration: 'normal',
  locomotion: 'smooth',
  fov: 'default',
  audio: 'soft',
  guidance: 'none',
  vignette: 'soft',
  bloom: true,
  particles: 'medium',
  fallback2dNext: false,
  navigation: 'cruise',
  stellarDensity: 'lush',
};

export interface OrchestrationInputs {
  vrTier: VRTier;
  prm: boolean;
  ssqLevel?: 0 | 1 | 2 | 3 | 4;
  tensionLevel?: 0 | 1 | 2 | 3 | 4;
}

export interface DerivedProfileResult<TProfile extends VRProfile, TAction> {
  profile: TProfile;
  actions: TAction[];
}

export type MotionPreference = {
  prefersReducedMotion: boolean;
};
