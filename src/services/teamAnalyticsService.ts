export interface TeamAnalytics {
  teamId: string;
  emotionalTrend: Array<{ date: string; value: number }>;
  averageScore: number;
  topMood: string;
  activeMembers: number;
}

/**
 * Fetches aggregated emotional analytics for a team.
 * This is a placeholder implementation that simulates a Supabase request.
 */
export async function fetchTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Sample data. Real implementation should query Supabase.
  const emotionalTrend = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    value: 60 + Math.round(Math.random() * 20)
  }));

  return {
    teamId,
    emotionalTrend,
    averageScore: emotionalTrend.reduce((acc, v) => acc + v.value, 0) / emotionalTrend.length,
    topMood: 'calm',
    activeMembers: 12
  };
}
