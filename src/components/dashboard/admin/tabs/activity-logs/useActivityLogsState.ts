
import { useState } from 'react';
import { ActivityTabView, AnonymousActivity, ActivityStats } from './types';

// Mock data for demo
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
  }
];

interface UseActivityLogsStateResult {
  activeTab: ActivityTabView;
  setActiveTab: (tab: ActivityTabView) => void;
  activities: AnonymousActivity[];
  stats: ActivityStats[];
  filteredActivities: AnonymousActivity[];
  filteredStats: ActivityStats[];
  isLoading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  }>>;
  handleDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

export const useActivityLogsState = (): UseActivityLogsStateResult => {
  const [activeTab, setActiveTab] = useState<ActivityTabView>("daily");
  const [activities, setActivities] = useState<AnonymousActivity[]>(mockActivities);
  const [stats, setStats] = useState<ActivityStats[]>(mockStats);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>(mockActivities);
  const [filteredStats, setFilteredStats] = useState<ActivityStats[]>(mockStats);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fix by using string-based date representation
  const [filters, setFilters] = useState({
    searchTerm: '',
    activityType: '',
    startDate: '',
    endDate: ''
  });

  // Handle date range selection
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters({
      ...filters,
      startDate: range.from ? range.from.toISOString() : '',
      endDate: range.to ? range.to.toISOString() : '',
    });
  };

  return {
    activeTab,
    setActiveTab,
    activities,
    stats,
    filteredActivities,
    filteredStats,
    isLoading,
    error,
    filters,
    setFilters,
    handleDateRangeChange
  };
};
