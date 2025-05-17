
import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType, NotificationFilter } from '@/types/notification';

interface UseNotificationsOptions {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useNotifications = (
  initialFilter: NotificationFilter = 'all',
  options: UseNotificationsOptions = {}
) => {
  const { limit = 10, autoRefresh = false, refreshInterval = 60000 } = options;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationFilter | null>(initialFilter);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch notifications based on current filter and page
  const fetchNotifications = useCallback(async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockNotifications: Notification[] = [];
      for (let i = 1; i <= limit; i++) {
        const notifId = (currentPage - 1) * limit + i;
        mockNotifications.push({
          id: `notif-${notifId}`,
          title: `Notification #${notifId}`,
          message: `This is the content of notification #${notifId}`,
          type: (notifId % 6 === 0) ? 'badge' : 
                 (notifId % 5 === 0) ? 'emotion' :
                 (notifId % 4 === 0) ? 'journal' :
                 (notifId % 3 === 0) ? 'system' : 
                 (notifId % 2 === 0) ? 'reminder' : 'info',
          read: notifId % 3 !== 0,
          created_at: new Date(Date.now() - notifId * 3600000).toISOString(),
          timestamp: new Date(Date.now() - notifId * 3600000).toISOString(),
          user_id: 'current-user'
        });
      }
      
      // Apply filters if specified
      const filteredNotifs = filter && filter !== 'all' 
        ? filter === 'unread' 
          ? mockNotifications.filter(n => !n.read) 
          : filter === 'read' 
            ? mockNotifications.filter(n => n.read)
            : mockNotifications.filter(n => n.type === filter)
        : mockNotifications;
      
      if (reset) {
        setNotifications(filteredNotifs);
        setPage(1);
      } else {
        setNotifications(prev => [...prev, ...filteredNotifs]);
        setPage(currentPage + 1);
      }
      
      // Count unread notifications
      const unread = mockNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      // Check if there are more notifications to fetch
      setHasMore(mockNotifications.length === limit);
      
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filter]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(true);
  }, [filter]);

  // Auto refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    setUnreadCount(0);
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notifToDelete = prev.find(n => n.id === id);
      const newNotifs = prev.filter(notif => notif.id !== id);
      
      // Update unread count if needed
      if (notifToDelete && !notifToDelete.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return newNotifs;
    });
  }, []);

  // Filter notifications
  const filterNotifications = useCallback((newFilter: NotificationFilter) => {
    if (filter === newFilter) return;
    setFilter(newFilter);
    // Reset will happen due to the useEffect
  }, [filter]);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchNotifications();
  }, [isLoading, hasMore, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    filter: filter || 'all',
    setFilter: filterNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: () => fetchNotifications(true)
  };
};

export default useNotifications;
