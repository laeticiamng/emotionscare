
import { useState, useEffect } from 'react';
import { notificationService, Notification, NotificationSettings } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());

  useEffect(() => {
    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    notificationService.updateSettings(newSettings);
    setSettings(notificationService.getSettings());
  };

  const sendNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    await notificationService.sendNotification(notification);
  };

  return {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updateSettings,
    sendNotification
  };
};
