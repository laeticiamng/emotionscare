/**
 * Team Analytics Service - Real Supabase Implementation
 * Fetches aggregated emotional analytics for B2B teams
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  memberCount: number;
  averageScore: number;
  topEmotions: Array<{ emotion: string; count: number }>;
  emotionalTrend: number[];
  engagementRate: number;
  activeMembers: number;
  sessionsThisWeek: number;
  avgSessionDuration: number;
}

export interface TeamMemberStats {
  userId: string;
  displayName: string;
  lastActive: string;
  sessionsCount: number;
  avgMoodScore: number;
  streakDays: number;
}

/**
 * Fetches aggregated emotional analytics for a team from Supabase
 */
export async function fetchTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
  try {
    // Fetch team info
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, created_at')
      .eq('id', teamId)
      .single();

    if (teamError) {
      logger.warn('Team fetch failed', { error: teamError.message }, 'ANALYTICS');
    }

    // Fetch team members
    const { data: members, count: memberCount } = await supabase
      .from('team_members')
      .select('user_id, role, joined_at', { count: 'exact' })
      .eq('team_id', teamId);

    const userIds = members?.map(m => m.user_id) || [];

    // Fetch mood scans for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: moodScans } = await supabase
      .from('mood_scans')
      .select('user_id, score, emotion, created_at')
      .in('user_id', userIds)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Calculate emotional trend (daily averages)
    const dailyScores: Record<string, number[]> = {};
    moodScans?.forEach(scan => {
      const day = scan.created_at.split('T')[0];
      if (!dailyScores[day]) dailyScores[day] = [];
      if (scan.score != null) dailyScores[day].push(scan.score);
    });

    const emotionalTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = date.toISOString().split('T')[0];
      const scores = dailyScores[day] || [];
      const avg = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 50; // Default to neutral
      emotionalTrend.push(avg);
    }

    // Count top emotions
    const emotionCounts: Record<string, number> = {};
    moodScans?.forEach(scan => {
      if (scan.emotion) {
        emotionCounts[scan.emotion] = (emotionCounts[scan.emotion] || 0) + 1;
      }
    });

    const topEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Fetch sessions for engagement rate
    const { data: sessions, count: sessionsCount } = await supabase
      .from('activity_sessions')
      .select('user_id, duration_sec, created_at', { count: 'exact' })
      .in('user_id', userIds)
      .gte('created_at', sevenDaysAgo.toISOString());

    const activeUserIds = new Set(sessions?.map(s => s.user_id) || []);
    const activeMembers = activeUserIds.size;
    const engagementRate = memberCount ? activeMembers / memberCount : 0;

    const avgSessionDuration = sessions && sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + (s.duration_sec || 0), 0) / sessions.length)
      : 0;

    const averageScore = emotionalTrend.length > 0
      ? Math.round(emotionalTrend.reduce((a, b) => a + b, 0) / emotionalTrend.length)
      : 50;

    return {
      teamId,
      teamName: team?.name || `Team ${teamId}`,
      memberCount: memberCount || 0,
      averageScore,
      topEmotions,
      emotionalTrend,
      engagementRate,
      activeMembers,
      sessionsThisWeek: sessionsCount || 0,
      avgSessionDuration
    };
  } catch (error) {
    logger.error('Team analytics error', error as Error, 'ANALYTICS');

    // Return default data on error
    return {
      teamId,
      teamName: `Team ${teamId}`,
      memberCount: 0,
      averageScore: 50,
      topEmotions: [],
      emotionalTrend: Array(7).fill(50),
      engagementRate: 0,
      activeMembers: 0,
      sessionsThisWeek: 0,
      avgSessionDuration: 0
    };
  }
}

/**
 * Fetches individual member stats for a team
 */
export async function fetchTeamMemberStats(teamId: string): Promise<TeamMemberStats[]> {
  try {
    const { data: members } = await supabase
      .from('team_members')
      .select(`
        user_id,
        profiles!inner (
          display_name,
          last_activity_date,
          streak_days
        )
      `)
      .eq('team_id', teamId);

    if (!members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);

    // Fetch session counts per user
    const { data: sessionCounts } = await supabase
      .from('activity_sessions')
      .select('user_id')
      .in('user_id', userIds);

    const userSessionCounts: Record<string, number> = {};
    sessionCounts?.forEach(s => {
      userSessionCounts[s.user_id] = (userSessionCounts[s.user_id] || 0) + 1;
    });

    // Fetch mood averages per user
    const { data: moodData } = await supabase
      .from('mood_scans')
      .select('user_id, score')
      .in('user_id', userIds);

    const userMoodTotals: Record<string, { sum: number; count: number }> = {};
    moodData?.forEach(m => {
      if (!userMoodTotals[m.user_id]) {
        userMoodTotals[m.user_id] = { sum: 0, count: 0 };
      }
      if (m.score != null) {
        userMoodTotals[m.user_id].sum += m.score;
        userMoodTotals[m.user_id].count++;
      }
    });

    return members.map((m: any) => ({
      userId: m.user_id,
      displayName: m.profiles?.display_name || 'Utilisateur',
      lastActive: m.profiles?.last_activity_date || '',
      sessionsCount: userSessionCounts[m.user_id] || 0,
      avgMoodScore: userMoodTotals[m.user_id]
        ? Math.round(userMoodTotals[m.user_id].sum / userMoodTotals[m.user_id].count)
        : 50,
      streakDays: m.profiles?.streak_days || 0
    }));
  } catch (error) {
    logger.error('Team member stats error', error as Error, 'ANALYTICS');
    return [];
  }
}

/**
 * Compares team performance against organization average
 */
export async function fetchTeamComparison(teamId: string, orgId: string): Promise<{
  teamAvg: number;
  orgAvg: number;
  percentile: number;
}> {
  try {
    // Get team average
    const teamAnalytics = await fetchTeamAnalytics(teamId);
    const teamAvg = teamAnalytics.averageScore;

    // Get all teams in org
    const { data: orgTeams } = await supabase
      .from('teams')
      .select('id')
      .eq('organization_id', orgId);

    if (!orgTeams || orgTeams.length === 0) {
      return { teamAvg, orgAvg: teamAvg, percentile: 50 };
    }

    // Calculate org average
    let totalScore = 0;
    let betterThan = 0;

    for (const t of orgTeams) {
      const analytics = await fetchTeamAnalytics(t.id);
      totalScore += analytics.averageScore;
      if (analytics.averageScore < teamAvg) betterThan++;
    }

    const orgAvg = Math.round(totalScore / orgTeams.length);
    const percentile = Math.round((betterThan / orgTeams.length) * 100);

    return { teamAvg, orgAvg, percentile };
  } catch (error) {
    logger.error('Team comparison error', error as Error, 'ANALYTICS');
    return { teamAvg: 50, orgAvg: 50, percentile: 50 };
  }
}

/**
 * Get aggregated wellbeing metrics for a team over time
 */
export async function fetchTeamWellbeingTrend(teamId: string, days: number = 30): Promise<{
  dates: string[];
  scores: number[];
  engagement: number[];
}> {
  try {
    // Fetch team members
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);

    const userIds = members?.map(m => m.user_id) || [];
    if (userIds.length === 0) {
      return { dates: [], scores: [], engagement: [] };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all mood scans in period
    const { data: moodScans } = await supabase
      .from('mood_scans')
      .select('score, created_at')
      .in('user_id', userIds)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Fetch sessions
    const { data: sessions } = await supabase
      .from('activity_sessions')
      .select('user_id, created_at')
      .in('user_id', userIds)
      .gte('created_at', startDate.toISOString());

    // Group by date
    const dailyData: Record<string, { scores: number[]; activeUsers: Set<string> }> = {};

    moodScans?.forEach(scan => {
      const day = scan.created_at.split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = { scores: [], activeUsers: new Set() };
      }
      if (scan.score != null) {
        dailyData[day].scores.push(scan.score);
      }
    });

    sessions?.forEach(session => {
      const day = session.created_at.split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = { scores: [], activeUsers: new Set() };
      }
      dailyData[day].activeUsers.add(session.user_id);
    });

    // Build arrays
    const dates: string[] = [];
    const scores: number[] = [];
    const engagement: number[] = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = date.toISOString().split('T')[0];
      dates.push(day);

      const dayData = dailyData[day];
      if (dayData && dayData.scores.length > 0) {
        scores.push(Math.round(dayData.scores.reduce((a, b) => a + b, 0) / dayData.scores.length));
      } else {
        scores.push(50);
      }

      engagement.push(dayData ? Math.round((dayData.activeUsers.size / userIds.length) * 100) : 0);
    }

    return { dates, scores, engagement };
  } catch (error) {
    logger.error('Team wellbeing trend error', error as Error, 'ANALYTICS');
    return { dates: [], scores: [], engagement: [] };
  }
}
