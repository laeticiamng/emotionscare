/**
 * Hook React Query pour Dashboard
 */

import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/modules/dashboard/dashboardService';

export const useDashboard = (userId: string) => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: () => DashboardService.getGlobalStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const { data: moduleActivities, isLoading: isLoadingModules } = useQuery({
    queryKey: ['dashboard-modules', userId],
    queryFn: () => DashboardService.getModuleActivities(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });

  const { data: recommendations } = useQuery({
    queryKey: ['dashboard-recommendations', userId],
    queryFn: () => DashboardService.getRecommendations(userId),
    enabled: !!userId
  });

  const { data: achievements } = useQuery({
    queryKey: ['dashboard-achievements', userId],
    queryFn: () => DashboardService.getRecentAchievements(userId),
    enabled: !!userId
  });

  const { data: badges } = useQuery({
    queryKey: ['dashboard-badges', userId],
    queryFn: () => DashboardService.getRecentBadges(userId),
    enabled: !!userId
  });

  const { data: weeklySummary } = useQuery({
    queryKey: ['dashboard-weekly', userId],
    queryFn: () => DashboardService.getWeeklySummary(userId),
    enabled: !!userId,
    staleTime: 60 * 60 * 1000 // 1 heure
  });

  return {
    stats,
    moduleActivities,
    recommendations,
    achievements,
    badges,
    weeklySummary,
    isLoading: isLoadingStats || isLoadingModules
  };
};
