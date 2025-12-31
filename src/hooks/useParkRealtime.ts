/**
 * useParkRealtime - Hook pour notifications et mises à jour temps réel du parc
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface ParkNotification {
  id: string;
  type: 'badge' | 'quest' | 'streak' | 'weather' | 'event' | 'friend';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, unknown>;
}

export interface ParkEvent {
  id: string;
  type: 'special_event' | 'bonus' | 'challenge' | 'new_attraction';
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  bonusMultiplier?: number;
  affectedZones?: string[];
}

export function useParkRealtime() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ParkNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeEvents, setActiveEvents] = useState<ParkEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load cached notifications
  useEffect(() => {
    const cached = localStorage.getItem('park_notifications');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setNotifications(parsed.map((n: ParkNotification) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Save notifications to cache
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('park_notifications', JSON.stringify(notifications.slice(0, 50)));
    }
  }, [notifications]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`park-realtime-${user.id}`)
      .on('broadcast', { event: 'park-notification' }, (payload) => {
        const notification: ParkNotification = {
          id: crypto.randomUUID(),
          type: payload.payload.type || 'event',
          title: payload.payload.title,
          message: payload.payload.message,
          icon: payload.payload.icon || '🎉',
          timestamp: new Date(),
          read: false,
          actionUrl: payload.payload.actionUrl,
          data: payload.payload.data
        };
        setNotifications(prev => [notification, ...prev]);
      })
      .on('broadcast', { event: 'park-event' }, (payload) => {
        const event: ParkEvent = {
          id: crypto.randomUUID(),
          type: payload.payload.type,
          title: payload.payload.title,
          description: payload.payload.description,
          startsAt: new Date(payload.payload.startsAt),
          endsAt: new Date(payload.payload.endsAt),
          bonusMultiplier: payload.payload.bonusMultiplier,
          affectedZones: payload.payload.affectedZones
        };
        setActiveEvents(prev => [...prev, event]);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        logger.info('Park realtime subscription', { status }, 'PARK');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Add notification
  const addNotification = useCallback((
    type: ParkNotification['type'],
    title: string,
    message: string,
    icon = '🔔',
    actionUrl?: string
  ) => {
    const notification: ParkNotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      icon,
      timestamp: new Date(),
      read: false,
      actionUrl
    };
    setNotifications(prev => [notification, ...prev]);
    return notification.id;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('park_notifications');
  }, []);

  // Get notifications by type
  const getByType = useCallback((type: ParkNotification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Notify badge unlock
  const notifyBadgeUnlock = useCallback((badgeName: string, badgeEmoji: string) => {
    return addNotification(
      'badge',
      'Badge débloqué !',
      `Félicitations ! Vous avez obtenu le badge "${badgeName}"`,
      badgeEmoji,
      '/app/achievements'
    );
  }, [addNotification]);

  // Notify quest completion
  const notifyQuestComplete = useCallback((questTitle: string, rewards: { xp: number; coins: number }) => {
    return addNotification(
      'quest',
      'Quête terminée !',
      `${questTitle} - +${rewards.xp} XP, +${rewards.coins} pièces`,
      '🏆'
    );
  }, [addNotification]);

  // Notify streak milestone
  const notifyStreakMilestone = useCallback((days: number) => {
    return addNotification(
      'streak',
      `Série de ${days} jours !`,
      `Continuez ainsi pour débloquer des bonus exclusifs`,
      '🔥'
    );
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    activeEvents,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getByType,
    notifyBadgeUnlock,
    notifyQuestComplete,
    notifyStreakMilestone
  };
}

export default useParkRealtime;
