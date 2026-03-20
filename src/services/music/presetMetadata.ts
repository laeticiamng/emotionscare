import type { AdaptiveIntensity, AdaptivePresetId } from "@/services/music/presetMapper";

export const PRESET_DETAILS: Record<
  AdaptivePresetId,
  { label: string; tone: string; accent: string }
> = {
  calm_very_low: {
    label: "Cocon feutré",
    tone: "Texture presque immobile pour s'abandonner totalement.",
    accent: "Les transitions restent aériennes et enveloppantes.",
  },
  ambient_soft: {
    label: "Brume velours",
    tone: "Ambiance souple qui chuchote et laisse respirer.",
    accent: "Le flux reste régulier, sans heurt.",
  },
  focus_light: {
    label: "Fil de clarté",
    tone: "Trame précise mais tendre pour guider les pensées.",
    accent: "La pulsation reste légère et stable.",
  },
  bright_mist: {
    label: "Halo lumineux",
    tone: "Éclat doux pour prolonger la joie sans agitation.",
    accent: "L'énergie reste radieuse et fluide.",
  },
};

export const PRESET_TO_MOOD: Record<AdaptivePresetId, string> = {
  calm_very_low: "relaxed",
  ambient_soft: "relaxed",
  focus_light: "focus",
  bright_mist: "joyful",
};

export const INTENSITY_TO_VALUE: Record<AdaptiveIntensity, number> = {
  feather: 0.25,
  soft: 0.4,
  balanced: 0.55,
  glow: 0.68,
};

export const INTENSITY_TEXT: Record<AdaptiveIntensity, string> = {
  feather: "Intensité plume, presque suspendue.",
  soft: "Intensité velours, tout en rondeur.",
  balanced: "Intensité fil de soie, tenue mais apaisée.",
  glow: "Intensité halo, rayonnante sans jamais forcer.",
};

export const describePresetChange = (
  presetId: AdaptivePresetId,
  intensity: AdaptiveIntensity,
): string => {
  const detail = PRESET_DETAILS[presetId];
  const intensityDetail = INTENSITY_TEXT[intensity];
  if (!detail || !intensityDetail) {
    return "Sélection musicale ajustée pour rester confortable.";
  }
  return `${detail.label}. ${intensityDetail}`;
};

