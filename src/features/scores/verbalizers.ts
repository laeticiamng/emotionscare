import { addDays, addWeeks, format, parseISO, startOfISOWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

import type { MoodPoint, VibeIntensity, VibePoint, WeeklySessionPoint } from '@/services/scores/dataApi';

export type MoodToneId = 'cotonneux' | 'calme' | 'posé' | 'actif' | 'éveillé';

export interface MoodVerbalPoint {
  date: string;
  dayLabel: string;
  longLabel: string;
  toneId: MoodToneId;
  toneLabel: string;
  nuance: string;
  value: number;
}

interface MoodToneDescriptor {
  label: string;
  color: string;
  baseline: string;
  value: number;
}

const MOOD_TONE_DESCRIPTORS: Record<MoodToneId, MoodToneDescriptor> = {
  cotonneux: {
    label: 'cotonneux',
    color: '#c4b5fd',
    baseline: 'moments feutrés, tournés vers soi',
    value: 1,
  },
  calme: {
    label: 'calme',
    color: '#38bdf8',
    baseline: 'respiration régulière et douce',
    value: 2,
  },
  posé: {
    label: 'posé',
    color: '#4ade80',
    baseline: 'équilibre rassurant et ancré',
    value: 3,
  },
  actif: {
    label: 'actif',
    color: '#facc15',
    baseline: 'élan tonique mais maîtrisé',
    value: 4,
  },
  éveillé: {
    label: 'éveillé',
    color: '#fb7185',
    baseline: 'énergie lumineuse et expansive',
    value: 5,
  },
};

const VIBE_INTENSITY_LABELS: Record<VibeIntensity, string> = {
  light: 'nuance douce',
  medium: 'nuance présente',
  deep: 'nuance intense',
};

export interface VibeDescriptor {
  key: string;
  label: string;
  description: string;
  palette: Record<VibeIntensity, string>;
}

export const VIBE_DESCRIPTORS: Record<string, VibeDescriptor> = {
  calm: {
    key: 'calm',
    label: 'posé',
    description: 'ancrage tranquille',
    palette: {
      light: '#bbf7d0',
      medium: '#34d399',
      deep: '#047857',
    },
  },
  focus: {
    key: 'focus',
    label: 'focalisé',
    description: 'attention concentrée',
    palette: {
      light: '#bae6fd',
      medium: '#0ea5e9',
      deep: '#0369a1',
    },
  },
  bright: {
    key: 'bright',
    label: 'lumineux',
    description: 'élan joyeux',
    palette: {
      light: '#fed7aa',
      medium: '#f97316',
      deep: '#c2410c',
    },
  },
  reset: {
    key: 'reset',
    label: 'régénérant',
    description: 'mise à zéro réparatrice',
    palette: {
      light: '#e9d5ff',
      medium: '#a855f7',
      deep: '#6b21a8',
    },
  },
};

export function getMoodToneDescriptor(tone: MoodToneId): MoodToneDescriptor {
  return MOOD_TONE_DESCRIPTORS[tone];
}

export function getMoodToneColor(tone: MoodToneId): string {
  return MOOD_TONE_DESCRIPTORS[tone].color;
}

const SESSION_LABELS: Record<string, string> = {
  breath: 'Respiration guidée',
  breathwork: 'Respiration guidée',
  flashglow: 'Flash Glow',
  music: 'Musique immersive',
  journal: 'Écriture',
  vr: 'Exploration VR',
  autre: 'Autres pratiques',
};

export interface SessionVerbalRow extends WeeklySessionPoint {
  weekKey: string;
  axisLabel: string;
  longLabel: string;
  total: number;
  rhythm: string;
  highlights: string[];
}

export function buildMoodVerbalSeries(points: MoodPoint[]): MoodVerbalPoint[] {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(point => {
      const date = safeParseDate(point.date);
      const toneId = resolveMoodTone(point);
      const descriptor = MOOD_TONE_DESCRIPTORS[toneId];
      const valence = typeof point.valence === 'number' ? point.valence : 0;
      const arousal = typeof point.arousal === 'number' ? point.arousal : 0.5;

      return {
        date: point.date,
        toneId,
        toneLabel: descriptor.label,
        nuance: describeMoodNuance(toneId, valence, arousal),
        value: descriptor.value,
        dayLabel: date ? format(date, 'd MMM', { locale: fr }) : point.date,
        longLabel: date ? format(date, "EEEE d MMMM", { locale: fr }) : point.date,
      } satisfies MoodVerbalPoint;
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function summarizeMoodVerbalSeries(series: MoodVerbalPoint[]): string {
  if (!series.length) {
    return 'Humeur en attente de nouveaux scans.';
  }

  const ranking = series.reduce<Record<MoodToneId, number>>((acc, point) => {
    acc[point.toneId] = (acc[point.toneId] ?? 0) + 1;
    return acc;
  }, {} as Record<MoodToneId, number>);

  const ordered = Object.entries(ranking).sort(([, a], [, b]) => b - a) as Array<[MoodToneId, number]>;
  if (!ordered.length) {
    return 'Ambiance stable et discrète.';
  }

  const [primary] = ordered[0];
  const secondary = ordered[1]?.[0];
  const mainLabel = capitalize(MOOD_TONE_DESCRIPTORS[primary].label);

  if (secondary) {
    const secondaryLabel = MOOD_TONE_DESCRIPTORS[secondary].label;
    return `Ambiance surtout ${mainLabel}, avec des touches ${secondaryLabel}.`;
  }

  return `Ambiance surtout ${mainLabel}.`;
}

export function buildSessionVerbalRows(rows: WeeklySessionPoint[]): SessionVerbalRow[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map(row => {
    const counts = Object.entries(row)
      .filter(([key, value]) => key !== 'week' && typeof value === 'number')
      .map(([key, value]) => ({ type: key, count: Number(value) }));

    const total = counts.reduce((acc, item) => acc + item.count, 0);
    const highlights = counts
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .map(item => describeSessionType(item.type));

    const { axisLabel, longLabel } = describeWeek(row.week);

    return {
      ...row,
      weekKey: row.week,
      axisLabel,
      longLabel,
      total,
      rhythm: describeSessionRhythm(total),
      highlights,
    } satisfies SessionVerbalRow;
  });
}

export function describeSessionRhythm(total: number): string {
  if (total <= 0) {
    return 'Semaine en pause douce.';
  }
  if (total <= 2) {
    return 'Quelques pratiques ponctuent la semaine.';
  }
  if (total <= 4) {
    return 'Rythme régulier et ancré.';
  }
  return 'Pratiques nombreuses et élan dynamique.';
}

export function describeSessionType(type: string): string {
  const sanitized = type.toLowerCase();
  if (SESSION_LABELS[sanitized]) {
    return SESSION_LABELS[sanitized];
  }
  return capitalize(type.replace(/[-_]/g, ' '));
}

export function describeVibe(vibe?: string) {
  if (!vibe) {
    return undefined;
  }
  return VIBE_DESCRIPTORS[vibe];
}

export function describeVibeIntensity(intensity: VibeIntensity | undefined): string {
  if (!intensity) {
    return 'nuance neutre';
  }
  return VIBE_INTENSITY_LABELS[intensity];
}

export function getVibeColor(vibe: string | undefined, intensity: VibeIntensity = 'medium'): string {
  const descriptor = vibe ? VIBE_DESCRIPTORS[vibe] : undefined;
  if (!descriptor) {
    return '#d1d5db';
  }
  return descriptor.palette[intensity] ?? descriptor.palette.medium;
}

export function buildHeatmapIntensity(point: VibePoint): VibeIntensity | undefined {
  if (point?.intensity) {
    return point.intensity as VibeIntensity;
  }

  const total = point?.meta?.total ?? 0;
  const count = point?.meta?.count ?? 0;
  const ratio = total === 0 ? 0 : count / total;

  if (ratio >= 0.66) {
    return 'deep';
  }
  if (ratio >= 0.33) {
    return 'medium';
  }
  if (ratio > 0) {
    return 'light';
  }
  return undefined;
}

function resolveMoodTone(point: MoodPoint): MoodToneId {
  const valence = typeof point.valence === 'number' ? point.valence : 0;
  const arousal = typeof point.arousal === 'number' ? point.arousal : 0.5;

  if (arousal <= 0.25) {
    return 'cotonneux';
  }
  if (arousal <= 0.45) {
    return valence >= 0 ? 'calme' : 'cotonneux';
  }
  if (arousal <= 0.65) {
    return valence >= 0.1 ? 'posé' : 'calme';
  }
  if (arousal <= 0.8) {
    return valence >= -0.2 ? 'actif' : 'cotonneux';
  }
  return valence >= 0 ? 'éveillé' : 'actif';
}

function describeMoodNuance(tone: MoodToneId, valence: number, arousal: number): string {
  switch (tone) {
    case 'cotonneux':
      return valence < -0.2 ? 'introspection feutrée' : 'pause en apesanteur';
    case 'calme':
      return valence >= 0 ? 'calme confiant' : 'calme en recherche';
    case 'posé':
      return valence >= 0.4 ? 'stabilité lumineuse' : 'équilibre délicat';
    case 'actif':
      return valence >= 0 ? 'élan organisé' : 'mouvement à apprivoiser';
    case 'éveillé':
      return arousal > 0.9 ? 'éveil pétillant' : 'éveil doux';
    default:
      return MOOD_TONE_DESCRIPTORS[tone].baseline;
  }
}

function describeWeek(weekKey: string | undefined) {
  if (!weekKey) {
    return { axisLabel: 'Semaine', longLabel: 'Semaine en cours' };
  }

  const [yearPart, weekPart] = weekKey.split('-W');
  const year = Number.parseInt(yearPart ?? '', 10);
  const week = Number.parseInt(weekPart ?? '', 10);

  if (Number.isNaN(year) || Number.isNaN(week)) {
    return { axisLabel: weekKey, longLabel: `Semaine ${weekKey}` };
  }

  const january4 = new Date(year, 0, 4);
  const firstWeekStart = startOfISOWeek(january4);
  const weekStart = addWeeks(firstWeekStart, Math.max(week - 1, 0));
  const weekEnd = addDays(weekStart, 6);

  return {
    axisLabel: `Sem. ${format(weekStart, 'd MMM', { locale: fr })}`,
    longLabel: `Semaine du ${format(weekStart, 'd MMMM', { locale: fr })} au ${format(weekEnd, 'd MMMM', {
      locale: fr,
    })}`,
  };
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function safeParseDate(value: string | Date | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
