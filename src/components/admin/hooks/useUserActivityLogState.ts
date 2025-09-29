
import { useState, useEffect, useCallback } from 'react';
import { fullApiService } from '@/services/api/fullApiService';

export interface ActivityLogFilters {
  searchTerm: string;
  activityType: string;
  startDate: string;
  endDate: string;
}

export interface AnonymousActivity {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}

export const useUserActivityLogState = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'stats'>('daily');
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ActivityLogFilters>({
    searchTerm: '',
    activityType: 'all',
    startDate: '',
    endDate: ''
  });

  const fetchActivityData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'daily') {
        // Utiliser les nouveaux endpoints backend
        const params: any = {
          page: 1,
          limit: 50
        };
        
        if (filters.startDate) params.date_from = filters.startDate;
        if (filters.endDate) params.date_to = filters.endDate;
        if (filters.activityType !== 'all') params.activity_type = filters.activityType;
        if (filters.searchTerm) params.search_term = filters.searchTerm;

        const response = await fullApiService.request('/admin/audit/logs', {
          method: 'GET',
        });
        
        // Transformer les données pour correspondre au format attendu
        const activities = response.data?.logs?.map((log: any) => ({
          id: log.id,
          activity_type: log.action,
          category: log.resource_type || 'Système',
          count: 1,
          timestamp_day: new Date(log.created_at).toISOString().split('T')[0]
        })) || [];
        
        setFilteredActivities(activities);
      } else {
        // Récupérer les statistiques d'utilisation
        const response = await fullApiService.getUsageStatistics({
          period: '30d'
        });
        
        const statsData = response.data?.feature_usage ? 
          Object.entries(response.data.feature_usage).map(([key, value]: [string, any]) => ({
            activity_type: key,
            total_count: value.total || 0,
            percentage: value.percentage || 0
          })) : [];
        
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching activity data:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      
      // Données de fallback pour éviter les erreurs d'affichage
      if (activeTab === 'daily') {
        setFilteredActivities([]);
      } else {
        setStats([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters]);

  const handleDateRangeChange = useCallback((range: { from?: Date; to?: Date }) => {
    setFilters(prev => ({
      ...prev,
      startDate: range.from ? range.from.toISOString().split('T')[0] : '',
      endDate: range.to ? range.to.toISOString().split('T')[0] : '',
    }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const reportType = activeTab === 'daily' ? 'activity_logs' : 'usage_statistics';
      const response = await fullApiService.generateReport(
        reportType,
        { filters, period: '30d' },
        'csv'
      );
      
      if (response.data?.download_url) {
        window.open(response.data.download_url, '_blank');
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Erreur lors de l\'export des données');
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  return {
    activeTab,
    setActiveTab,
    filteredActivities,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    handleDateRangeChange,
    handleExport,
    refreshData: fetchActivityData
  };
};
