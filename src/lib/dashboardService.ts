// @ts-nocheck
import { MoodData } from '@/types/mood';

export interface DashboardData {
  moodTrend: MoodData[];
  averageMood: number;
  topEmotions: { name: string; count: number }[];
  recentActivities: {
    id: string;
    type: string;
    title: string;
    timestamp: Date | string;
  }[];
}

/**
 * Fetch user dashboard data
 */
export const fetchDashboardData = async (userId: string): Promise<DashboardData> => {
  // Return empty defaults — real data should be fetched via Supabase queries in components
  return {
    moodTrend: [],
    averageMood: 0,
    topEmotions: [],
    recentActivities: []
  };
};
