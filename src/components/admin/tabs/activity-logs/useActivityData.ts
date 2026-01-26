import { useState, useEffect, useCallback } from 'react';
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
  
  // Mock data for demonstration
  const mockActivities: AnonymousActivity[] = [
    {
      id: '1',
      activity_type: 'login',
      category: 'authentication',
      count: 25,
      timestamp_day: '2023-07-01'
    },
    {
      id: '2',
      activity_type: 'scan_emotion',
      category: 'wellness',
      count: 18,
      timestamp_day: '2023-07-01'
    },
    {
      id: '3',
      activity_type: 'journal_entry',
      category: 'wellness',
      count: 12,
      timestamp_day: '2023-07-02'
    }
  ];
  
  const mockStats: ActivityStats[] = [
    {
      activity_type: 'login',
      total_count: 125,
      percentage: 40.5
    },
    {
      activity_type: 'scan_emotion',
      total_count: 82,
      percentage: 26.5
    },
    {
      activity_type: 'journal_entry',
      total_count: 65,
      percentage: 21.0
    }
  ];
  
  // Fetch anonymous activities function
  const fetchAnonymousActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll use mock data
      
      // Simulate filtering
      let filtered = [...mockActivities];
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (activityType && activityType !== 'all') {
        filtered = filtered.filter(item => item.activity_type === activityType);
      }
      
      if (startDate) {
        filtered = filtered.filter(item => 
          new Date(item.timestamp_day) >= new Date(startDate)
        );
      }
      
      if (endDate) {
        filtered = filtered.filter(item => 
          new Date(item.timestamp_day) <= new Date(endDate)
        );
      }
      
      // Simulate pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filtered.slice(start, end);
      
      setAnonymousActivities(paginatedData);
      setTotalActivities(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
    } catch (err) {
      logger.error('Error fetching anonymous activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchActivityStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch data from Supabase
      // For now, we'll use mock data
      setActivityStats(mockStats);
    } catch (err) {
      logger.error('Error fetching activity stats:', err);
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
