// @ts-nocheck
import type { InstrumentCode, ScoringResult } from './types';
import { getCatalog } from './catalogs';

const SUMMARIES: Record<InstrumentCode, Record<0 | 1 | 2 | 3 | 4, string>> = {
  WHO5: {
    0: 'besoin de douceur',
    1: 'moment plus délicat',
    2: 'équilibre stable',
    3: 'bonne forme',
    4: 'très belle énergie',
  },
  STAI6: {
    0: 'grande sérénité',
    1: 'calme ressenti',
    2: 'état équilibré',
    3: 'tension présente',
    4: 'besoin d’apaisement',
  },
  SAM: {
    0: 'humeur difficile',
    1: 'tonalité plus basse',
    2: 'état mixte',
    3: 'bonne humeur',
    4: 'excellente forme',
  },
  SUDS: {
    0: 'grande tranquillité',
    1: 'sérénité',
    2: 'état neutre',
    3: 'tension élevée',
    4: 'détresse importante',
  },
};

const FOCUS_HINTS: Partial<Record<InstrumentCode, Partial<Record<0 | 1 | 2 | 3 | 4, string>>>> = {
  WHO5: {
    0: 'care_warm',
    1: 'care_checkin',
    4: 'care_celebrate',
  },
  STAI6: {
    3: 'calm_support',
    4: 'calm_grounding',
  },
  SAM: {
    0: 'mood_support',
    4: 'mood_celebrate',
  },
  SUDS: {
    3: 'distress_monitor',
    4: 'distress_support',
  },
};

export function computeLevel(
  instrument: InstrumentCode,
  answers: Record<string, number>,
): 0 | 1 | 2 | 3 | 4 {
  switch (instrument) {
    case 'WHO5': {
      const total = sumLikert(answers, { min: 0, max: 5 });
      if (total <= 12) return 0;
      if (total <= 16) return 1;
      if (total <= 20) return 2;
      if (total <= 23) return 3;
      return 4;
    }
    case 'STAI6': {
      const total = sumLikert(answers, { min: 1, max: 4 }, { reversed: ['1', '4', '5'] });
      if (total <= 10) return 0;
      if (total <= 15) return 1;
      if (total <= 20) return 2;
      if (total <= 23) return 3;
      return 4;
    }
    case 'SUDS': {
      const value = clamp(Number(answers['1'] ?? 0), 0, 10);
      return Math.min(4, Math.max(0, Math.floor(value / 2))) as 0 | 1 | 2 | 3 | 4;
    }
    case 'SAM': {
      const valence = clamp(Number(answers['1'] ?? 5), 1, 9);
      if (valence >= 8) return 4;
      if (valence >= 6) return 3;
      if (valence >= 4) return 2;
      if (valence >= 3) return 1;
      return 0;
    }
    default: {
      return 2;
    }
  }
}

export function summarize(instrument: InstrumentCode, level: 0 | 1 | 2 | 3 | 4): string {
  return SUMMARIES[instrument]?.[level] ?? 'état évalué';
}

export function scoreToJson(instrument: InstrumentCode, level: 0 | 1 | 2 | 3 | 4): ScoringResult {
  const version = getCatalog(instrument, 'fr').version;
  const summary = summarize(instrument, level);
  const focus = FOCUS_HINTS[instrument]?.[level];

  return {
    level,
    summary,
    instrument_version: version,
    generated_at: new Date().toISOString(),
    ...(focus ? { focus } : {}),
  };
}

function sumLikert(
  answers: Record<string, number>,
  range: { min: number; max: number },
  opts?: { reversed?: string[] },
): number {
  const { min, max } = range;
  const reversed = new Set(opts?.reversed ?? []);
  let total = 0;

  for (const [id, raw] of Object.entries(answers)) {
    let value = Number(raw);
    if (Number.isNaN(value)) continue;
    value = clamp(value, min, max);
    if (reversed.has(id)) {
      const span = max - min;
      value = max - (value - min);
      if (span === 0) {
        value = min;
      }
    }
    total += value;
  }

  return total;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
