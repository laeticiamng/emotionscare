
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type ActivityType = 'music' | 'ar' | 'journal' | 'meditation' | 'session' | 'settings';

interface ActivityLog {
  userId: string;
  type: ActivityType;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const useActivityLogging = (type: ActivityType) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Log a new user action
  const logUserAction = useCallback((action: string, metadata?: Record<string, any>) => {
    if (!user?.id) return;
    
    const newLog: ActivityLog = {
      userId: user.id,
      type,
      action,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    setLogs(prev => [...prev, newLog]);
    
    // In a real app, this would be persisted to a database
    console.log('Activity logged:', newLog);
    
    return newLog;
  }, [user?.id, type]);
  
  // Load user activity history
  const loadActivityHistory = useCallback(async () => {
    if (!user?.id) return [];
    
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API/database
      // Simulated delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockLogs: ActivityLog[] = [];
      setLogs(mockLogs);
      return mockLogs;
    } catch (error) {
      console.error('Error loading activity history:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    // Optionally load history when component mounts
    // loadActivityHistory();
  }, [loadActivityHistory]);
  
  return {
    logs,
    isLoading,
    logUserAction,
    loadActivityHistory
  };
};
