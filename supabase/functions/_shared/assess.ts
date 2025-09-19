import { z } from './zod.ts';

type Locale = 'fr' | 'en';
export const SUPPORTED_INSTRUMENTS = ['WHO5', 'STAI6', 'PANAS'] as const;
export type Instrument = typeof SUPPORTED_INSTRUMENTS[number];

export interface CatalogItem {
  id: string;
  text: string;
  scale?: string[];
}

interface InstrumentCatalog {
  version: string;
  items: CatalogItem[];
}

type CatalogDictionary = Record<Instrument, Record<Locale, InstrumentCatalog>>;

const LIKERT_FIVE_FR = ['Jamais', 'Parfois', 'Souvent', 'Très souvent', 'Toujours'];
const LIKERT_FIVE_EN = ['Never', 'Sometimes', 'Often', 'Very often', 'Always'];

const CATALOG: CatalogDictionary = {
  WHO5: {
    fr: {
      version: '1.0.0',
      items: [
        { id: 'w1', text: 'Je me suis senti(e) joyeux(se) et de bonne humeur.', scale: LIKERT_FIVE_FR },
        { id: 'w2', text: 'Je me suis senti(e) calme et détendu(e).', scale: LIKERT_FIVE_FR },
        { id: 'w3', text: 'J’ai eu le sentiment d’être plein(e) d’énergie.', scale: LIKERT_FIVE_FR },
        { id: 'w4', text: 'Mon quotidien m’a paru enrichissant.', scale: LIKERT_FIVE_FR },
        { id: 'w5', text: 'Je me suis senti(e) investi(e) dans ce que je faisais.', scale: LIKERT_FIVE_FR },
      ],
    },
    en: {
      version: '1.0.0',
      items: [
        { id: 'w1', text: 'I felt cheerful and in good spirits.', scale: LIKERT_FIVE_EN },
        { id: 'w2', text: 'I felt calm and relaxed.', scale: LIKERT_FIVE_EN },
        { id: 'w3', text: 'I felt active and vigorous.', scale: LIKERT_FIVE_EN },
        { id: 'w4', text: 'I woke up feeling fresh and rested.', scale: LIKERT_FIVE_EN },
        { id: 'w5', text: 'My daily life felt filled with things that interest me.', scale: LIKERT_FIVE_EN },
      ],
    },
  },
  STAI6: {
    fr: {
      version: '1.0.0',
      items: [
        { id: 's1', text: 'Je me sens tendu(e).', scale: LIKERT_FIVE_FR },
        { id: 's2', text: 'Je me sens à l’aise.', scale: LIKERT_FIVE_FR },
        { id: 's3', text: 'Je me sens contrarié(e).', scale: LIKERT_FIVE_FR },
        { id: 's4', text: 'Je me sens détendu(e).', scale: LIKERT_FIVE_FR },
        { id: 's5', text: 'Je me sens inquiet(e).', scale: LIKERT_FIVE_FR },
        { id: 's6', text: 'Je me sens content(e).', scale: LIKERT_FIVE_FR },
      ],
    },
    en: {
      version: '1.0.0',
      items: [
        { id: 's1', text: 'I feel tense.', scale: LIKERT_FIVE_EN },
        { id: 's2', text: 'I feel at ease.', scale: LIKERT_FIVE_EN },
        { id: 's3', text: 'I feel upset.', scale: LIKERT_FIVE_EN },
        { id: 's4', text: 'I feel relaxed.', scale: LIKERT_FIVE_EN },
        { id: 's5', text: 'I feel worried.', scale: LIKERT_FIVE_EN },
        { id: 's6', text: 'I feel content.', scale: LIKERT_FIVE_EN },
      ],
    },
  },
  PANAS: {
    fr: {
      version: '1.0.0',
      items: [
        { id: 'p1', text: 'Intéressé(e)', scale: LIKERT_FIVE_FR },
        { id: 'p2', text: 'Effrayé(e)', scale: LIKERT_FIVE_FR },
        { id: 'p3', text: 'Enthousiaste', scale: LIKERT_FIVE_FR },
        { id: 'p4', text: 'Nerveux(se)', scale: LIKERT_FIVE_FR },
        { id: 'p5', text: 'Fier(ère)', scale: LIKERT_FIVE_FR },
        { id: 'p6', text: 'Agacé(e)', scale: LIKERT_FIVE_FR },
        { id: 'p7', text: 'Inspiré(e)', scale: LIKERT_FIVE_FR },
        { id: 'p8', text: 'Effondré(e)', scale: LIKERT_FIVE_FR },
        { id: 'p9', text: 'Déterminé(e)', scale: LIKERT_FIVE_FR },
        { id: 'p10', text: 'Coupable', scale: LIKERT_FIVE_FR },
      ],
    },
    en: {
      version: '1.0.0',
      items: [
        { id: 'p1', text: 'Interested', scale: LIKERT_FIVE_EN },
        { id: 'p2', text: 'Afraid', scale: LIKERT_FIVE_EN },
        { id: 'p3', text: 'Enthusiastic', scale: LIKERT_FIVE_EN },
        { id: 'p4', text: 'Nervous', scale: LIKERT_FIVE_EN },
        { id: 'p5', text: 'Proud', scale: LIKERT_FIVE_EN },
        { id: 'p6', text: 'Irritable', scale: LIKERT_FIVE_EN },
        { id: 'p7', text: 'Inspired', scale: LIKERT_FIVE_EN },
        { id: 'p8', text: 'Distressed', scale: LIKERT_FIVE_EN },
        { id: 'p9', text: 'Determined', scale: LIKERT_FIVE_EN },
        { id: 'p10', text: 'Ashamed', scale: LIKERT_FIVE_EN },
      ],
    },
  },
};

export const instrumentSchema = z.enum(SUPPORTED_INSTRUMENTS);
export const localeSchema = z.enum(['fr', 'en']).default('fr');

export function getCatalog(instrument: Instrument, locale: Locale = 'fr') {
  const catalog = CATALOG[instrument]?.[locale];
  if (!catalog) {
    throw new Response('Unknown instrument', { status: 422 });
  }
  return {
    instrument,
    locale,
    version: catalog.version,
    items: catalog.items,
  };
}

function toLikertValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 4 : 1;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    const mapping: Record<string, number> = {
      'jamais': 0,
      'rarement': 1,
      'parfois': 2,
      'souvent': 3,
      'très souvent': 4,
      'toujours': 4,
      'never': 0,
      'rarely': 1,
      'sometimes': 2,
      'often': 3,
      'very often': 4,
      'always': 4,
      'pas du tout': 0,
      'un peu': 1,
      'modérément': 2,
      'beaucoup': 3,
      'extrêmement': 4,
      'not at all': 0,
      'a little': 1,
      'moderately': 2,
      'quite a bit': 3,
      'extremely': 4,
      'oui': 3,
      'non': 1,
      'yes': 3,
      'no': 1,
      'true': 3,
      'false': 1,
    };
    if (normalized in mapping) {
      return mapping[normalized];
    }
  }
  return null;
}

function computeAverage(values: Array<number | null | undefined>): number | null {
  const filtered = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  if (!filtered.length) {
    return null;
  }
  const total = filtered.reduce((acc, value) => acc + value, 0);
  return total / filtered.length;
}

function describeLevel(level: number | null, thresholds: [number, string][], fallback: string): string {
  if (typeof level !== 'number' || !Number.isFinite(level)) {
    return fallback;
  }
  for (const [threshold, label] of thresholds) {
    if (level >= threshold) {
      return label;
    }
  }
  return fallback;
}

function summarizeWho5(answers: Record<string, unknown>) {
  const values = ['w1', 'w2', 'w3', 'w4', 'w5'].map((id) => toLikertValue(answers[id]));
  const average = computeAverage(values);
  const summary = describeLevel(
    average,
    [
      [3.2, 'bien-être perçu élevé sur la période.'],
      [2.2, 'bien-être global stable avec plusieurs signaux positifs.'],
    ],
    'signaux de fatigue émotionnelle à accompagner.',
  );
  const focus = average && average >= 3.2
    ? 'Énergie et humeur restent nourries au quotidien.'
    : average && average >= 2.2
      ? 'Des ressources sont présentes, continuer les routines qui soutiennent.'
      : 'Un accompagnement doux peut aider à retrouver de l’élan.';
  return {
    summary,
    focus,
  };
}

function summarizeStai6(answers: Record<string, unknown>) {
  const tensionItems = ['s1', 's3', 's5'];
  const apaisementItems = ['s2', 's4', 's6'];
  const tension = computeAverage(tensionItems.map((id) => toLikertValue(answers[id])));
  const apaisement = computeAverage(apaisementItems.map((id) => toLikertValue(answers[id])));
  const balance = typeof tension === 'number' && typeof apaisement === 'number'
    ? tension - apaisement
    : null;

  let summary: string;
  let focus: string;
  if (typeof balance === 'number' && balance >= 0.8) {
    summary = 'tension ressentie marquée, besoin de sécuriser le quotidien.';
    focus = 'Prioriser les respirations et micro-pauses apaisantes.';
  } else if (typeof balance === 'number' && balance <= -0.4) {
    summary = 'niveau d’apaisement satisfaisant et stabilisé.';
    focus = 'Conserver les routines qui soutiennent cette sérénité.';
  } else {
    summary = 'sensibilité à l’anxiété ponctuelle mais régulée.';
    focus = 'Renforcer les repères rassurants dans la journée.';
  }

  return { summary, focus };
}

const PANAS_POSITIVE = new Set<string>(['p1', 'p3', 'p5', 'p7', 'p9']);
const PANAS_NEGATIVE = new Set<string>(['p2', 'p4', 'p6', 'p8', 'p10']);

function summarizePanas(answers: Record<string, unknown>) {
  const positiveValues: number[] = [];
  const negativeValues: number[] = [];

  for (const [key, value] of Object.entries(answers)) {
    const normalized = key.toLowerCase();
    if (PANAS_POSITIVE.has(normalized)) {
      const likert = toLikertValue(value);
      if (typeof likert === 'number') {
        positiveValues.push(likert);
      }
    }
    if (PANAS_NEGATIVE.has(normalized)) {
      const likert = toLikertValue(value);
      if (typeof likert === 'number') {
        negativeValues.push(likert);
      }
    }
  }

  const positiveAvg = computeAverage(positiveValues as Array<number | null | undefined>);
  const negativeAvg = computeAverage(negativeValues as Array<number | null | undefined>);
  const balance = typeof positiveAvg === 'number' && typeof negativeAvg === 'number'
    ? positiveAvg - negativeAvg
    : null;

  let summary: string;
  let focus: string;
  if (typeof balance === 'number' && balance >= 0.6) {
    summary = 'affect positif dominant et stable.';
    focus = 'S’appuyer sur cette dynamique pour partager de l’énergie autour de soi.';
  } else if (typeof balance === 'number' && balance <= -0.3) {
    summary = 'affect négatif présent, besoin de réassurance.';
    focus = 'Inviter des activités ressources ou un échange soutenant.';
  } else {
    summary = 'équilibre émotionnel nuancé et en évolution.';
    focus = 'Observer les moments qui nourrissent le positif pour les reproduire.';
  }

  return { summary, focus };
}

export interface AssessmentSummary {
  summary: string;
  focus: string;
}

export function summarizeAssessment(instrument: Instrument, answers: Record<string, unknown>): AssessmentSummary {
  switch (instrument) {
    case 'WHO5':
      return summarizeWho5(answers);
    case 'STAI6':
      return summarizeStai6(answers);
    case 'PANAS':
      return summarizePanas(answers);
    default:
      throw new Response('Unknown instrument', { status: 422 });
  }
}

export function sanitizeAggregateText(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(/\d+/g, '•').replace(/\s{2,}/g, ' ').trim();
}

export function normalizeInstrument(value: string): Instrument {
  const normalized = value.trim().toUpperCase();
  if (SUPPORTED_INSTRUMENTS.includes(normalized as Instrument)) {
    return normalized as Instrument;
  }
  throw new Response('Unknown instrument', { status: 422 });
}
