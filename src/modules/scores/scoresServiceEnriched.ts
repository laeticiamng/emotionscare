// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface WeeklyMetrics {
  userId: string;
  week: number;
  year: number;
  weekStart: string;
  weekEnd: string;
  emotionalScore: number;
  breathingMinutes: number;
  journalEntries: number;
  meditationMinutes: number;
  musicSessions: number;
  coachInteractions: number;
  overallProgress: number;
  streakDays: number;
  badges: string[];
  insights: string[];
}

export interface DailyActivity {
  date: string;
  breathingMinutes: number;
  journalEntries: number;
  moodScore: number;
  activities: string[];
}

/**
 * Calculate weekly metrics for a user
 */
export async function getWeeklyMetrics(
  userId: string,
  week: number,
  year: number
): Promise<WeeklyMetrics | null> {
  try {
    // Calculate week start and end dates
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (week - 1) * 7;
    const weekStart = new Date(firstDayOfYear);
    weekStart.setDate(firstDayOfYear.getDate() + daysToAdd - firstDayOfYear.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartISO = weekStart.toISOString();
    const weekEndISO = weekEnd.toISOString();

    // Fetch breathing sessions
    const { data: breathingSessions } = await supabase
      .from('breathing_vr_sessions')
      .select('duration_seconds')
      .eq('user_id', userId)
      .gte('created_at', weekStartISO)
      .lte('created_at', weekEndISO);

    const breathingMinutes = breathingSessions?.reduce((acc, s) => acc + (s.duration_seconds || 0) / 60, 0) || 0;

    // Fetch journal entries
    const { data: journals, count: journalCount } = await supabase
      .from('journal_entries')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', weekStartISO)
      .lte('created_at', weekEndISO);

    // Fetch mood entries for emotional score
    const { data: moodEntries } = await supabase
      .from('mood_entries')
      .select('score')
      .eq('user_id', userId)
      .gte('created_at', weekStartISO)
      .lte('created_at', weekEndISO);

    const emotionalScore = moodEntries && moodEntries.length > 0
      ? moodEntries.reduce((acc, m) => acc + (m.score || 50), 0) / moodEntries.length
      : 50;

    // Fetch AI coach sessions
    const { count: coachCount } = await supabase
      .from('ai_coach_sessions')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', weekStartISO)
      .lte('created_at', weekEndISO);

    // Fetch music listening history
    const { count: musicCount } = await supabase
      .from('music_listening_history')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', weekStartISO)
      .lte('created_at', weekEndISO);

    // Calculate streak
    const streakDays = await calculateStreak(userId, weekEnd);

    // Calculate overall progress
    const overallProgress = calculateOverallProgress({
      breathingMinutes,
      journalEntries: journalCount || 0,
      emotionalScore,
      coachInteractions: coachCount || 0,
      musicSessions: musicCount || 0
    });

    // Generate insights
    const insights = generateInsights({
      breathingMinutes,
      journalEntries: journalCount || 0,
      emotionalScore,
      streakDays
    });

    const metrics: WeeklyMetrics = {
      userId,
      week,
      year,
      weekStart: weekStartISO,
      weekEnd: weekEndISO,
      emotionalScore: Math.round(emotionalScore),
      breathingMinutes: Math.round(breathingMinutes),
      journalEntries: journalCount || 0,
      meditationMinutes: Math.round(breathingMinutes * 0.5), // Estimate
      musicSessions: musicCount || 0,
      coachInteractions: coachCount || 0,
      overallProgress,
      streakDays,
      badges: [],
      insights
    };

    logger.info('Weekly metrics calculated', { userId, week, year }, 'SCORES');
    return metrics;

  } catch (error) {
    logger.error('Failed to calculate weekly metrics', error, 'SCORES');
    return null;
  }
}

/**
 * Calculate user's current streak
 */
async function calculateStreak(userId: string, endDate: Date): Promise<number> {
  try {
    let streak = 0;
    let currentDate = new Date(endDate);

    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Check for any activity on this day
      const { count } = await supabase
        .from('user_activity_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());

      if (count && count > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch {
    return 0;
  }
}

/**
 * Calculate overall progress percentage
 */
function calculateOverallProgress(metrics: {
  breathingMinutes: number;
  journalEntries: number;
  emotionalScore: number;
  coachInteractions: number;
  musicSessions: number;
}): number {
  const weights = {
    breathing: 0.25,
    journal: 0.2,
    emotional: 0.3,
    coach: 0.15,
    music: 0.1
  };

  // Normalize each metric to 0-100
  const breathingScore = Math.min(100, (metrics.breathingMinutes / 60) * 100);
  const journalScore = Math.min(100, (metrics.journalEntries / 7) * 100);
  const emotionalNorm = metrics.emotionalScore;
  const coachScore = Math.min(100, (metrics.coachInteractions / 5) * 100);
  const musicScore = Math.min(100, (metrics.musicSessions / 10) * 100);

  const progress = 
    breathingScore * weights.breathing +
    journalScore * weights.journal +
    emotionalNorm * weights.emotional +
    coachScore * weights.coach +
    musicScore * weights.music;

  return Math.round(progress);
}

/**
 * Generate personalized insights
 */
function generateInsights(metrics: {
  breathingMinutes: number;
  journalEntries: number;
  emotionalScore: number;
  streakDays: number;
}): string[] {
  const insights: string[] = [];

  if (metrics.breathingMinutes >= 60) {
    insights.push("🌬️ Excellent travail sur la respiration cette semaine !");
  } else if (metrics.breathingMinutes < 15) {
    insights.push("💨 Essayez d'ajouter quelques minutes de respiration à votre routine.");
  }

  if (metrics.journalEntries >= 5) {
    insights.push("📝 Votre journaling régulier contribue à votre bien-être.");
  } else if (metrics.journalEntries === 0) {
    insights.push("📖 Le journal peut vous aider à mieux comprendre vos émotions.");
  }

  if (metrics.emotionalScore >= 70) {
    insights.push("😊 Votre score émotionnel est excellent, continuez !");
  } else if (metrics.emotionalScore < 40) {
    insights.push("💙 N'hésitez pas à explorer le Coach IA pour du soutien.");
  }

  if (metrics.streakDays >= 7) {
    insights.push(`🔥 Impressionnant ! ${metrics.streakDays} jours d'affilée !`);
  } else if (metrics.streakDays >= 3) {
    insights.push(`✨ Belle série de ${metrics.streakDays} jours, gardez le rythme !`);
  }

  return insights.slice(0, 4);
}

/**
 * Get daily activity breakdown
 */
export async function getDailyActivity(
  userId: string,
  date: Date
): Promise<DailyActivity | null> {
  try {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const { data: breathing } = await supabase
      .from('breathing_vr_sessions')
      .select('duration_seconds')
      .eq('user_id', userId)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString());

    const { count: journalCount } = await supabase
      .from('journal_entries')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString());

    const { data: moods } = await supabase
      .from('mood_entries')
      .select('score')
      .eq('user_id', userId)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString());

    const breathingMinutes = breathing?.reduce((acc, s) => acc + (s.duration_seconds || 0) / 60, 0) || 0;
    const moodScore = moods && moods.length > 0
      ? moods.reduce((acc, m) => acc + (m.score || 50), 0) / moods.length
      : 50;

    const activities: string[] = [];
    if (breathingMinutes > 0) activities.push('breathing');
    if (journalCount && journalCount > 0) activities.push('journal');
    if (moods && moods.length > 0) activities.push('mood');

    return {
      date: date.toISOString().split('T')[0],
      breathingMinutes: Math.round(breathingMinutes),
      journalEntries: journalCount || 0,
      moodScore: Math.round(moodScore),
      activities
    };
  } catch (error) {
    logger.error('Failed to get daily activity', error, 'SCORES');
    return null;
  }
}

export default { getWeeklyMetrics, getDailyActivity };
