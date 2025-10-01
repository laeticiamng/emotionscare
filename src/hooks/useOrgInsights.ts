// @ts-nocheck
import { useMemo } from 'react';
import { OrgWeekly, VibeBucket, Trend } from '@/store/org.store';

export interface OrgKPI {
  totalTeams: number;
  eligibleTeams: number;
  globalTrend: Trend;
  globalTrendLabel: string;
  distribution: {
    low: number;
    medium: number;  
    high: number;
  };
  distributionLabel: string;
  atRiskTeams: number;
  atRiskLabel: string;
}

export const useOrgInsights = (data: OrgWeekly | null): OrgKPI | null => {
  return useMemo(() => {
    if (!data || !data.teams) return null;

    const eligibleTeams = data.teams.filter(team => team.eligible);
    const totalTeams = data.teams.length;

    // Calculate global trend based on team trends
    const trendCounts = eligibleTeams.reduce((acc, team) => {
      if (team.trend) {
        acc[team.trend] = (acc[team.trend] || 0) + 1;
      }
      return acc;
    }, {} as Record<Trend, number>);

    const globalTrend: Trend = 
      (trendCounts.up || 0) > (trendCounts.down || 0) ? 'up' :
      (trendCounts.down || 0) > (trendCounts.up || 0) ? 'down' : 'flat';

    const globalTrendLabels = {
      up: 'En hausse',
      flat: 'Stable', 
      down: 'En baisse'
    };

    // Calculate distribution from latest day
    const latestDistribution = { low: 0, medium: 0, high: 0 };
    
    eligibleTeams.forEach(team => {
      if (team.days && team.days.length > 0) {
        const latestDay = team.days[team.days.length - 1];
        latestDistribution[latestDay.bucket]++;
      }
    });

    // Find dominant bucket
    const dominantBucket = Object.entries(latestDistribution)
      .reduce((a, b) => latestDistribution[a[0] as VibeBucket] > latestDistribution[b[0] as VibeBucket] ? a : b)[0] as VibeBucket;

    const bucketLabels = {
      low: 'Calme',
      medium: 'Stable',
      high: 'Énergique'
    };

    const distributionLabel = `Majorité ${bucketLabels[dominantBucket]}`;

    // Calculate at-risk teams (consecutive low days)
    const atRiskTeams = eligibleTeams.filter(team => {
      if (!team.days || team.days.length < 2) return false;
      
      const lastTwoDays = team.days.slice(-2);
      return lastTwoDays.every(day => day.bucket === 'low');
    }).length;

    const atRiskLabel = atRiskTeams === 0 ? 'Aucune équipe à surveiller' :
                      atRiskTeams === 1 ? '1 équipe à surveiller' :
                      `${atRiskTeams} équipes à surveiller`;

    return {
      totalTeams,
      eligibleTeams: eligibleTeams.length,
      globalTrend,
      globalTrendLabel: globalTrendLabels[globalTrend],
      distribution: latestDistribution,
      distributionLabel,
      atRiskTeams,
      atRiskLabel
    };
  }, [data]);
};