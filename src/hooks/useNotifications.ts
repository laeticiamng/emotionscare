/**
 * useNotifications - Hook de gestion des notifications avec persistance Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: 'system' | 'security' | 'social' | 'achievement' | 'reminder' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  read_at?: string;
  action_link?: string;
  action_text?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
  expires_at?: string;
}

interface FilterOptions {
  tab: string;
  search?: string;
}

const STORAGE_KEY = 'notifications_cache';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Charger les notifications depuis Supabase ou localStorage
  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      // Charger depuis localStorage si pas d'utilisateur
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        // Fallback: charger depuis localStorage
        logger.warn('Failed to load notifications from Supabase, using cache', fetchError, 'NOTIFICATIONS');
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setNotifications(JSON.parse(cached));
        }
      } else {
        const notifs = (data as Notification[]) || [];
        setNotifications(notifs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
      }
    } catch (err) {
      logger.error('Failed to load notifications', err as Error, 'NOTIFICATIONS');
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger au montage et quand l'utilisateur change
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Souscrire aux notifications en temps réel
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          
          // Afficher une notification navigateur si supporté
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true, read_at: new Date().toISOString() }
          : notification
      )
    );

    // Persister dans Supabase
    if (user?.id) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true, read_at: new Date().toISOString() })
          .eq('id', notificationId);
      } catch (err) {
        logger.error('Failed to mark notification as read', err as Error, 'NOTIFICATIONS');
      }
    }

    // Mettre à jour le cache
    setNotifications((current) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    });
  }, [user?.id]);

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true, read_at: now }))
    );

    // Persister dans Supabase
    if (user?.id) {
      try {
        const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) {
          await supabase
            .from('notifications')
            .update({ read: true, read_at: now })
            .in('id', unreadIds);
        }
      } catch (err) {
        logger.error('Failed to mark all notifications as read', err as Error, 'NOTIFICATIONS');
      }
    }

    setNotifications((current) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    });
  }, [user?.id, notifications]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );

    // Supprimer de Supabase
    if (user?.id) {
      try {
        await supabase.from('notifications').delete().eq('id', notificationId);
      } catch (err) {
        logger.error('Failed to delete notification', err as Error, 'NOTIFICATIONS');
      }
    }

    setNotifications((current) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    });
  }, [user?.id]);

  const filterNotifications = useCallback((notifs: Notification[], options: FilterOptions) => {
    let filtered = [...notifs];

    // Filtrer par tab
    if (options.tab === 'unread') {
      filtered = filtered.filter((n) => !n.read);
    } else if (options.tab !== 'all') {
      filtered = filtered.filter((n) => n.category === options.tab);
    }

    // Filtrer par recherche
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.message.toLowerCase().includes(searchLower)
      );
    }

    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
  }, []);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      user_id: user?.id || 'anonymous',
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Persister dans Supabase
    if (user?.id) {
      try {
        await supabase.from('notifications').insert(newNotification);
      } catch (err) {
        logger.error('Failed to add notification', err as Error, 'NOTIFICATIONS');
      }
    }

    setNotifications((current) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    });

    return newNotification;
  }, [user?.id]);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
    addNotification,
    refreshNotifications: loadNotifications,
    requestPermission,
  };
};
