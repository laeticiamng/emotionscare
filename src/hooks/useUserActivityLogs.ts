
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { ActivityLog } from '@/components/admin/UserActivityTimeline';

interface UseUserActivityLogsOptions {
  userId?: string;
  limit?: number;
  page?: number;
}

interface UserActivityLogsResult {
  logs: ActivityLog[];
  totalLogs: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  fetchLogs: (options?: { page?: number; limit?: number }) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useUserActivityLogs = ({
  userId,
  limit: initialLimit = 10,
  page: initialPage = 1
}: UseUserActivityLogsOptions = {}): UserActivityLogsResult => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLogs = useCallback(async (options?: { page?: number; limit?: number }) => {
    if (!userId) {
      setLogs([]);
      setTotalLogs(0);
      return;
    }

    const page = options?.page || currentPage;
    const pageSize = options?.limit || limit;
    const startIndex = (page - 1) * pageSize;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get the total count for pagination
      const { count, error: countError } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (countError) throw new Error(countError.message);
      
      // Then fetch the paginated data
      const { data, error: fetchError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
        
      if (fetchError) throw new Error(fetchError.message);
      
      setLogs(data || []);
      setTotalLogs(count || 0);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage, limit]);
  
  // Refetch logs when dependencies change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  
  const setPage = (page: number) => {
    setCurrentPage(page);
  };
  
  return {
    logs,
    totalLogs,
    totalPages: Math.ceil(totalLogs / limit),
    currentPage,
    isLoading,
    error,
    fetchLogs,
    setPage,
    setLimit,
  };
};
