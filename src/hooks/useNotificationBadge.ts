/**
 * Hook pour le badge de notifications
 * Affiche le nombre de notifications non lues
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { RealtimeChannel } from '@supabase/supabase-js';

interface NotificationBadgeState {
  count: number;
  badgesCount: number;
  notificationsCount: number;
  isLoading: boolean;
  markAsRead: () => void;
  markAllAsRead: () => void;
}

export const useNotificationBadge = (): NotificationBadgeState => {
  const [count, setCount] = useState(0);
  const [badgesCount, setBadgesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let channel: RealtimeChannel | null = null;

    const loadCounts = async () => {
      try {
        // Charger les notifications non lues
        const { count: unreadCount, error } = await supabase
          .from('in_app_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);

        if (error) {
          if (error.code === '42P01') {
            // Table doesn't exist, silent fail
            setIsLoading(false);
            return;
          }
          throw error;
        }

        const total = unreadCount || 0;
        
        // Charger les badges non lus (type badge_unlocked)
        const { count: badges } = await supabase
          .from('in_app_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false)
          .eq('type', 'badge_unlocked');

        setBadgesCount(badges || 0);
        setNotificationsCount(total - (badges || 0));
        setCount(total);
      } catch (error) {
        logger.warn('Error loading notification counts', 'useNotificationBadge');
      } finally {
        setIsLoading(false);
      }
    };

    // Subscription temps réel
    const setupRealtime = () => {
      channel = supabase
        .channel(`notification_badge_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Recharger les compteurs à chaque changement
            loadCounts();
          }
        )
        .subscribe();
    };

    loadCounts();
    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  const markAsRead = () => {
    setCount(0);
    setBadgesCount(0);
    setNotificationsCount(0);
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('in_app_notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setCount(0);
      setBadgesCount(0);
      setNotificationsCount(0);
    } catch (error) {
      logger.error('Error marking all as read', error as Error, 'useNotificationBadge');
    }
  };

  return {
    count,
    badgesCount,
    notificationsCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};
