// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { ActivityFiltersState, AnonymousActivity, ActivityStats, ActivityTabView } from './types';
import { logger } from '@/lib/logger';

interface UseActivityDataProps {
  activeTab: ActivityTabView;
  filters: ActivityFiltersState;
  currentPage: number;
  pageSize: number;
}

interface UseActivityDataResult {
  anonymousActivities: AnonymousActivity[];
  activityStats: ActivityStats[];
  isLoading: boolean;
  error: string | null;
  totalActivities: number;
  totalPages: number;
  fetchData: () => Promise<void>;
}

export const useActivityData = ({
  activeTab,
  filters,
  currentPage,
  pageSize
}: UseActivityDataProps): UseActivityDataResult => {
  const [anonymousActivities, setAnonymousActivities] = useState<AnonymousActivity[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const { searchTerm, activityType, startDate, endDate } = filters;
  
  // Fetch anonymous activities function
  const fetchAnonymousActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This query gets anonymous activity data grouped by day and activity type
      // NO USER IDENTIFYING INFORMATION is included
      const { data, error: fetchError, count } = await supabase
        .rpc('get_anonymous_activity_logs', {
          p_start_date: startDate ? startDate.toISOString() : null,
          p_end_date: endDate ? endDate.toISOString() : null,
          p_activity_type: activityType !== 'all' ? activityType : null,
          p_search_term: searchTerm || null,
          p_page: currentPage,
          p_page_size: pageSize
        });
        
      if (fetchError) throw new Error(fetchError.message);
      
      // Process the data to ensure no identifying information
      const processedData = data?.map(item => ({
        id: item.id,
        activity_type: item.activity_type,
        category: item.category || 'Non catégorisé',
        count: item.count,
        timestamp_day: item.timestamp_day
      })) || [];
      
      setAnonymousActivities(processedData);
      setTotalActivities(count || 0);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (err) {
      logger.error('Error fetching anonymous activities:', err as Error, 'UI');
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchActivityStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch aggregated statistics
      const { data, error: statsError } = await supabase
        .rpc('get_activity_stats', {
          p_start_date: startDate ? startDate.toISOString() : null,
          p_end_date: endDate ? endDate.toISOString() : null
        });
        
      if (statsError) throw new Error(statsError.message);
        
      setActivityStats(data || []);
    } catch (err) {
      logger.error('Error fetching activity stats:', err as Error, 'UI');
      setError(err instanceof Error ? err.message : 'Failed to fetch activity statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    if (activeTab === 'daily') {
      await fetchAnonymousActivities();
    } else {
      await fetchActivityStats();
    }
  }, [activeTab, currentPage, pageSize, searchTerm, activityType, startDate, endDate]);
  
  // Initial data fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    anonymousActivities,
    activityStats,
    isLoading,
    error,
    totalActivities,
    totalPages,
    fetchData
  };
};
