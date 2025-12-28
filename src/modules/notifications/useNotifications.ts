/**
 * Module Notifications - Hook principal
 * Hook React pour la gestion des notifications
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { notificationService } from './notificationService';
import { logger } from '@/lib/logger';
import type { Notification, NotificationFilters, NotificationStats } from './types';

const LOG_CONTEXT = 'useNotifications';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  loading: boolean;
  error: Error | null;
  
  // Actions
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  togglePin: (id: string, pinned: boolean) => Promise<void>;
  snooze: (id: string, until: Date) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  
  // Pagination
  hasMore: boolean;
}

export const useNotifications = (
  filters?: NotificationFilters,
  pageSize = 20
): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Charger les notifications
  const loadNotifications = useCallback(async (reset = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : offset;
      const data = await notificationService.getNotifications(
        user.id,
        filters,
        pageSize,
        currentOffset
      );

      if (reset) {
        setNotifications(data);
        setOffset(pageSize);
      } else {
        setNotifications(prev => [...prev, ...data]);
        setOffset(currentOffset + pageSize);
      }

      setHasMore(data.length === pageSize);

      // Charger stats et unread count
      const [count, statsData] = await Promise.all([
        notificationService.getUnreadCount(user.id),
        notificationService.getStats(user.id),
      ]);

      setUnreadCount(count);
      setStats(statsData);
    } catch (err) {
      setError(err as Error);
      logger.error('Failed to load notifications', err as Error, LOG_CONTEXT);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters, pageSize, offset]);

  // Subscription temps réel
  useEffect(() => {
    if (!user?.id) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtime = async () => {
      channel = supabase
        .channel(`notifications_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            logger.debug('Realtime notification event', LOG_CONTEXT);

            if (payload.eventType === 'INSERT') {
              const newNotif = payload.new as Notification;
              setNotifications(prev => [newNotif, ...prev]);
              setUnreadCount(prev => prev + 1);
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Notification;
              setNotifications(prev =>
                prev.map(n => n.id === updated.id ? updated : n)
              );
              // Recalculer unread si nécessaire
              if (updated.read && !(payload.old as Notification).read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            } else if (payload.eventType === 'DELETE') {
              const deleted = payload.old as Notification;
              setNotifications(prev => prev.filter(n => n.id !== deleted.id));
              if (!deleted.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            }
          }
        )
        .subscribe();
    };

    loadNotifications(true);
    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  // Actions
  const markAsRead = useCallback(async (id: string) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    const success = await notificationService.markAllAsRead(user.id);
    if (success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }
  }, [user?.id]);

  const togglePin = useCallback(async (id: string, pinned: boolean) => {
    const success = await notificationService.togglePin(id, pinned);
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, pinned } : n)
      );
    }
  }, []);

  const snooze = useCallback(async (id: string, until: Date) => {
    const success = await notificationService.snoozeNotification(id, until);
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, snoozed_until: until.toISOString() } : n)
      );
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    const success = await notificationService.deleteNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notif && !notif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  }, [notifications]);

  const deleteAllRead = useCallback(async () => {
    if (!user?.id) return;
    const success = await notificationService.deleteReadNotifications(user.id);
    if (success) {
      setNotifications(prev => prev.filter(n => !n.read || n.pinned));
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await loadNotifications(true);
  }, [loadNotifications]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadNotifications(false);
  }, [hasMore, loading, loadNotifications]);

  return {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    togglePin,
    snooze,
    deleteNotification,
    deleteAllRead,
    refresh,
    loadMore,
    hasMore,
  };
};
