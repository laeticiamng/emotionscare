import { useState, useEffect, useCallback } from 'react';
import { fullApiService } from '@/services/api/fullApiService';
import { logger } from '@/lib/logger';

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
        // Mock data for daily activities
        const mockActivities: AnonymousActivity[] = [
          {
            id: '1',
            activity_type: 'login',
            category: 'authentication',
            count: 25,
            timestamp_day: '2025-10-01'
          },
          {
            id: '2',
            activity_type: 'scan_emotion',
            category: 'wellness',
            count: 18,
            timestamp_day: '2025-10-01'
          },
          {
            id: '3',
            activity_type: 'journal_entry',
            category: 'wellness',
            count: 12,
            timestamp_day: '2025-10-02'
          }
        ];
        
        // Apply filters
        let filtered = [...mockActivities];
        
        if (filters.searchTerm) {
          filtered = filtered.filter(item => 
            item.activity_type.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }
        
        if (filters.activityType && filters.activityType !== 'all') {
          filtered = filtered.filter(item => item.activity_type === filters.activityType);
        }
        
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
        
        setFilteredActivities(filtered);
      } else {
        // Mock stats data
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
        
        setStats(mockStats);
      }
    } catch (err) {
      logger.error('Error fetching activity data:', err);
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
      // Simple CSV export from current data
      const data = activeTab === 'daily' ? filteredActivities : stats;
      const csv = activeTab === 'daily'
        ? [
            'ID,Type,Catégorie,Compte,Date',
            ...filteredActivities.map(a => `${a.id},${a.activity_type},${a.category},${a.count},${a.timestamp_day}`)
          ].join('\n')
        : [
            'Type,Total,Pourcentage',
            ...stats.map(s => `${s.activity_type},${s.total_count},${s.percentage}`)
          ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `activity-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      logger.error('Error exporting data:', err);
      setError('Erreur lors de l\'export des données');
    }
  }, [activeTab, filteredActivities, stats]);

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
