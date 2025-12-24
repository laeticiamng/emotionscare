// @ts-nocheck
import { useState, useEffect } from 'react';
import { AnonymousActivity, ActivityStats } from '@/types/activity';
import { logger } from '@/lib/logger';

// Load activity data from Supabase
const getActivityData = async (): Promise<AnonymousActivity[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (data && data.length > 0) {
      return data.map(a => ({
        id: a.id,
        activity_type: a.activity_type || a.type || 'activity',
        category: a.category || 'general',
        count: a.count || 1,
        timestamp_day: a.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
    }
  } catch (error) {
    console.error('Error loading activity data:', error);
  }

  return [];
};

const getActivityStats = async (): Promise<ActivityStats[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get all activities and calculate stats
    const { data } = await supabase
      .from('activity_logs')
      .select('activity_type')
      .eq('user_id', user.id);

    if (data && data.length > 0) {
      const counts: Record<string, number> = {};
      data.forEach(a => {
        const type = a.activity_type || 'activity';
        counts[type] = (counts[type] || 0) + 1;
      });

      const total = data.length;
      return Object.entries(counts).map(([type, count]) => ({
        activity_type: type,
        total_count: count,
        percentage: Math.round((count / total) * 1000) / 10
      }));
    }
  } catch (error) {
    console.error('Error loading activity stats:', error);
  }

  return [];
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
