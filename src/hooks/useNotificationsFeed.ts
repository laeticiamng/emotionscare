// @ts-nocheck

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'suggestion' | 'alert';
  timestamp: Date;
  read: boolean;
  actionButton?: {
    text: string;
    action: () => void;
  };
}

export const useNotificationsFeed = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('generate-notifications-feed', {
        body: { 
          userId: (await supabase.auth.getUser()).data.user?.id,
          limit: 20 
        }
      });

      if (error) throw error;

      // Transform backend data to frontend format
      const transformedNotifications = data.notifications?.map((notif: any) => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type || 'reminder',
        timestamp: new Date(notif.created_at),
        read: notif.read || false,
        actionButton: notif.action_button ? {
          text: notif.action_button.text,
          action: () => handleNotificationAction(notif.action_button.action)
        } : undefined
      })) || [];

      setNotifications(transformedNotifications);
      
      toast.success(`${transformedNotifications.length} notifications chargées`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des notifications';
      setError(errorMessage);
      logger.error('Error fetching notifications', err as Error, 'SYSTEM');
      
      // Fallback with mock data for development
      setNotifications([
        {
          id: '1',
          title: '💧 Hydratation',
          message: 'Il est temps de boire un verre d\'eau !',
          type: 'reminder',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          title: '🏆 Bien joué !',
          message: 'Vous avez complété votre défi quotidien',
          type: 'achievement',
          timestamp: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: '3',
          title: '🧘 Moment zen',
          message: 'Que diriez-vous d\'une session de respiration ?',
          type: 'suggestion',
          timestamp: new Date(Date.now() - 7200000),
          read: true
        }
      ]);
      
      toast.error('Mode développement : notifications simulées');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.functions.invoke('mark-notification-read', {
        body: { notificationId }
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (err) {
      logger.error('Error marking notification as read', err as Error, 'SYSTEM');
    }
  };

  const handleNotificationAction = (action: string) => {
    // Handle different notification actions
    switch (action) {
      case 'open_breathwork':
        window.location.href = '/breathwork';
        break;
      case 'scan_mood':
        window.location.href = '/scan';
        break;
      case 'play_music':
        window.location.href = '/music';
        break;
      default:
        logger.debug('Unknown notification action', { action }, 'SYSTEM');
    }
  };

  const createNotification = async (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-notification', {
        body: notification
      });

      if (error) throw error;

      const newNotification: NotificationItem = {
        ...notification,
        id: data.id,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      logger.error('Error creating notification', err as Error, 'SYSTEM');
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    createNotification,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
