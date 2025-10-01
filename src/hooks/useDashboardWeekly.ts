// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

export type GlowBucket = 'low'|'medium'|'high';

export interface DayGlow {
  date: string;
  glow_score?: number;
  glow_bucket: GlowBucket;
  tip?: string;
}

export interface DashboardWeekly {
  week_start: string;
  days: DayGlow[];
  today: DayGlow;
}

const inferBucket = (score?: number): GlowBucket => {
  if (!score) return 'medium';
  if (score < 50) return 'low';
  if (score >= 70) return 'high';
  return 'medium';
};

export const useDashboardWeekly = () => {
  return useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: async (): Promise<DashboardWeekly> => {
      const res = await GlobalInterceptor.secureFetch('/me/dashboard/weekly');
      if (!res) throw new Error('Request failed');
      const data = await res.json();
      
      // Ensure today and days have proper glow_bucket fallback
      const processedData = {
        ...data,
        today: {
          ...data.today,
          glow_bucket: data.today?.glow_bucket || inferBucket(data.today?.glow_score)
        },
        days: data.days?.map((day: any) => ({
          ...day,
          glow_bucket: day.glow_bucket || inferBucket(day.glow_score)
        })) || []
      };
      
      return processedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};

export { inferBucket };