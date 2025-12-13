// @ts-nocheck

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

/** Type de notification */
export type NotificationType =
  | 'badge'
  | 'message'
  | 'achievement'
  | 'reminder'
  | 'system'
  | 'social'
  | 'health'
  | 'challenge';

/** Priorité de notification */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/** Statut de notification */
export type NotificationStatus = 'unread' | 'read' | 'dismissed' | 'actioned';

/** Notification individuelle */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  groupId?: string;
}

/** Groupe de notifications */
export interface NotificationGroup {
  id: string;
  type: NotificationType;
  count: number;
  latestNotification: Notification;
  notifications: Notification[];
}

/** Compteurs par type */
export interface NotificationCounts {
  total: number;
  unread: number;
  badges: number;
  messages: number;
  achievements: number;
  reminders: number;
  system: number;
  social: number;
  health: number;
  challenges: number;
}

/** Configuration du hook */
export interface UseNotificationBadgeConfig {
  enableRealtime?: boolean;
  pollInterval?: number;
  maxNotifications?: number;
  groupByType?: boolean;
  autoMarkAsRead?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  onNewNotification?: (notification: Notification) => void;
}

const DEFAULT_CONFIG: UseNotificationBadgeConfig = {
  enableRealtime: true,
  pollInterval: 30000,
  maxNotifications: 100,
  groupByType: true,
  autoMarkAsRead: false,
  soundEnabled: true,
  vibrationEnabled: true
};

/** Résultat du hook */
export interface NotificationBadgeResult {
  // Compteurs
  count: number;
  counts: NotificationCounts;
  badgesCount: number;
  notificationsCount: number;
  unreadCount: number;

  // Notifications
  notifications: Notification[];
  unreadNotifications: Notification[];
  groups: NotificationGroup[];

  // État
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;

  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsReadByType: (type: NotificationType) => Promise<void>;
  dismiss: (notificationId: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;

  // Utilitaires
  getByType: (type: NotificationType) => Notification[];
  getUnreadByType: (type: NotificationType) => Notification[];
  hasUnread: boolean;
  hasUnreadOfType: (type: NotificationType) => boolean;
}

export const useNotificationBadge = (
  config?: Partial<UseNotificationBadgeConfig>
): NotificationBadgeResult => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const subscriptionRef = useRef<any>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Jouer un son de notification
  const playNotificationSound = useCallback(() => {
    if (!mergedConfig.soundEnabled) return;
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
  }, [mergedConfig.soundEnabled]);

  // Vibrer
  const vibrate = useCallback(() => {
    if (!mergedConfig.vibrationEnabled || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate(200);
    } catch {}
  }, [mergedConfig.vibrationEnabled]);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(mergedConfig.maxNotifications!);

      if (fetchError) throw fetchError;

      if (data) {
        const mapped: Notification[] = data.map(n => ({
          id: n.id,
          type: n.type as NotificationType,
          title: n.title,
          message: n.message,
          priority: n.priority as NotificationPriority || 'normal',
          status: n.status as NotificationStatus || 'unread',
          createdAt: new Date(n.created_at),
          readAt: n.read_at ? new Date(n.read_at) : undefined,
          actionUrl: n.action_url,
          imageUrl: n.image_url,
          metadata: n.metadata,
          groupId: n.group_id
        }));

        setNotifications(mapped);
        setLastUpdated(new Date());
      }
    } catch (err) {
      const error = err as Error;
      logger.error('Error loading notifications', error, 'SYSTEM');
      setError(error);

      // Fallback aux données mock
      const mockNotifications: Notification[] = [];
      const types: NotificationType[] = ['badge', 'message', 'achievement', 'reminder'];

      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        mockNotifications.push({
          id: `mock_${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          title: `Notification ${i + 1}`,
          message: 'Ceci est une notification de test',
          priority: 'normal',
          status: Math.random() > 0.5 ? 'unread' : 'read',
          createdAt: new Date(Date.now() - Math.random() * 86400000)
        });
      }

      setNotifications(mockNotifications);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, mergedConfig.maxNotifications]);

  // Configurer le temps réel
  useEffect(() => {
    if (!user?.id || !mergedConfig.enableRealtime) return;

    const channel = supabase
      .channel(`notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: payload.new.type,
            title: payload.new.title,
            message: payload.new.message,
            priority: payload.new.priority || 'normal',
            status: 'unread',
            createdAt: new Date(payload.new.created_at),
            actionUrl: payload.new.action_url,
            imageUrl: payload.new.image_url,
            metadata: payload.new.metadata
          };

          setNotifications(prev => [newNotification, ...prev]);
          playNotificationSound();
          vibrate();
          mergedConfig.onNewNotification?.(newNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev =>
            prev.map(n =>
              n.id === payload.new.id
                ? { ...n, status: payload.new.status, readAt: payload.new.read_at ? new Date(payload.new.read_at) : undefined }
                : n
            )
          );
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [user?.id, mergedConfig.enableRealtime, playNotificationSound, vibrate, mergedConfig.onNewNotification]);

  // Polling de secours
  useEffect(() => {
    if (!user?.id) return;

    loadNotifications();

    if (mergedConfig.pollInterval && mergedConfig.pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        loadNotifications();
      }, mergedConfig.pollInterval);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user?.id, mergedConfig.pollInterval, loadNotifications]);

  // Marquer comme lu
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, status: 'read' as NotificationStatus, readAt: new Date() }
            : n
        )
      );
    } catch (err) {
      logger.error('Failed to mark notification as read', err as Error, 'SYSTEM');
    }
  }, []);

  // Marquer tout comme lu
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'unread');

      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' as NotificationStatus, readAt: new Date() }))
      );
    } catch (err) {
      logger.error('Failed to mark all notifications as read', err as Error, 'SYSTEM');
    }
  }, [user?.id]);

  // Marquer par type comme lu
  const markAsReadByType = useCallback(async (type: NotificationType) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('type', type)
        .eq('status', 'unread');

      setNotifications(prev =>
        prev.map(n =>
          n.type === type
            ? { ...n, status: 'read' as NotificationStatus, readAt: new Date() }
            : n
        )
      );
    } catch (err) {
      logger.error('Failed to mark notifications by type as read', err as Error, 'SYSTEM');
    }
  }, [user?.id]);

  // Supprimer une notification
  const dismiss = useCallback(async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ status: 'dismissed' })
        .eq('id', notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      logger.error('Failed to dismiss notification', err as Error, 'SYSTEM');
    }
  }, []);

  // Supprimer toutes les notifications
  const dismissAll = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('notifications')
        .update({ status: 'dismissed' })
        .eq('user_id', user.id);

      setNotifications([]);
    } catch (err) {
      logger.error('Failed to dismiss all notifications', err as Error, 'SYSTEM');
    }
  }, [user?.id]);

  // Rafraîchir
  const refresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Notifications non lues
  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => n.status === 'unread');
  }, [notifications]);

  // Compteurs par type
  const counts = useMemo((): NotificationCounts => {
    const countByType = (type: NotificationType, unreadOnly = false) => {
      return notifications.filter(n =>
        n.type === type && (!unreadOnly || n.status === 'unread')
      ).length;
    };

    return {
      total: notifications.length,
      unread: unreadNotifications.length,
      badges: countByType('badge'),
      messages: countByType('message'),
      achievements: countByType('achievement'),
      reminders: countByType('reminder'),
      system: countByType('system'),
      social: countByType('social'),
      health: countByType('health'),
      challenges: countByType('challenge')
    };
  }, [notifications, unreadNotifications.length]);

  // Groupes de notifications
  const groups = useMemo((): NotificationGroup[] => {
    if (!mergedConfig.groupByType) return [];

    const groupMap = new Map<NotificationType, Notification[]>();

    notifications.forEach(n => {
      if (!groupMap.has(n.type)) {
        groupMap.set(n.type, []);
      }
      groupMap.get(n.type)!.push(n);
    });

    return Array.from(groupMap.entries()).map(([type, notifs]) => ({
      id: type,
      type,
      count: notifs.length,
      latestNotification: notifs[0],
      notifications: notifs
    }));
  }, [notifications, mergedConfig.groupByType]);

  // Utilitaires
  const getByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getUnreadByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type && n.status === 'unread');
  }, [notifications]);

  const hasUnreadOfType = useCallback((type: NotificationType) => {
    return notifications.some(n => n.type === type && n.status === 'unread');
  }, [notifications]);

  return {
    // Compteurs
    count: counts.unread,
    counts,
    badgesCount: counts.badges,
    notificationsCount: counts.total,
    unreadCount: counts.unread,

    // Notifications
    notifications,
    unreadNotifications,
    groups,

    // État
    isLoading,
    error,
    lastUpdated,

    // Actions
    markAsRead,
    markAllAsRead,
    markAsReadByType,
    dismiss,
    dismissAll,
    refresh,
    clearError,

    // Utilitaires
    getByType,
    getUnreadByType,
    hasUnread: counts.unread > 0,
    hasUnreadOfType
  };
};

export default useNotificationBadge;
