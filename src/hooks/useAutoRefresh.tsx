
import { useState, useEffect, useCallback } from 'react';

type AutoRefreshPreferences = {
  enabled: boolean;
  interval: number;
};

interface AutoRefreshProps {
  onRefresh: () => void;
  defaultEnabled?: boolean;
  defaultInterval?: number;
}

export function useAutoRefresh({ 
  onRefresh, 
  defaultEnabled = false, 
  defaultInterval = 60000 
}: AutoRefreshProps) {
  // Load saved preferences from localStorage
  const loadSavedPreferences = (): AutoRefreshPreferences => {
    try {
      const saved = localStorage.getItem('dashboard.autoRefresh');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading auto-refresh preferences:', error);
    }
    return { enabled: defaultEnabled, interval: defaultInterval };
  };

  const [refreshing, setRefreshing] = useState(false);
  const [preferences, setPreferences] = useState<AutoRefreshPreferences>(loadSavedPreferences);
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard.autoRefresh', JSON.stringify(preferences));
  }, [preferences]);

  // Toggle auto-refresh on/off
  const toggleAutoRefresh = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  }, []);

  // Change the refresh interval
  const changeInterval = useCallback((newInterval: number) => {
    setPreferences(prev => ({
      ...prev,
      interval: newInterval
    }));
  }, []);

  // Handle the refresh cycle
  useEffect(() => {
    if (!preferences.enabled) return;
    
    const handleRefresh = async () => {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error during auto-refresh:', error);
      } finally {
        setRefreshing(false);
      }
    };

    const id = setInterval(handleRefresh, preferences.interval);
    return () => clearInterval(id);
  }, [preferences.enabled, preferences.interval, onRefresh]);

  return {
    enabled: preferences.enabled,
    interval: preferences.interval,
    refreshing,
    toggleAutoRefresh,
    changeInterval
  };
}
