/**
 * Hook pour la gestion des notifications
 */

import { useState, useCallback, useEffect } from 'react';
import type { Notification, NotificationPreferences } from '../types';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  channels: {
    push: true,
    email: true,
    inApp: true,
    sms: false,
  },
  categories: {
    reminders: true,
    achievements: true,
    social: true,
    marketing: false,
    system: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  frequency: 'realtime',
};

// Sample notifications for demo
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Nouveau badge débloqué !',
    message: 'Félicitations ! Vous avez complété 7 jours consécutifs de méditation.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Rappel de session',
    message: 'N\'oubliez pas votre session de respiration quotidienne.',
    read: false,
    actionUrl: '/app/breath',
    actionLabel: 'Commencer',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'social',
    title: 'Nouvelle activité',
    message: 'Marie a rejoint votre cercle de soutien.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    type: 'success',
    title: 'Objectif atteint',
    message: 'Vous avez atteint votre objectif hebdomadaire de bien-être !',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const updatePreferences = useCallback((newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    // Persist to localStorage or API
    try {
      localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));
    } catch (e) {
      console.warn('Failed to persist notification preferences');
    }
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notification-preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load notification preferences');
    }
  }, []);

  return {
    notifications,
    preferences,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    addNotification,
    updatePreferences,
  };
}
