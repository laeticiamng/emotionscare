
import { useState, useEffect } from 'react';
import { Notification, NotificationSettings } from '@/types/notifications';
import { notificationService } from '@/services/notificationService';

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  inApp: true,
  types: {
    security: true,
    system: true,
    social: true,
    achievements: true,
    reminders: true,
  },
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // S'abonner aux notifications
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setIsLoading(false);
    });

    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }

    return unsubscribe;
  }, []);

  const sendNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    return await notificationService.sendNotification(notification);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (id: string) => {
    notificationService.removeNotification(id);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notification-settings', JSON.stringify(updatedSettings));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Méthodes utilitaires
  const sendWelcomeNotification = () => notificationService.sendWelcomeNotification();
  const sendAchievementNotification = (name: string) => notificationService.sendAchievementNotification(name);
  const sendReminderNotification = (activity: string) => notificationService.sendReminderNotification(activity);
  const sendEmotionInsight = (insight: string) => notificationService.sendEmotionInsight(insight);

  return {
    notifications,
    unreadCount,
    settings,
    isLoading,
    sendNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updateSettings,
    // Méthodes utilitaires
    sendWelcomeNotification,
    sendAchievementNotification,
    sendReminderNotification,
    sendEmotionInsight,
  };
};
