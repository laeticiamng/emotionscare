import { mapMoodToVibe, type MoodVibe } from "@/utils/moodVibes";

export interface MoodPalette {
  /** Accent principal appliqué aux éléments dynamiques */
  base: string;
  /** Surface douce pour les panneaux de résumé */
  surface: string;
  /** Lueur utilisée pour les dégradés */
  glow: string;
  /** Couleur du texte adaptée à la surface */
  text: string;
  /** Trait léger pour rappeler l'accent */
  border: string;
}

export interface MoodSignals {
  summary: string;
  microGesture: string;
  palette: MoodPalette;
  vibe: MoodVibe;
}

export interface MoodEventDetail extends MoodSignals {
  valence: number;
  arousal: number;
  timestamp: string;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const hslToHex = (h: number, s: number, l: number): string => {
  const hue = clamp(h, 0, 360);
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = chroma;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = chroma;
  } else if (hue < 180) {
    g = chroma;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = chroma;
  } else if (hue < 300) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  const toHex = (value: number) => {
    const channel = Math.round((value + m) * 255);
    return channel.toString(16).padStart(2, "0");
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const buildPalette = (valence: number, arousal: number): MoodPalette => {
  const normalizedValence = (clamp(valence, -100, 100) + 100) / 200; // 0..1
  const normalizedArousal = clamp(arousal, 0, 100) / 100; // 0..1

  const hue = Math.round(220 - normalizedValence * 150); // froid -> chaud
  const saturation = Math.round(45 + normalizedArousal * 35);
  const lightness = Math.round(60 - normalizedArousal * 18);

  const surfaceLightness = clamp(lightness + 18, 30, 92);
  const glowLightness = clamp(lightness + 10, 30, 88);

  const baseHsl = `hsl(${hue} ${saturation}% ${lightness}%)`;
  const surfaceHsl = `hsl(${hue} ${Math.max(32, saturation - 18)}% ${surfaceLightness}%)`;
  const glowHsl = `hsl(${(hue + 8) % 360} ${Math.min(96, saturation + 6)}% ${glowLightness}%)`;
  const borderHex = hslToHex(hue, saturation, clamp(lightness - 12, 12, 88));
  const textHex = lightness < 50 ? "#F8FAFC" : "#0F172A";

  return {
    base: baseHsl,
    surface: surfaceHsl,
    glow: glowHsl,
    text: textHex,
    border: borderHex,
  };
};

const describeMood = (valence: number, arousal: number): string => {
  const v = clamp(valence, -100, 100);
  const a = clamp(arousal, 0, 100);

  if (v > 55 && a > 65) {
    return "Belle humeur expansive";
  }

  if (v > 55) {
    return "Bonne humeur posée";
  }

  if (v > 20 && a > 65) {
    return "Dynamique volontaire";
  }

  if (v > 20 && a < 35) {
    return "Tranquillité vigilante";
  }

  if (v > 20) {
    return "Élan positif stable";
  }

  if (v >= -20 && a > 65) {
    return "Tension constructive";
  }

  if (v >= -20 && a < 35) {
    return "Zone de récupération";
  }

  if (v >= -20) {
    return "Ambiance équilibrée";
  }

  if (a > 65) {
    return "Charge émotionnelle à apaiser";
  }

  if (a < 35) {
    return "Tonalité douce à préserver";
  }

  return "Tonalité plus basse";
};

const recommendMicroGesture = (valence: number, arousal: number): string => {
  const v = clamp(valence, -100, 100);
  const a = clamp(arousal, 0, 100);

  if (v < -25 && a > 60) {
    return "Proposer une expiration longue avec les épaules qui se relâchent.";
  }

  if (v < -25 && a < 40) {
    return "Inviter à poser une main sur le cœur et respirer calmement.";
  }

  if (v > 55 && a > 65) {
    return "Suggérer une mini danse ou secouer les poignets.";
  }

  if (v > 55) {
    return "Encourager un sourire doux et un étirement latéral.";
  }

  if (a > 70) {
    return "Rouler les épaules en conscience pour libérer la tension.";
  }

  if (a < 35) {
    return "Étirer doucement la nuque et laisser la mâchoire se détendre.";
  }

  return "Proposer trois respirations alignées, épaules détendues.";
};

export const buildMoodSignals = (valence: number, arousal: number): MoodSignals => {
  const vibe = mapMoodToVibe(valence, arousal);

  return {
    summary: describeMood(valence, arousal),
    microGesture: recommendMicroGesture(valence, arousal),
    palette: buildPalette(valence, arousal),
    vibe,
  };
};
