import { differenceInCalendarDays, getISOWeek, isAfter, parseISO, startOfISOWeek, subWeeks } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';
import { computeBalanceFromScores, deriveScore10 } from './emotionScan.service';

export interface MoodTrendPoint {
  date: string;
  mood: number;
  energy: number;
  annotation: string | null;
}

export interface WeeklySessionsPoint {
  week: string;
  guided: number;
  breathwork: number;
  vr: number;
  journaling: number;
  total: number;
}

export interface HeatmapPoint {
  day: string;
  slot: string;
  intensity: number;
  dominantMood: string;
  sessions: number;
}

export interface ScoresDashboardSummary {
  moodAverage: number;
  moodVariation: number;
  bestMoodDay: MoodTrendPoint | null;
  sessionsAverage: number;
  lastWeek: WeeklySessionsPoint | null;
  level: number;
  currentExperience: number;
  nextLevelExperience: number;
  levelProgress: number;
  streakDays: number;
  mostIntenseSlot: HeatmapPoint | null;
  totalSessions: number;
}

export interface ScoresDashboardData {
  moodTrend: MoodTrendPoint[];
  weeklySessions: WeeklySessionsPoint[];
  heatmap: HeatmapPoint[];
  summary: ScoresDashboardSummary;
  source: 'remote' | 'fallback';
}

type EmotionScanRow = Database['public']['Tables']['emotion_scans']['Row'];
type FlashGlowMetricRow = Database['public']['Tables']['metrics_flash_glow']['Row'];
type BreathworkSessionRow = Database['public']['Tables']['breathwork_sessions']['Row'];
type JournalEntryRow = Database['public']['Tables']['journal_entries']['Row'];
type MusicSessionRow = Database['public']['Tables']['music_sessions']['Row'];
type VrBreathMetricRow = Database['public']['Tables']['metrics_vr_breath']['Row'];
type VrGalaxyMetricRow = Database['public']['Tables']['metrics_vr_galaxy']['Row'];

type ScoreRecord = Record<string, number>;

type HeatmapBucket = {
  totalIntensity: number;
  sessions: number;
  dominantMood: string;
  topIntensity: number;
  lastTimestamp: number;
};

const FALLBACK_MOOD_TREND: MoodTrendPoint[] = [
  { date: '2024-03-17', mood: 6.2, energy: 6.0, annotation: 'Respiration 4-7-8' },
  { date: '2024-03-18', mood: 6.8, energy: 6.3, annotation: 'Séance VR focus' },
  { date: '2024-03-19', mood: 7.1, energy: 6.9, annotation: 'Coaching empathique' },
  { date: '2024-03-20', mood: 7.4, energy: 7.3, annotation: 'Routine complète' },
  { date: '2024-03-21', mood: 7.2, energy: 7.0, annotation: 'Journal guidé' },
  { date: '2024-03-22', mood: 7.9, energy: 7.6, annotation: 'Session immersive' },
  { date: '2024-03-23', mood: 8.2, energy: 7.8, annotation: 'Mix musique + respiration' },
  { date: '2024-03-24', mood: 8.4, energy: 8.2, annotation: 'Weekend ressourçant' },
  { date: '2024-03-25', mood: 8.1, energy: 8.0, annotation: 'Check-in matinal' },
  { date: '2024-03-26', mood: 8.6, energy: 8.4, annotation: 'Routine + appel coach' },
];

const FALLBACK_WEEKLY_SESSIONS: WeeklySessionsPoint[] = [
  { week: 'S08', guided: 2, breathwork: 1, vr: 0, journaling: 1, total: 4 },
  { week: 'S09', guided: 3, breathwork: 2, vr: 1, journaling: 1, total: 7 },
  { week: 'S10', guided: 3, breathwork: 2, vr: 2, journaling: 1, total: 8 },
  { week: 'S11', guided: 4, breathwork: 2, vr: 2, journaling: 2, total: 10 },
  { week: 'S12', guided: 4, breathwork: 3, vr: 2, journaling: 2, total: 11 },
  { week: 'S13', guided: 5, breathwork: 3, vr: 3, journaling: 2, total: 13 },
];

const FALLBACK_HEATMAP: HeatmapPoint[] = [
  { day: 'Lun', slot: 'Matin', intensity: 75, dominantMood: 'Apaisé', sessions: 2 },
  { day: 'Lun', slot: 'Midi', intensity: 48, dominantMood: 'Concentré', sessions: 1 },
  { day: 'Lun', slot: 'Après-midi', intensity: 62, dominantMood: 'Créatif', sessions: 1 },
  { day: 'Lun', slot: 'Soir', intensity: 40, dominantMood: 'Repos', sessions: 1 },
  { day: 'Mar', slot: 'Matin', intensity: 80, dominantMood: 'Positif', sessions: 2 },
  { day: 'Mar', slot: 'Midi', intensity: 55, dominantMood: 'Motivé', sessions: 1 },
  { day: 'Mar', slot: 'Après-midi', intensity: 68, dominantMood: 'Focus', sessions: 2 },
  { day: 'Mar', slot: 'Soir', intensity: 35, dominantMood: 'Calme', sessions: 1 },
  { day: 'Mer', slot: 'Matin', intensity: 72, dominantMood: 'Positif', sessions: 2 },
  { day: 'Mer', slot: 'Midi', intensity: 58, dominantMood: 'Engagé', sessions: 1 },
  { day: 'Mer', slot: 'Après-midi', intensity: 66, dominantMood: 'Concentré', sessions: 1 },
  { day: 'Mer', slot: 'Soir', intensity: 44, dominantMood: 'Déconnexion', sessions: 1 },
  { day: 'Jeu', slot: 'Matin', intensity: 84, dominantMood: 'Euphorique', sessions: 3 },
  { day: 'Jeu', slot: 'Midi', intensity: 62, dominantMood: 'Créatif', sessions: 1 },
  { day: 'Jeu', slot: 'Après-midi', intensity: 70, dominantMood: 'Confiant', sessions: 2 },
  { day: 'Jeu', slot: 'Soir', intensity: 50, dominantMood: 'Serein', sessions: 1 },
  { day: 'Ven', slot: 'Matin', intensity: 77, dominantMood: 'Motivé', sessions: 2 },
  { day: 'Ven', slot: 'Midi', intensity: 60, dominantMood: 'Concentré', sessions: 1 },
  { day: 'Ven', slot: 'Après-midi', intensity: 73, dominantMood: 'Inspiré', sessions: 2 },
  { day: 'Ven', slot: 'Soir', intensity: 52, dominantMood: 'Calme', sessions: 1 },
  { day: 'Sam', slot: 'Matin', intensity: 68, dominantMood: 'Détendu', sessions: 1 },
  { day: 'Sam', slot: 'Midi', intensity: 54, dominantMood: 'Curieux', sessions: 1 },
  { day: 'Sam', slot: 'Après-midi', intensity: 76, dominantMood: 'Enthousiaste', sessions: 2 },
  { day: 'Sam', slot: 'Soir', intensity: 64, dominantMood: 'Serein', sessions: 2 },
  { day: 'Dim', slot: 'Matin', intensity: 70, dominantMood: 'Positif', sessions: 1 },
  { day: 'Dim', slot: 'Midi', intensity: 46, dominantMood: 'Paisible', sessions: 1 },
  { day: 'Dim', slot: 'Après-midi', intensity: 58, dominantMood: 'Réflexif', sessions: 1 },
  { day: 'Dim', slot: 'Soir', intensity: 49, dominantMood: 'Repos', sessions: 1 },
];

export const SCORES_DASHBOARD_FALLBACK: ScoresDashboardData = {
  moodTrend: FALLBACK_MOOD_TREND,
  weeklySessions: FALLBACK_WEEKLY_SESSIONS,
  heatmap: FALLBACK_HEATMAP,
  summary: computeSummary(FALLBACK_MOOD_TREND, FALLBACK_WEEKLY_SESSIONS, FALLBACK_HEATMAP),
  source: 'fallback',
};

export async function fetchScoresDashboard(userId?: string): Promise<ScoresDashboardData> {
  if (!userId) {
    return SCORES_DASHBOARD_FALLBACK;
  }

  const thirtyDaysAgo = subWeeks(new Date(), 4);
  const eightWeeksAgo = subWeeks(new Date(), 8);

  const [scanResult, flashGlowResult, breathworkResult, journalResult, musicResult, vrBreathResult, vrGalaxyResult] = await Promise.all([
    supabase
      .from('emotion_scans')
      .select('created_at, emotional_balance, emotions, insights, summary, mood')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true }),
    supabase
      .from('metrics_flash_glow')
      .select('ts')
      .eq('user_id', userId)
      .gte('ts', eightWeeksAgo.toISOString()),
    supabase
      .from('breathwork_sessions')
      .select('created_at, technique_type, session_data')
      .eq('user_id', userId)
      .gte('created_at', eightWeeksAgo.toISOString()),
    supabase
      .from('journal_entries')
      .select('date, ai_feedback')
      .eq('user_id', userId)
      .gte('date', eightWeeksAgo.toISOString()),
    supabase
      .from('music_sessions')
      .select('created_at, mood_tag')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('metrics_vr_breath')
      .select('ts')
      .eq('user_id', userId)
      .gte('ts', eightWeeksAgo.toISOString()),
    supabase
      .from('metrics_vr_galaxy')
      .select('ts')
      .eq('user_id', userId)
      .gte('ts', eightWeeksAgo.toISOString()),
  ]);

  const scans = scanResult.data ?? [];
  const flashGlow = flashGlowResult.data ?? [];
  const breathwork = breathworkResult.data ?? [];
  const journal = journalResult.data ?? [];
  const music = musicResult.data ?? [];
  const vrBreath = vrBreathResult.data ?? [];
  const vrGalaxy = vrGalaxyResult.data ?? [];

  if (scanResult.error) {
    logger.warn('Unable to load emotion scans for scores dashboard', scanResult.error, 'scores.fetch');
  }
  if (flashGlowResult.error) {
    logger.warn('Unable to load Flash Glow metrics for scores dashboard', flashGlowResult.error, 'scores.fetch');
  }
  if (breathworkResult.error) {
    logger.warn('Unable to load breathwork sessions for scores dashboard', breathworkResult.error, 'scores.fetch');
  }
  if (journalResult.error) {
    logger.warn('Unable to load journal entries for scores dashboard', journalResult.error, 'scores.fetch');
  }
  if (musicResult.error) {
    logger.warn('Unable to load music sessions for scores dashboard', musicResult.error, 'scores.fetch');
  }
  if (vrBreathResult.error) {
    logger.warn('Unable to load VR breath metrics for scores dashboard', vrBreathResult.error, 'scores.fetch');
  }
  if (vrGalaxyResult.error) {
    logger.warn('Unable to load VR galaxy metrics for scores dashboard', vrGalaxyResult.error, 'scores.fetch');
  }

  const moodTrend = mapScansToTrend(scans);
  const weeklySessions = buildWeeklySessions(flashGlow, breathwork, vrBreath, vrGalaxy, journal);
  const heatmap = buildHeatmap(scans, flashGlow, breathwork, music, journal);

  const hasRemoteData =
    moodTrend.length > 0 ||
    weeklySessions.length > 0 ||
    heatmap.some(point => point.sessions > 0 && point.intensity > 0);

  const normalizedMoodTrend = moodTrend.length > 0 ? moodTrend : FALLBACK_MOOD_TREND;
  const normalizedWeeklySessions = weeklySessions.length > 0 ? weeklySessions : FALLBACK_WEEKLY_SESSIONS;
  const normalizedHeatmap = heatmap.some(point => point.sessions > 0 && point.intensity > 0)
    ? heatmap
    : FALLBACK_HEATMAP;

  const summary = computeSummary(normalizedMoodTrend, normalizedWeeklySessions, normalizedHeatmap);

  return {
    moodTrend: normalizedMoodTrend,
    weeklySessions: normalizedWeeklySessions,
    heatmap: normalizedHeatmap,
    summary,
    source: hasRemoteData ? 'remote' : 'fallback',
  };
}

function mapScansToTrend(rows: EmotionScanRow[]): MoodTrendPoint[] {
  if (!rows.length) {
    return [];
  }

  return rows
    .filter(row => !!row.created_at)
    .map(row => {
      const createdAt = row.created_at ?? new Date().toISOString();
      const scores = extractScores(row.emotions);
      const normalizedBalance = typeof row.emotional_balance === 'number'
        ? row.emotional_balance
        : computeBalanceFromScores(scores);
      const moodScore = deriveScore10(normalizedBalance);
      const energyScore = computeEnergy(scores, moodScore);
      const annotation = buildScanAnnotation(row, scores);

      return {
        date: createdAt,
        mood: Number(moodScore.toFixed(1)),
        energy: Number(energyScore.toFixed(1)),
        annotation,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function buildWeeklySessions(
  flashGlow: FlashGlowMetricRow[],
  breathwork: BreathworkSessionRow[],
  vrBreath: VrBreathMetricRow[],
  vrGalaxy: VrGalaxyMetricRow[],
  journal: JournalEntryRow[],
): WeeklySessionsPoint[] {
  const weeks = new Map<string, { start: Date; guided: number; breathwork: number; vr: number; journaling: number }>();
  const rangeStart = subWeeks(new Date(), 8);

  const addToWeek = (value: string | null, key: 'guided' | 'breathwork' | 'vr' | 'journaling') => {
    if (!value) return;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || isAfter(rangeStart, date)) {
      return;
    }

    const start = startOfISOWeek(date);
    const weekNumber = getISOWeek(start);
    const mapKey = `${start.toISOString()}-${weekNumber}`;

    const bucket = weeks.get(mapKey) ?? {
      start,
      guided: 0,
      breathwork: 0,
      vr: 0,
      journaling: 0,
    };

    bucket[key] += 1;
    weeks.set(mapKey, bucket);
  };

  flashGlow.forEach(entry => addToWeek(entry.ts, 'guided'));
  breathwork.forEach(entry => addToWeek(entry.created_at, 'breathwork'));
  vrBreath.forEach(entry => addToWeek(entry.ts, 'vr'));
  vrGalaxy.forEach(entry => addToWeek(entry.ts, 'vr'));
  journal.forEach(entry => addToWeek(entry.date, 'journaling'));

  return Array.from(weeks.values())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(-6)
    .map(entry => {
      const week = `S${String(getISOWeek(entry.start)).padStart(2, '0')}`;
      const total = entry.guided + entry.breathwork + entry.vr + entry.journaling;
      return {
        week,
        guided: entry.guided,
        breathwork: entry.breathwork,
        vr: entry.vr,
        journaling: entry.journaling,
        total,
      };
    });
}

function buildHeatmap(
  scans: EmotionScanRow[],
  flashGlow: FlashGlowMetricRow[],
  breathwork: BreathworkSessionRow[],
  music: MusicSessionRow[],
  journal: JournalEntryRow[],
): HeatmapPoint[] {
  const buckets = new Map<string, HeatmapBucket>();
  const rangeStart = subWeeks(new Date(), 1);

  const pushSample = (dateString: string | null, intensity: number, label: string) => {
    if (!dateString) return;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime()) || isAfter(rangeStart, date)) {
      return;
    }

    const day = formatDayLabel(date);
    const slot = formatSlotLabel(date);
    const key = `${day}-${slot}`;
    const normalizedIntensity = clamp(intensity, 0, 100);

    const bucket = buckets.get(key) ?? {
      totalIntensity: 0,
      sessions: 0,
      dominantMood: label,
      topIntensity: 0,
      lastTimestamp: 0,
    };

    bucket.totalIntensity += normalizedIntensity;
    bucket.sessions += 1;
    if (normalizedIntensity >= bucket.topIntensity || date.getTime() > bucket.lastTimestamp) {
      bucket.topIntensity = normalizedIntensity;
      bucket.dominantMood = label;
      bucket.lastTimestamp = date.getTime();
    }

    buckets.set(key, bucket);
  };

  scans.forEach(row => {
    const scores = extractScores(row.emotions);
    const normalizedBalance = typeof row.emotional_balance === 'number'
      ? row.emotional_balance
      : computeBalanceFromScores(scores);
    pushSample(row.created_at, normalizedBalance, formatMoodLabel(row.mood));
  });

  flashGlow.forEach(entry => {
    pushSample(entry.ts, 72, 'Flash Glow');
  });

  breathwork.forEach(entry => {
    const metadata = parseBreathworkMetadata(entry.session_data);
    const intensity = metadata ? metadata.density * 100 : 55;
    pushSample(entry.created_at, intensity, `Respiration ${entry.technique_type}`);
  });

  music.forEach(entry => {
    pushSample(entry.created_at, 60, `Playlist ${entry.mood_tag ?? 'adaptive'}`);
  });

  journal.forEach(entry => {
    pushSample(entry.date, 45, 'Journal émotionnel');
  });

  const dayOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const slotOrder = ['Matin', 'Midi', 'Après-midi', 'Soir'];

  const points: HeatmapPoint[] = [];
  dayOrder.forEach(day => {
    slotOrder.forEach(slot => {
      const key = `${day}-${slot}`;
      const bucket = buckets.get(key);
      if (bucket) {
        points.push({
          day,
          slot,
          intensity: Math.round(bucket.totalIntensity / bucket.sessions),
          dominantMood: bucket.dominantMood,
          sessions: bucket.sessions,
        });
      } else {
        points.push({ day, slot, intensity: 0, dominantMood: 'Repos', sessions: 0 });
      }
    });
  });

  return points;
}

function computeSummary(
  moodTrend: MoodTrendPoint[],
  weeklySessions: WeeklySessionsPoint[],
  heatmap: HeatmapPoint[],
): ScoresDashboardSummary {
  const moodAverage = moodTrend.length
    ? moodTrend.reduce((sum, point) => sum + point.mood, 0) / moodTrend.length
    : 0;

  const moodVariation = moodTrend.length >= 2
    ? moodTrend[moodTrend.length - 1].mood - moodTrend[0].mood
    : 0;

  const bestMoodDay = moodTrend.length
    ? moodTrend.reduce((best, current) => (current.mood > best.mood ? current : best))
    : null;

  const totalSessions = weeklySessions.reduce((sum, week) => sum + week.total, 0);
  const sessionsAverage = weeklySessions.length ? totalSessions / weeklySessions.length : 0;
  const lastWeek = weeklySessions.length ? weeklySessions[weeklySessions.length - 1] : null;

  const streakDays = computeMoodStreak(moodTrend.map(point => point.date));
  const level = Math.max(1, Math.floor(totalSessions / 6) + 1);
  const currentExperience = Math.round(totalSessions * 180);
  const nextLevelExperience = Math.max(currentExperience + 200, (level + 1) * 400);
  const levelProgress = nextLevelExperience > 0
    ? Math.min(100, Math.round((currentExperience / nextLevelExperience) * 100))
    : 0;

  const mostIntenseSlot = heatmap.reduce<HeatmapPoint | null>((best, point) => {
    if (!best) return point;
    if (point.intensity > best.intensity) return point;
    if (point.intensity === best.intensity && point.sessions > best.sessions) return point;
    return best;
  }, null);

  return {
    moodAverage,
    moodVariation,
    bestMoodDay,
    sessionsAverage,
    lastWeek,
    level,
    currentExperience,
    nextLevelExperience,
    levelProgress,
    streakDays,
    mostIntenseSlot,
    totalSessions,
  };
}

function extractScores(payload: Json | null): ScoreRecord {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }

  const record = payload as Record<string, unknown>;
  if (record.scores && typeof record.scores === 'object' && !Array.isArray(record.scores)) {
    return normalizeScoreRecord(record.scores as Record<string, unknown>);
  }

  return normalizeScoreRecord(record);
}

function normalizeScoreRecord(source: Record<string, unknown>): ScoreRecord {
  const entries = Object.entries(source);
  const result: ScoreRecord = {};

  for (const [key, value] of entries) {
    const normalizedKey = key.toLowerCase();
    const numericValue = typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : null;

    if (numericValue !== null && Number.isFinite(numericValue)) {
      result[normalizedKey] = Number.parseFloat(numericValue.toFixed(2));
    }
  }

  return result;
}

function computeEnergy(scores: ScoreRecord, fallback: number): number {
  const keys: Array<keyof ScoreRecord> = ['joie', 'surprise', 'anticipation'];
  const values = keys.map(key => (typeof scores[key] === 'number' ? Number(scores[key]) : Number.NaN)).filter(value => !Number.isNaN(value));

  if (!values.length) {
    return fallback;
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return clamp(average, 0, 10);
}

function buildScanAnnotation(row: EmotionScanRow, scores: ScoreRecord): string | null {
  if (row.summary) {
    return row.summary;
  }

  if (row.insights && row.insights.length) {
    return row.insights[0] ?? null;
  }

  if (row.mood) {
    return `Dominante ${formatMoodLabel(row.mood)}`;
  }

  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (dominant) {
    return `Pic ${formatMoodLabel(dominant[0])}`;
  }

  return null;
}

function parseBreathworkMetadata(payload: Json | null): { density: number } | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const densityValue = record.density;
  const density = typeof densityValue === 'number'
    ? densityValue
    : typeof densityValue === 'string'
      ? Number.parseFloat(densityValue)
      : null;

  if (density === null || Number.isNaN(density)) {
    return null;
  }

  return { density: clamp(density, 0, 1) };
}

function computeMoodStreak(dateStrings: string[]): number {
  if (!dateStrings.length) {
    return 0;
  }

  const uniqueDates = Array.from(
    new Set(
      dateStrings
        .map(date => {
          const parsed = new Date(date);
          if (Number.isNaN(parsed.getTime())) {
            return null;
          }
          return parsed.toISOString().split('T')[0];
        })
        .filter((value): value is string => !!value),
    ),
  ).sort();

  if (!uniqueDates.length) {
    return 0;
  }

  let streak = 1;
  for (let index = uniqueDates.length - 1; index > 0; index -= 1) {
    const current = parseISO(uniqueDates[index]);
    const previous = parseISO(uniqueDates[index - 1]);
    const diff = differenceInCalendarDays(current, previous);

    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}

function formatDayLabel(date: Date): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()] ?? 'Lun';
}

function formatSlotLabel(date: Date): string {
  const hour = date.getHours();
  if (hour < 11) return 'Matin';
  if (hour < 14) return 'Midi';
  if (hour < 18) return 'Après-midi';
  return 'Soir';
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function formatMoodLabel(value: string | null): string {
  if (!value) {
    return 'neutre';
  }
  const normalized = value.replace(/[_-]+/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

