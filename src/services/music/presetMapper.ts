// @ts-nocheck
const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export type AdaptivePresetId =
  | "calm_very_low"
  | "ambient_soft"
  | "focus_light"
  | "bright_mist";

export type AdaptiveIntensity = "feather" | "soft" | "balanced" | "glow";

export interface SamSnapshot {
  valence?: number | null;
  arousal?: number | null;
}

export interface PomsTrendSummary {
  tensionTrend?: "up" | "down" | "steady" | null;
  fatigueTrend?: "up" | "down" | "steady" | null;
  note?: string | null;
  completed?: boolean;
}

export interface PresetRecommendation {
  presetId: AdaptivePresetId;
  intensity: AdaptiveIntensity;
  crossfadeMs: number;
  narrative: string;
  cta?: "encore_2_min" | null;
  adjustments: {
    softenedForFatigue: boolean;
    extendedForTensionRelease: boolean;
    source: "sam" | "poms" | "mixed";
  };
}

interface BasePresetConfig {
  presetId: AdaptivePresetId;
  intensity: AdaptiveIntensity;
  crossfadeMs: number;
  narrative: string;
}

const BASE_PRESETS: Record<AdaptivePresetId, BasePresetConfig> = {
  calm_very_low: {
    presetId: "calm_very_low",
    intensity: "feather",
    crossfadeMs: 3600,
    narrative: "Un souffle quasi immobile qui berce doucement l'espace sonore.",
  },
  ambient_soft: {
    presetId: "ambient_soft",
    intensity: "soft",
    crossfadeMs: 2800,
    narrative: "Une nappe veloutée qui détend sans jamais écraser l'attention.",
  },
  focus_light: {
    presetId: "focus_light",
    intensity: "balanced",
    crossfadeMs: 2100,
    narrative: "Une pulsation légère et régulière qui soutient la concentration.",
  },
  bright_mist: {
    presetId: "bright_mist",
    intensity: "glow",
    crossfadeMs: 1600,
    narrative: "Un halo lumineux qui prolonge l'élan positif sans brusquer.",
  },
};

const NORMALIZE = (value: number | null | undefined, range: { min: number; max: number }, fallback: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return clamp(Math.round(value), range.min, range.max);
};

const normalizeValence = (valence: number | null | undefined): number => {
  if (typeof valence !== "number" || Number.isNaN(valence)) {
    return 50;
  }
  const clamped = clamp(valence, -100, 100);
  return Math.round(((clamped + 100) / 200) * 100);
};

const selectBasePreset = (sam: SamSnapshot): BasePresetConfig => {
  const arousal = NORMALIZE(sam.arousal, { min: 0, max: 100 }, 50);
  const valence = normalizeValence(sam.valence);

  if (arousal <= 25) {
    return BASE_PRESETS.calm_very_low;
  }

  if (arousal <= 45) {
    return BASE_PRESETS.ambient_soft;
  }

  if (arousal >= 78 && valence >= 60) {
    return BASE_PRESETS.bright_mist;
  }

  if (arousal >= 65) {
    return BASE_PRESETS.focus_light;
  }

  if (valence >= 72) {
    return BASE_PRESETS.bright_mist;
  }

  if (valence <= 35 && arousal >= 55) {
    return BASE_PRESETS.ambient_soft;
  }

  return BASE_PRESETS.ambient_soft;
};

export const mapStateToPreset = (
  sam: SamSnapshot,
  summary?: PomsTrendSummary | null,
): PresetRecommendation => {
  const base = selectBasePreset(sam);
  const result: PresetRecommendation = {
    presetId: base.presetId,
    intensity: base.intensity,
    crossfadeMs: base.crossfadeMs,
    narrative: base.narrative,
    cta: null,
    adjustments: {
      softenedForFatigue: false,
      extendedForTensionRelease: false,
      source: "sam",
    },
  };

  if (!summary) {
    return result;
  }

  const { fatigueTrend, tensionTrend } = summary;
  const fromPoms = fatigueTrend || tensionTrend;
  if (fromPoms) {
    result.adjustments.source = "mixed";
  }

  if (fatigueTrend === "up") {
    result.presetId = "calm_very_low";
    result.intensity = "feather";
    result.crossfadeMs = Math.max(result.crossfadeMs, BASE_PRESETS.calm_very_low.crossfadeMs);
    result.narrative =
      "On enveloppe la séance d'un nuage très doux pour apaiser la fatigue ressentie.";
    result.adjustments.softenedForFatigue = true;
  }

  if (tensionTrend === "down") {
    result.crossfadeMs = Math.min(result.crossfadeMs + 900, 5200);
    result.narrative = `${result.narrative} La transition se prolonge pour savourer cette détente.`;
    result.cta = "encore_2_min";
    result.adjustments.extendedForTensionRelease = true;
  }

  if (summary.note) {
    result.narrative = `${result.narrative} ${summary.note}`.trim();
  }

  if (!result.adjustments.softenedForFatigue && !result.adjustments.extendedForTensionRelease) {
    result.adjustments.source = fromPoms ? "poms" : "sam";
  }

  return result;
};

export default mapStateToPreset;
