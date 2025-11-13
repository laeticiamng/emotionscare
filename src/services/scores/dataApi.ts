// @ts-nocheck
import { addDays, addWeeks, differenceInCalendarDays, formatISO, getISOWeek, getISOWeekYear, startOfDay, startOfISOWeek, subDays, subWeeks } from 'date-fns';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';

export type VibeIntensity = 'light' | 'medium' | 'deep';
export type MoodPoint = { date: string; valence?: number; arousal?: number; vibe?: string };
export type WeeklySessionPoint = { week: string } & Record<string, number | string>;
export type VibePoint = {
  date: string;
  vibe?: string;
  intensity?: VibeIntensity;
  meta?: { count: number; total: number };
};

type EmotionScanRow = { created_at: string; payload: unknown };
type SessionRow = { created_at: string; type: string | null };

const MAX_MOOD_RANGE_DAYS = 30;

const VIBE_KEYWORDS: Record<string, VibePoint['vibe']> = {
  calm: 'calm',
  calme: 'calm',
  relax: 'calm',
  relaxed: 'calm',
  zen: 'calm',
  soothe: 'calm',
  focus: 'focus',
  focused: 'focus',
  concentration: 'focus',
  concentré: 'focus',
  motivé: 'focus',
  sharp: 'focus',
  bright: 'bright',
  joy: 'bright',
  joyful: 'bright',
  énergie: 'bright',
  energy: 'bright',
  uplift: 'bright',
  reset: 'reset',
  recharge: 'reset',
  reseted: 'reset',
  recuperation: 'reset',
};

const SCORE_FETCH_CATEGORY = 'scores';
const FETCH_START = 'scores:fetch:start';
const FETCH_SUCCESS = 'scores:fetch:success';
const FETCH_ERROR = 'scores:fetch:error';

export function smooth(series: Array<number | undefined>, window = 3): number[] {
  if (window <= 1) {
    return series.map(value => (typeof value === 'number' ? value : Number.NaN));
  }

  const radius = Math.floor(window / 2);
  return series.map((value, index) => {
    const start = Math.max(0, index - radius);
    const end = Math.min(series.length, index + radius + 1);
    const slice = series.slice(start, end).filter((entry): entry is number => typeof entry === 'number' && Number.isFinite(entry));
    if (slice.length === 0) {
      return Number.NaN;
    }
    const sum = slice.reduce((acc, current) => acc + current, 0);
    return sum / slice.length;
  });
}

export function mapMoodPoints(rows: EmotionScanRow[]): MoodPoint[] {
  return rows
    .reduce<MoodPoint[]>((acc, row) => {
      if (!row?.created_at) {
        return acc;
      }
      const date = new Date(row.created_at);
      if (Number.isNaN(date.getTime())) {
        return acc;
      }
      const payload = (row?.payload ?? {}) as Record<string, unknown>;
      const valenceRaw = payload?.valence;
      const arousalRaw = payload?.arousal;
      const labels = Array.isArray(payload?.labels) ? (payload?.labels as unknown[]) : [];
      const vibe = typeof labels[0] === 'string' ? normalizeVibe(labels[0]) : undefined;

      acc.push({
        date: formatISO(date, { representation: 'date' }),
        valence: typeof valenceRaw === 'number' && Number.isFinite(valenceRaw) ? clamp(valenceRaw, -1, 1) : undefined,
        arousal: typeof arousalRaw === 'number' && Number.isFinite(arousalRaw) ? clamp(arousalRaw, 0, 1) : undefined,
        vibe,
      });
      return acc;
    }, [])
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function aggregateWeeklySessions(rows: SessionRow[], weeks = 8): WeeklySessionPoint[] {
  const safeWeeks = Math.max(1, weeks);
  const byWeek = new Map<string, Record<string, number>>();

  rows.forEach(row => {
    if (!row?.created_at) {
      return;
    }
    const createdAt = new Date(row.created_at);
    if (Number.isNaN(createdAt.getTime())) {
      return;
    }
    const weekKey = formatIsoWeek(createdAt);
    const type = sanitizeSessionType(row.type);
    const bucket = byWeek.get(weekKey) ?? {};
    bucket[type] = (bucket[type] ?? 0) + 1;
    byWeek.set(weekKey, bucket);
  });

  const endOfWindow = startOfISOWeek(subWeeks(new Date(), 1));
  const startOfWindow = subWeeks(endOfWindow, safeWeeks - 1);
  const result: WeeklySessionPoint[] = [];

  for (let index = 0; index < safeWeeks; index += 1) {
    const weekDate = addWeeks(startOfWindow, index);
    const key = formatIsoWeek(weekDate);
    const counts = byWeek.get(key) ?? {};
    result.push({ week: key, ...counts });
  }

  return result;
}

export function buildHeatmap(days: EmotionScanRow[], totalDays = 7 * 8): VibePoint[] {
  const safeDays = Math.max(1, totalDays);
  const byDay = new Map<string, Record<string, number>>();

  days.forEach(row => {
    if (!row?.created_at) {
      return;
    }
    const date = startOfDay(new Date(row.created_at));
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const dayKey = formatISO(date, { representation: 'date' });
    const payload = (row?.payload ?? {}) as Record<string, unknown>;
    const labels = Array.isArray(payload?.labels) ? (payload.labels as unknown[]) : [];
    const vibe = typeof labels[0] === 'string' ? normalizeVibe(labels[0]) : undefined;
    if (!vibe) {
      return;
    }
    const bucket = byDay.get(dayKey) ?? {};
    bucket[vibe] = (bucket[vibe] ?? 0) + 1;
    byDay.set(dayKey, bucket);
  });

  const today = startOfDay(new Date());
  const start = subDays(today, safeDays - 1);
  const points: VibePoint[] = [];

  for (let offset = 0; offset < safeDays; offset += 1) {
    const current = addDays(start, offset);
    const key = formatISO(current, { representation: 'date' });
    const counts = byDay.get(key);
    if (counts) {
      const { vibe, count, total } = selectDominantVibe(counts);
      points.push({
        date: key,
        vibe,
        intensity: deriveIntensity(count, total),
        meta: { count, total },
      });
    } else {
      points.push({ date: key, vibe: undefined, intensity: undefined, meta: { count: 0, total: 0 } });
    }
  }

  return points;
}

export async function getMoodSeries30d(): Promise<MoodPoint[]> {
  const since = subDays(new Date(), MAX_MOOD_RANGE_DAYS - 1).toISOString();
  logBreadcrumb(FETCH_START, { resource: 'emotion_scans', range: '30d' });

  const { data, error } = await supabase
    .from('emotion_scans')
    .select('created_at, payload')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    logBreadcrumb(FETCH_ERROR, { resource: 'emotion_scans', code: error.code });
    throw error;
  }

  const points = mapMoodPoints((data ?? []) as EmotionScanRow[]);
  logBreadcrumb(FETCH_SUCCESS, { resource: 'emotion_scans', count: points.length });

  return points;
}

export async function getSessionsWeekly(weeks = 8): Promise<WeeklySessionPoint[]> {
  const safeWeeks = Math.max(1, weeks);
  const since = subWeeks(new Date(), safeWeeks).toISOString();
  logBreadcrumb(FETCH_START, { resource: 'sessions', weeks: safeWeeks });

  const { data, error } = await supabase
    .from('sessions')
    .select('created_at, type')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    logBreadcrumb(FETCH_ERROR, { resource: 'sessions', code: error.code });
    throw error;
  }

  const rows = aggregateWeeklySessions((data ?? []) as SessionRow[], safeWeeks);
  logBreadcrumb(FETCH_SUCCESS, { resource: 'sessions', count: rows.length });

  return rows;
}

export async function getVibesHeatmap(weeks = 8): Promise<VibePoint[]> {
  const safeWeeks = Math.max(1, weeks);
  const days = safeWeeks * 7;
  const since = subDays(new Date(), days - 1).toISOString();
  logBreadcrumb(FETCH_START, { resource: 'emotion_scans', weeks: safeWeeks, heatmap: true });

  const { data, error } = await supabase
    .from('emotion_scans')
    .select('created_at, payload')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    logBreadcrumb(FETCH_ERROR, { resource: 'emotion_scans', code: error.code, heatmap: true });
    throw error;
  }

  const result = buildHeatmap((data ?? []) as EmotionScanRow[], days);
  logBreadcrumb(FETCH_SUCCESS, { resource: 'emotion_scans', count: result.length, heatmap: true });

  return result;
}

function normalizeVibe(raw: string): VibePoint['vibe'] {
  const normalized = raw.trim().toLowerCase();
  if (VIBE_KEYWORDS[normalized]) {
    return VIBE_KEYWORDS[normalized];
  }

  const keyword = Object.keys(VIBE_KEYWORDS).find(key => normalized.includes(key));
  return keyword ? VIBE_KEYWORDS[keyword] : undefined;
}

function sanitizeSessionType(type: string | null | undefined): string {
  if (!type) {
    return 'autre';
  }
  return type.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
}

function formatIsoWeek(date: Date): string {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function selectDominantVibe(counts: Record<string, number>): { vibe?: VibePoint['vibe']; count: number; total: number } {
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const [topVibe, topCount] = sorted[0] ?? [undefined, 0];
  const total = Object.values(counts).reduce((acc, value) => acc + value, 0);
  return { vibe: topVibe as VibePoint['vibe'], count: topCount ?? 0, total };
}

function deriveIntensity(count: number, total: number): VibeIntensity | undefined {
  if (!count || !total) {
    return undefined;
  }
  const ratio = total === 0 ? 0 : count / total;
  if (ratio >= 0.66) {
    return 'deep';
  }
  if (ratio >= 0.33) {
    return 'medium';
  }
  return 'light';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function logBreadcrumb(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category: SCORE_FETCH_CATEGORY,
    message,
    data,
    level: message === FETCH_ERROR ? 'error' : 'info',
  });
}

export function hasMeaningfulMood(points: MoodPoint[]): boolean {
  return points.some(point => typeof point.valence === 'number' || typeof point.arousal === 'number');
}

export function hasAnySessions(rows: WeeklySessionPoint[]): boolean {
  return rows.some(row => Object.keys(row).some(key => key !== 'week' && Number(row[key]) > 0));
}

export function hasAnyVibes(points: VibePoint[]): boolean {
  return points.some(point => Boolean(point.vibe));
}

export function computeSeriesSummary(points: MoodPoint[]) {
  if (points.length === 0) {
    return { rangeDays: 0, vibeShare: {} as Record<string, number> };
  }

  const firstDate = new Date(points[0].date);
  const lastDate = new Date(points[points.length - 1].date);
  const rangeDays = Math.max(1, differenceInCalendarDays(lastDate, firstDate) + 1);

  const vibeCounter = points.reduce<Record<string, number>>((acc, point) => {
    if (point.vibe) {
      acc[point.vibe] = (acc[point.vibe] ?? 0) + 1;
    }
    return acc;
  }, {});

  return { rangeDays, vibeShare: vibeCounter };
}

