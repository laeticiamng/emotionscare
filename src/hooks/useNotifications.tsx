import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notifications';
import { logger } from '@/lib/logger';

// Local filter type used by this hook

export type NotificationFilter = 'all' | 'unread' | 'invitation' | 'reminder' | 'system';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch notifications from Supabase
  const fetchNotifications = async (selectedFilter: NotificationFilter = filter) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filter
      if (selectedFilter === 'unread') {
        query = query.eq('is_read', false);
      } else if (selectedFilter !== 'all') {
        query = query.eq('type', selectedFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to Notification format
      const transformedNotifications: Notification[] = (data || []).map(n => ({
        id: n.id,
        type: n.type as Notification['type'],
        title: n.title,
        message: n.message,
        date: n.created_at,
        isRead: n.is_read,
        linkTo: n.action_url || '/dashboard'
      }));

      setNotifications(transformedNotifications);

      // Get unread count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setUnreadCount(count || 0);

    } catch (error) {
      logger.error('Error fetching notifications', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Error marking notification as read', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer la notification comme lue',
        variant: 'destructive',
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );

      // Update unread count
      setUnreadCount(0);
    } catch (error) {
      logger.error('Error marking all notifications as read', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer toutes les notifications comme lues',
        variant: 'destructive',
      });
    }
  };
  
  // Fetch notifications on mount and when filter changes
  useEffect(() => {
    if (user) {
      void fetchNotifications(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user]);
  
  // Simulate real-time notification (in a real app, this would be a WebSocket connection)
  useEffect(() => {
    if (!user) return;
    
    const simulateNewNotification = () => {
      const newNotification: Notification = {
        id: `new-${Date.now()}`,
        type: Math.random() > 0.5 ? 'info' : 'reminder',
        title: 'Nouvelle notification',
        message: `Ceci est une notification simulée générée à ${new Date().toLocaleTimeString()}`,
        date: new Date().toISOString(),
        isRead: false,
        linkTo: '/dashboard'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast({
        title: 'Nouvelle notification',
        description: newNotification.message,
      });
    };
    
    // Uncomment for demo purposes
    // const interval = setInterval(simulateNewNotification, 30000); // New notification every 30 seconds
    // return () => clearInterval(interval);
  }, [user, toast]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
