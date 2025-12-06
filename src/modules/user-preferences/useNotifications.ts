/**
 * Hook React pour les notifications
 */

import { useState, useCallback, useEffect } from 'react';
import { UserPreferencesService } from './userPreferencesService';
import type { Notification, CreateNotification } from './types';
import { logger } from '@/lib/logger';

interface UseNotificationsOptions {
  userId: string;
  autoLoad?: boolean;
  unreadOnly?: boolean;
  pollInterval?: number; // ms
}

export const useNotifications = (options: UseNotificationsOptions) => {
  const { userId, autoLoad = true, unreadOnly = false, pollInterval } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Charger les notifications
   */
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await UserPreferencesService.getUserNotifications(userId, {
        unreadOnly
      });
      setNotifications(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, unreadOnly]);

  /**
   * Charger le nombre de notifications non lues
   */
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await UserPreferencesService.getUnreadNotificationCount(
        userId
      );
      setUnreadCount(count);
    } catch (err) {
      logger.error('Failed to load unread count:', err, 'MODULE');
    }
  }, [userId]);

  /**
   * Créer une notification
   */
  const createNotification = useCallback(
    async (notification: CreateNotification) => {
      setError(null);

      try {
        const created = await UserPreferencesService.createNotification(
          notification
        );
        setNotifications((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Marquer comme lue
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      setError(null);

      try {
        await UserPreferencesService.markNotificationAsRead(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, read: true, read_at: new Date().toISOString() }
              : n
          )
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Marquer toutes comme lues
   */
  const markAllAsRead = useCallback(async () => {
    setError(null);

    try {
      await UserPreferencesService.markAllNotificationsAsRead(userId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
          read_at: n.read_at || new Date().toISOString()
        }))
      );

      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [userId]);

  /**
   * Supprimer une notification
   */
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      setError(null);

      try {
        await UserPreferencesService.deleteNotification(notificationId);

        // Update local state
        const wasUnread = notifications.find((n) => n.id === notificationId)
          ?.read === false;
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    [notifications]
  );

  /**
   * Archiver une notification
   */
  const archiveNotification = useCallback(
    async (notificationId: string) => {
      setError(null);

      try {
        await UserPreferencesService.archiveNotification(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, archived: true } : n
          )
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    []
  );

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [autoLoad, loadNotifications, loadUnreadCount]);

  // Polling for new notifications
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [pollInterval, loadNotifications, loadUnreadCount]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,

    // Methods
    loadNotifications,
    loadUnreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    refresh: loadNotifications
  };
};
