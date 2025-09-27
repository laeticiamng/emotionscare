import { TeamAnalytics } from '@types/analytics';

/**
 * Fetches aggregated emotional analytics for a team.
 * This is a placeholder implementation that simulates a Supabase request.
 */
export async function fetchTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Sample data. Real implementation should query Supabase.
  const emotionalTrend = Array.from({ length: 7 }, (_, i) => 60 + Math.round(Math.random() * 20));

  const topEmotions = [
    { emotion: 'calm', count: 12 },
    { emotion: 'joy', count: 8 }
  ];

  return {
    teamId,
    teamName: `Team ${teamId}`,
    memberCount: 12,
    averageScore: emotionalTrend.reduce((acc, v) => acc + v, 0) / emotionalTrend.length,
    topEmotions,
    emotionalTrend,
    engagementRate: 0.75
  };
}
