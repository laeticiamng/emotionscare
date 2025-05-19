
import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // In a real app, we'd fetch from an API
      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'achievement',
          title: 'Badge débloqué!',
          message: 'Vous avez débloqué le badge "Premier pas"',
          read: false,
          createdAt: new Date(Date.now() - 3600000),
          actionUrl: '/profile/badges',
          imageUrl: '/badges/first-step.png',
          priority: 'normal'
        },
        {
          id: '2',
          type: 'reminder',
          title: 'Rappel de méditation',
          message: 'Votre séance de méditation quotidienne vous attend',
          read: true,
          createdAt: new Date(Date.now() - 86400000),
          actionUrl: '/meditation'
        },
        {
          id: '3',
          type: 'invitation' as NotificationType,
          title: 'Invitation à rejoindre un groupe',
          message: 'Marie vous invite à rejoindre "Méditation matinale"',
          read: false,
          createdAt: new Date(Date.now() - 172800000),
          actionUrl: '/groups/invites'
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // In a real app, we'd call an API
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // In a real app, we'd call an API
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // In a real app, we'd call an API
      const notification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count if needed
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast for the new notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
      variant: 'default',
      action: notification.actionUrl ? {
        label: 'Voir',
        onClick: () => {
          window.location.href = notification.actionUrl || '#';
          markAsRead(newNotification.id);
        }
      } : undefined
    });
  }, [markAsRead, toast]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refresh: fetchNotifications
  };
};
