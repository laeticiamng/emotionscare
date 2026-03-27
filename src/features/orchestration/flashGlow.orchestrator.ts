// @ts-nocheck
export type FlashGlowVisualIntensity = 'baseline' | 'lowered';
export type FlashGlowBreathPattern = 'steady' | 'exhale_longer';
export type FlashGlowAudioFade = 'gentle' | 'slow';
export type FlashGlowHapticsSetting = 'default' | 'calm' | 'off';
export type FlashGlowPostCta = 'screen_silk';
export type FlashGlowToastText = 'gratitude';

export interface FlashGlowActions {
  extend_session?: number;
  soft_exit?: boolean;
  set_visuals_intensity?: FlashGlowVisualIntensity;
  set_breath_pattern?: FlashGlowBreathPattern;
  set_audio_fade?: FlashGlowAudioFade;
  set_haptics?: FlashGlowHapticsSetting;
  post_cta?: FlashGlowPostCta;
  toast_text?: FlashGlowToastText;
}

export interface ComputeFlashGlowActionsInput {
  preLevel?: number | null;
  postLevel?: number | null;
  prefersReducedMotion?: boolean;
  optedIn?: boolean;
}

const HIGH_THRESHOLD = 3;
const LOW_THRESHOLD = 1;
const EXTEND_DURATION_MS = 60_000;

export function computeFlashGlowActions(input: ComputeFlashGlowActionsInput): FlashGlowActions {
  const { preLevel, postLevel, prefersReducedMotion, optedIn = true } = input;
  const actions: FlashGlowActions = {};

  if (prefersReducedMotion) {
    actions.set_haptics = 'off';
    actions.set_visuals_intensity = 'lowered';
  }

  const canUseSudsSignals = optedIn !== false;

  if (canUseSudsSignals && typeof preLevel === 'number' && preLevel >= HIGH_THRESHOLD) {
    actions.set_visuals_intensity = 'lowered';
    actions.set_breath_pattern = 'exhale_longer';
    actions.set_audio_fade = 'slow';
    if (actions.set_haptics !== 'off') {
      actions.set_haptics = 'calm';
    }
  }

  if (canUseSudsSignals && typeof postLevel === 'number') {
    if (postLevel >= HIGH_THRESHOLD) {
      actions.extend_session = EXTEND_DURATION_MS;
    } else if (postLevel <= LOW_THRESHOLD) {
      actions.soft_exit = true;
      actions.toast_text = 'gratitude';
      actions.post_cta = 'screen_silk';
    } else {
      actions.post_cta = 'screen_silk';
    }
  }

  return actions;
}
