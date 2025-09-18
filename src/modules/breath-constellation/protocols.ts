import type { Pattern, Phase } from "@/ui/hooks/useBreathPattern";

export type BreathProtocolId =
  | "coherence-5-5"
  | "4-7-8"
  | "box-4-4-4-4"
  | "triangle-4-6-8";

export interface BreathProtocolDefinition {
  id: BreathProtocolId;
  label: string;
  description: string;
  focus: string;
  benefits: string[];
  recommendedCycles: number;
  recommendedDensity: number;
  pattern: Pattern;
}

export interface BreathProtocol extends BreathProtocolDefinition {
  cycleDuration: number;
  cadence: number;
}

export const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Inspiration",
  hold: "Rétention pleine",
  exhale: "Expiration",
  hold2: "Rétention basse",
};

export const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  inhale: "Soulevez doucement la cage thoracique et remplissez vos poumons.",
  hold: "Suspendez la respiration, épaules relâchées.",
  exhale: "Relâchez l'air sans effort, videz complètement.",
  hold2: "Gardez les poumons vides dans le calme avant le prochain cycle.",
};

export const BREATH_PROTOCOL_DEFINITIONS: readonly BreathProtocolDefinition[] = [
  {
    id: "coherence-5-5",
    label: "Cohérence cardiaque 5-5",
    description: "6 respirations par minute pour réguler le système nerveux.",
    focus: "Équilibre & clarté",
    benefits: [
      "Stabilise la variabilité cardiaque",
      "Idéal pour une pause active ou avant une réunion",
    ],
    recommendedCycles: 10,
    recommendedDensity: 0.8,
    pattern: [
      { phase: "inhale", sec: 5 },
      { phase: "exhale", sec: 5 },
    ],
  },
  {
    id: "4-7-8",
    label: "Sommeil profond 4-7-8",
    description: "Allonge l'expiration pour apaiser le mental et préparer le repos.",
    focus: "Apaisement & lâcher-prise",
    benefits: [
      "Réduit rapidement la tension accumulée",
      "Facilite l'endormissement et calme les ruminations",
    ],
    recommendedCycles: 6,
    recommendedDensity: 0.7,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 7 },
      { phase: "exhale", sec: 8 },
    ],
  },
  {
    id: "box-4-4-4-4",
    label: "Carré 4-4-4-4",
    description: "Rythme symétrique pour la concentration et la préparation mentale.",
    focus: "Focus & préparation",
    benefits: [
      "Améliore la clarté d'esprit",
      "Structure la respiration avant un effort cognitif",
    ],
    recommendedCycles: 12,
    recommendedDensity: 0.9,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 4 },
      { phase: "exhale", sec: 4 },
      { phase: "hold2", sec: 4 },
    ],
  },
  {
    id: "triangle-4-6-8",
    label: "Triangle 4-6-8",
    description:
      "Progression douce vers une expiration allongée pour relâcher les tensions.",
    focus: "Décompression & ancrage",
    benefits: [
      "Déverrouille la respiration abdominale",
      "Idéal après une journée dense ou avant un soin",
    ],
    recommendedCycles: 9,
    recommendedDensity: 0.75,
    pattern: [
      { phase: "inhale", sec: 4 },
      { phase: "hold", sec: 6 },
      { phase: "exhale", sec: 8 },
    ],
  },
];

export const calculateCycleDuration = (pattern: Pattern): number =>
  pattern.reduce((total, step) => total + Math.max(0, step.sec), 0);

export const calculateCadence = (cycleDuration: number): number => {
  if (!Number.isFinite(cycleDuration) || cycleDuration <= 0) {
    return 0;
  }

  return Number.parseFloat((60 / cycleDuration).toFixed(2));
};

export const toProtocol = (definition: BreathProtocolDefinition): BreathProtocol => {
  const cycleDuration = calculateCycleDuration(definition.pattern);
  return {
    ...definition,
    cycleDuration,
    cadence: calculateCadence(cycleDuration),
  };
};

export const PROTOCOLS_BY_ID: Record<BreathProtocolId, BreathProtocol> =
  BREATH_PROTOCOL_DEFINITIONS.reduce<Record<BreathProtocolId, BreathProtocol>>(
    (acc, definition) => {
      acc[definition.id] = toProtocol(definition);
      return acc;
    },
    {} as Record<BreathProtocolId, BreathProtocol>,
  );

export const BREATH_PROTOCOL_SEQUENCE: BreathProtocol[] =
  BREATH_PROTOCOL_DEFINITIONS.map(definition => PROTOCOLS_BY_ID[definition.id]);

export const DEFAULT_PROTOCOL_ID: BreathProtocolId = "coherence-5-5";

