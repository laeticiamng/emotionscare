import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface InAppNotification {
  id: string;
  user_id: string;
  type: 'badge_progress' | 'badge_unlocked' | 'challenge_near_completion' | 'new_challenge';
  title: string;
  message?: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const useInAppNotifications = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('in_app_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          // Table might not exist - log warning and continue with empty state
          logger.warn('Notifications table not available:', error.message, 'HOOK');
          setLoading(false);
          return;
        }
        
        const notifs = data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      } catch (error) {
        logger.warn('Error fetching notifications (table may not exist):', error, 'HOOK');
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('in_app_notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            logger.debug('Notification change received:', payload, 'HOOK');
            
            if (payload.eventType === 'INSERT') {
              setNotifications(prev => [payload.new as InAppNotification, ...prev.slice(0, 9)]);
              setUnreadCount(prev => prev + 1);
            } else if (payload.eventType === 'UPDATE') {
              setNotifications(prev =>
                prev.map(n => n.id === payload.new.id ? payload.new as InAppNotification : n)
              );
              if ((payload.new as InAppNotification).read && !(payload.old as InAppNotification).read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            } else if (payload.eventType === 'DELETE') {
              setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
              if (!(payload.old as InAppNotification).read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            }
          }
        )
        .subscribe();
    };

    fetchNotifications();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        logger.warn('Error marking notification as read (table may not exist):', error.message, 'HOOK');
      }
    } catch (error) {
      logger.warn('Error marking notification as read:', error, 'HOOK');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('in_app_notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        logger.warn('Error marking all as read (table may not exist):', error.message, 'HOOK');
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      logger.warn('Error marking all as read:', error, 'HOOK');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        logger.warn('Error deleting notification (table may not exist):', error.message, 'HOOK');
      }
    } catch (error) {
      logger.warn('Error deleting notification:', error, 'HOOK');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};