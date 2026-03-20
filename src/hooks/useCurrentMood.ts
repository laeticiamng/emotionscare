import { useMemo } from "react";

import { useMood } from "@/contexts/MoodContext";
import { getVibeEmoji, getVibeLabel, type MoodVibe } from "@/utils/moodVibes";
import type { MoodPalette } from "@/utils/moodSignals";

interface MoodDescriptor {
  title: string;
  description: string;
}

const VIBE_DESCRIPTIONS: Record<MoodVibe, MoodDescriptor> = {
  calm: {
    title: "Souffle paisible",
    description: "Un flux régulier et rassurant enveloppe la pièce.",
  },
  focus: {
    title: "Clarté attentive",
    description: "Une présence nette qui accompagne les pensées avec douceur.",
  },
  bright: {
    title: "Élan lumineux",
    description: "Une énergie positive et chaleureuse qui rayonne sans brusquer.",
  },
  reset: {
    title: "Cocon réparateur",
    description: "Une bulle protectrice qui invite au relâchement complet.",
  },
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export interface CurrentMoodSnapshot {
  vibe: MoodVibe;
  label: string;
  emoji: string;
  title: string;
  description: string;
  headline: string;
  valence: number | null;
  arousal: number | null;
  normalized: {
    valence: number;
    arousal: number;
  };
  updatedAt: string;
  isLoading: boolean;
  hasError: boolean;
  summary: string;
  microGesture: string;
  palette: MoodPalette;
}

export const useCurrentMood = (): CurrentMoodSnapshot => {
  const { currentMood } = useMood();

  const valence = Number.isFinite(currentMood.valence)
    ? (currentMood.valence as number)
    : null;
  const arousal = Number.isFinite(currentMood.arousal)
    ? (currentMood.arousal as number)
    : null;

  const normalized = useMemo(() => {
    const safeValence = valence ?? 0;
    const safeArousal = arousal ?? 50;
    const valencePercent = clamp(Math.round(((safeValence + 100) / 200) * 100), 0, 100);
    const arousalPercent = clamp(Math.round(safeArousal), 0, 100);
    return { valence: valencePercent, arousal: arousalPercent };
  }, [valence, arousal]);

  const descriptor = VIBE_DESCRIPTIONS[currentMood.vibe];

  const headline = useMemo(() => {
    if (valence === null || arousal === null) {
      return "Ambiance stable et enveloppante";
    }

    if (arousal < 25) {
      return "Tempo très doux pour accompagner le relâchement";
    }

    if (arousal < 45) {
      return "Cadence souple qui laisse de l'espace à la respiration";
    }

    if (valence > 50 && arousal > 60) {
      return "Belle dynamique, on prolonge cet élan lumineux";
    }

    if (valence < -30 && arousal > 60) {
      return "On adoucit le flux pour guider la décharge du stress";
    }

    return "Nous ajustons la texture pour rester dans le confort";
  }, [valence, arousal]);

  return {
    vibe: currentMood.vibe,
    label: getVibeLabel(currentMood.vibe),
    emoji: getVibeEmoji(currentMood.vibe),
    title: descriptor.title,
    description: descriptor.description,
    headline,
    valence,
    arousal,
    normalized,
    updatedAt: currentMood.timestamp,
    isLoading: currentMood.isLoading,
    hasError: Boolean(currentMood.error),
    summary: currentMood.summary,
    microGesture: currentMood.microGesture,
    palette: currentMood.palette,
  };
};

export default useCurrentMood;
