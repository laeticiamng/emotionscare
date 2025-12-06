import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type LeaderboardPeriod = 'week' | 'month' | 'all';

type RawLeaderboardRow = {
  id?: string;
  user_id?: string;
  pseudo_anonyme?: string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
  avatar?: string;
  total_points?: number;
  total_xp?: number;
  score?: number;
  points?: number;
  weekly_points?: number;
  weekly_xp?: number;
  week_points?: number;
  week_total?: number;
  xp_week?: number;
  week_score?: number;
  monthly_points?: number;
  monthly_xp?: number;
  month_points?: number;
  month_total?: number;
  xp_month?: number;
  month_score?: number;
  badges_unlocked?: number;
  total_badges?: number;
  badges?: any;
  top_badges?: any;
  challenges_completed?: number;
  completed_challenges?: number;
  total_challenges?: number;
  emotional_profile?: string;
  emotion_profile?: string;
  profile?: string;
  streak_days?: number;
  current_streak?: number;
  last_updated?: string;
  updated_at?: string;
};

export interface AdvancedLeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  xp: Record<LeaderboardPeriod, number>;
  badgesUnlocked: number;
  challengesCompleted: number;
  emotionalProfile: string;
  topBadges: string[];
  streakDays: number | null;
  lastUpdated: string | null;
}

export interface UseAdvancedLeaderboardResult {
  entries: (AdvancedLeaderboardEntry & { rank: number })[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  period: LeaderboardPeriod;
  setPeriod: (value: LeaderboardPeriod) => void;
  emotionalProfile: string;
  setEmotionalProfile: (value: string) => void;
  profileOptions: string[];
  lastUpdated: string | null;
}

const PERIODS: LeaderboardPeriod[] = ['week', 'month', 'all'];

const ensureNumber = (value: unknown): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const extractBadgeNames = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((badge) => {
        if (typeof badge === 'string') return badge;
        if (badge && typeof badge === 'object') {
          return (
            badge.name ||
            badge.badge_name ||
            badge.title ||
            badge.label ||
            null
          );
        }
        return null;
      })
      .filter((value): value is string => Boolean(value));
  }
  return [];
};

const generateFallbackId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `temp-${Math.random().toString(36).slice(2, 11)}`;
};

const normaliseRow = (row: RawLeaderboardRow): AdvancedLeaderboardEntry => {
  const totalAllTime = ensureNumber(
    row.total_points ?? row.total_xp ?? row.points ?? row.score ?? 0
  );
  const totalMonth = ensureNumber(
    row.monthly_points ??
      row.monthly_xp ??
      row.month_points ??
      row.month_total ??
      row.xp_month ??
      row.month_score ??
      0
  );
  const totalWeek = ensureNumber(
    row.weekly_points ??
      row.weekly_xp ??
      row.week_points ??
      row.week_total ??
      row.xp_week ??
      row.week_score ??
      0
  );

  const badges = ensureNumber(row.badges_unlocked ?? row.total_badges);
  const challenges = ensureNumber(
    row.challenges_completed ?? row.completed_challenges ?? row.total_challenges
  );

  const topBadges = extractBadgeNames(row.top_badges ?? row.badges).slice(0, 4);

  return {
    id: row.id ?? row.user_id ?? generateFallbackId(),
    userId: row.user_id ?? row.id ?? 'unknown',
    displayName:
      row.pseudo_anonyme ??
      row.display_name ??
      row.username ??
      'Explorateur anonyme',
    avatarUrl: row.avatar_url ?? row.avatar ?? null,
    xp: {
      week: totalWeek,
      month: totalMonth,
      all: totalAllTime,
    },
    badgesUnlocked: badges,
    challengesCompleted: challenges,
    emotionalProfile:
      row.emotional_profile ?? row.emotion_profile ?? row.profile ?? 'Équilibré',
    topBadges,
    streakDays: row.streak_days ?? row.current_streak ?? null,
    lastUpdated: row.last_updated ?? row.updated_at ?? null,
  };
};

export const useAdvancedLeaderboard = (): UseAdvancedLeaderboardResult => {
  const [entries, setEntries] = useState<AdvancedLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<LeaderboardPeriod>('week');
  const [emotionalProfile, setEmotionalProfile] = useState<string>('all');

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('gamification_metrics')
        .select('*')
        .limit(200);

      if (fetchError) throw fetchError;

      const mapped = (data as RawLeaderboardRow[] | null)?.map(normaliseRow) ?? [];
      setEntries(mapped);
      setError(null);
    } catch (err: any) {
      logger.error('Erreur lors du chargement du leaderboard avancé:', err, 'HOOK');
      setError(err.message ?? 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('advanced-leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gamification_metrics' },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  const filteredEntries = useMemo(() => {
    if (emotionalProfile === 'all') return entries;
    return entries.filter(
      (entry) => entry.emotionalProfile === emotionalProfile
    );
  }, [entries, emotionalProfile]);

  const rankedEntries = useMemo(
    () =>
      filteredEntries
        .slice()
        .sort((a, b) => b.xp[period] - a.xp[period])
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    [filteredEntries, period]
  );

  const profileOptions = useMemo(() => {
    const unique = new Set<string>();
    entries.forEach((entry) => {
      if (entry.emotionalProfile) {
        unique.add(entry.emotionalProfile);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const lastUpdated = useMemo(() => {
    const timestamps = entries
      .map((entry) => entry.lastUpdated)
      .filter((value): value is string => Boolean(value));

    if (!timestamps.length) return null;

    return timestamps.sort().reverse()[0];
  }, [entries]);

  return {
    entries: rankedEntries,
    loading,
    error,
    refresh: fetchEntries,
    period,
    setPeriod,
    emotionalProfile,
    setEmotionalProfile,
    profileOptions,
    lastUpdated,
  };
};

export { PERIODS };
export type { LeaderboardPeriod };
