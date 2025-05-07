
import { useState, useEffect } from 'react';
import { AnonymousActivity, ActivityStats, ActivityTabView } from '../../dashboard/admin/tabs/activity-logs/types';
import { getActivityData, getActivityStats } from '@/lib/activityLogService';
import { useToast } from '@/hooks/use-toast';

interface UseUserActivityLogStateResult {
  activeTab: ActivityTabView;
  setActiveTab: (tab: ActivityTabView) => void;
  activities: AnonymousActivity[];
  filteredActivities: AnonymousActivity[];
  stats: ActivityStats[];
  isLoading: boolean;
  error: string | null;
  filters: {
    startDate: string;
    endDate: string;
    activityType: string;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
    activityType: string;
    searchTerm: string;
  }>>;
  handleDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  handleExport: () => void;
}

export const useUserActivityLogState = (): UseUserActivityLogStateResult => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActivityTabView>('daily');
  const [activities, setActivities] = useState<AnonymousActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use string-based date representation
  const [filters, setFilters] = useState({
    searchTerm: '',
    activityType: 'all',
    startDate: '',
    endDate: ''
  });

  // Fetch activity data
  useEffect(() => {
    console.log("useUserActivityLogState: Fetching activity data...");
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      getActivityData(),
      getActivityStats()
    ])
      .then(([activitiesData, statsData]) => {
        console.log("useUserActivityLogState: Data fetched successfully", { 
          activitiesLength: activitiesData.length, 
          statsLength: statsData.length 
        });
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);
        setStats(statsData);
      })
      .catch(err => {
        console.error("Error fetching activity data:", err);
        setError("Impossible de charger les données d'activité");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'activité",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  // Apply filters when they change
  useEffect(() => {
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
  }, [filters, activities]);

  // Handle date range selection
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters({
      ...filters,
      startDate: range.from ? range.from.toISOString() : '',
      endDate: range.to ? range.to.toISOString() : ''
    });
  };

  // Export data functionality
  const handleExport = () => {
    try {
      const dataToExport = activeTab === 'daily' ? filteredActivities : stats;
      const headers = activeTab === 'daily' 
        ? ['ID', 'Type', 'Catégorie', 'Nombre', 'Date']
        : ['Type', 'Nombre total', 'Pourcentage'];
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => {
          if (activeTab === 'daily') {
            const dailyItem = item as AnonymousActivity;
            return [
              dailyItem.id,
              dailyItem.activity_type,
              dailyItem.category,
              dailyItem.count,
              dailyItem.timestamp_day
            ].join(',');
          } else {
            const statItem = item as ActivityStats;
            return [
              statItem.activity_type,
              statItem.total_count,
              statItem.percentage.toFixed(1) + '%'
            ].join(',');
          }
        })
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `activity-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Succès",
        description: "Données exportées avec succès",
      });
    } catch (err) {
      console.error("Error exporting data:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'exportation des données",
        variant: "destructive"
      });
    }
  };

  console.log("useUserActivityLogState: Returning state", { 
    activeTab, 
    activitiesCount: activities.length,
    filteredActivitiesCount: filteredActivities.length,
    statsCount: stats.length,
    isLoading, 
    error 
  });

  return {
    activeTab,
    setActiveTab,
    activities,
    filteredActivities,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    handleDateRangeChange,
    handleExport
  };
};
