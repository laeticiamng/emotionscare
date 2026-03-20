import type { AggregateSummary } from '@/services/b2b/reportsApi';

type NarrativeTone = 'posee' | 'tendue' | 'stable';

interface MonthlyNarrative {
  tone: NarrativeTone;
  headline: string;
  signals: string[];
  helpers: string[];
  actions: string[];
}

const POSITIVE_KEYWORDS = [
  'apais',
  'calme',
  'serein',
  'entraide',
  'soutien',
  'cooperation',
  'solidar',
  'elan',
  'enthousias',
  'motivat',
  'engag',
  'cohes',
];

const CARE_KEYWORDS = [
  'soutien',
  'partage',
  'rituel',
  'respir',
  'pause',
  'ecoute',
  'co-construction',
  'binome',
  'entraide',
  'celebr',
];

const CAUTION_KEYWORDS = [
  'stress',
  'tension',
  'tendu',
  'fragil',
  'fatigue',
  'epuis',
  'charge',
  'pression',
  'isolement',
  'solitude',
];

const FALLBACK_HELPERS = [
  'Les temps d\'écoute maintiennent un cadre rassurant.',
  'Les rituels partagés continuent d\'apaiser les journées.',
  'La coopération reste un point d\'appui apprécié.',
];

const FALLBACK_SIGNALS = [
  'Veiller à la circulation de la parole pour éviter les tensions discrètes.',
  'Rester attentif aux signes de fatigue évoqués à demi-mot.',
];

const FALLBACK_ACTIONS = [
  'Planifier un échange informel pour écouter l\'équipe en douceur.',
  'Rappeler que les pauses sont encouragées et partagées.',
];

interface ActionRule {
  keywords: string[];
  action: string;
}

const ACTION_RULES: ActionRule[] = [
  { keywords: ['fatigue', 'epuis'], action: 'Prévoir une pause respiration partagée en équipe.' },
  { keywords: ['tension', 'tendu', 'stress'], action: 'Ouvrir un check-in calme pour déposer ce qui pèse.' },
  { keywords: ['isolement', 'solitude'], action: 'Mettre en place un binôme de soutien bienveillant.' },
  { keywords: ['charge', 'pression'], action: 'Alléger la to-do en priorisant ensemble ce qui compte.' },
  { keywords: ['apais', 'calme'], action: 'Ancrer un rituel de respiration douce en début de réunion.' },
  { keywords: ['engag', 'elan', 'motivat'], action: 'Célébrer une petite victoire collective pour nourrir l’élan.' },
];

const TONE_HEADLINES: Record<NarrativeTone, string> = {
  posee: 'Période plutôt posée, les signaux restent souples et respirent.',
  tendue: 'Période plus tendue, on accueille les crispations avec douceur.',
  stable: 'Période stable, l’équilibre tient mais demande une présence attentive.',
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripDigits(text: string): string {
  return text.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
}

function splitSegments(text: string): string[] {
  const cleaned = text.replace(/•/g, '|');
  return cleaned
    .split('|')
    .flatMap(part => part.split(/[\.!?;]/g))
    .map(part => part.replace(/^[\s\-–•]+/, '').trim())
    .filter(Boolean)
    .map(segment => stripDigits(segment));
}

function unique(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  items.forEach(item => {
    const key = normalize(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item.trim());
    }
  });
  return result;
}

function scoreTone(segments: string[]): NarrativeTone {
  let score = 0;
  segments.forEach(segment => {
    const normalized = normalize(segment);
    if (POSITIVE_KEYWORDS.some(keyword => normalized.includes(keyword))) {
      score += 1;
    }
    if (CAUTION_KEYWORDS.some(keyword => normalized.includes(keyword))) {
      score -= 1;
    }
  });

  if (score >= 2) {
    return 'posee';
  }
  if (score <= -1) {
    return 'tendue';
  }
  return 'stable';
}

function pickSegments(segments: string[], keywords: string[], limit: number): string[] {
  const matches = segments.filter(segment => {
    const normalized = normalize(segment);
    return keywords.some(keyword => normalized.includes(keyword));
  });
  return unique(matches).slice(0, limit);
}

function deriveActionFromText(text: string): string {
  const normalized = normalize(text);
  const rule = ACTION_RULES.find(entry => entry.keywords.some(keyword => normalized.includes(keyword)));
  return rule ? rule.action : FALLBACK_ACTIONS[0];
}

export function generateMonthlyNarrative(summaries: AggregateSummary[]): MonthlyNarrative {
  const segments = summaries.flatMap(summary => splitSegments(summary.text));
  const tone = scoreTone(segments);

  const helpers = pickSegments(segments, [...POSITIVE_KEYWORDS, ...CARE_KEYWORDS], 3);
  const signals = pickSegments(segments, CAUTION_KEYWORDS, 2);

  const actions = unique(
    summaries
      .map(summary => summary.action && summary.action.trim().length > 0 ? stripDigits(summary.action) : deriveActionFromText(summary.text))
      .map(action => action.replace(/\s+/g, ' ').trim()),
  ).slice(0, 2);

  return {
    tone,
    headline: TONE_HEADLINES[tone],
    signals: signals.length > 0 ? signals : FALLBACK_SIGNALS.slice(0, 2),
    helpers: helpers.length > 0 ? helpers : FALLBACK_HELPERS.slice(0, 3),
    actions: actions.length > 0 ? actions : FALLBACK_ACTIONS.slice(0, 2),
  };
}

export type { MonthlyNarrative, NarrativeTone };
