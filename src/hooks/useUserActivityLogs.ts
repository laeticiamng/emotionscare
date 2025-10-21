// @ts-nocheck
import { useState, useEffect } from 'react';
import { AnonymousActivity, ActivityStats } from '@/types/activity';
import { logger } from '@/lib/logger';

// Mock data functions since the imports were missing
const getActivityData = async (): Promise<AnonymousActivity[]> => {
  // Mock implementation - in a real app, this would call an API
  return Promise.resolve([
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
    }
  ]);
};

const getActivityStats = async (): Promise<ActivityStats[]> => {
  // Mock implementation - in a real app, this would call an API
  return Promise.resolve([
    {
      activity_type: 'login',
      total_count: 125,
      percentage: 40.5
    },
    {
      activity_type: 'scan_emotion',
      total_count: 82,
      percentage: 26.5
    }
  ]);
};

export interface ActivityLogFilters {
  startDate: string;
  endDate: string;
  activityType: string;
  searchTerm: string;
}

export const useUserActivityLogs = () => {
  const [activities, setActivities] = useState<AnonymousActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivityLogFilters>({
    startDate: '',
    endDate: '',
    activityType: 'all',
    searchTerm: ''
  });

  // Fetch activity data
  const fetchActivityData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [activitiesData, statsData] = await Promise.all([
        getActivityData(),
        getActivityStats()
      ]);
      
      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
      setStats(statsData);
    } catch (err) {
      logger.error("Error fetching activity data", err as Error, 'ANALYTICS');
      setError("Impossible de charger les données d'activité");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = (filters: ActivityLogFilters) => {
    if (!activities.length) return;
    
    let filtered = [...activities];
    
    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(item => 
        new Date(item.timestamp_day) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(item => 
        new Date(item.timestamp_day) <= new Date(filters.endDate)
      );
    }
    
    // Apply type filter
    if (filters.activityType && filters.activityType !== 'all') {
      filtered = filtered.filter(item => 
        item.activity_type === filters.activityType
      );
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.activity_type.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredActivities(filtered);
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters(filters);
  }, [filters, activities]);

  useEffect(() => {
    fetchActivityData();
  }, []);

  return {
    activities,
    filteredActivities,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    fetchActivityData,
    refreshData: fetchActivityData
  };
};
