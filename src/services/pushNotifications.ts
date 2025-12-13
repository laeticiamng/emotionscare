// @ts-nocheck

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

/** Configuration d'une notification */
export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  renotify?: boolean;
}

/** Action disponible sur une notification */
export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

/** État des notifications push */
export interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  subscription: PushSubscription | null;
  isSubscribed: boolean;
}

/** Préférences de notification utilisateur */
export interface NotificationPreferences {
  enabled: boolean;
  quietHoursStart?: string; // Format HH:mm
  quietHoursEnd?: string;
  categories: {
    reminders: boolean;
    achievements: boolean;
    social: boolean;
    wellness: boolean;
    updates: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

/** Catégories de notification */
export type NotificationCategory = 'reminders' | 'achievements' | 'social' | 'wellness' | 'updates' | 'system';

/** Notification planifiée */
export interface ScheduledNotification {
  id: string;
  config: NotificationConfig;
  scheduledAt: Date;
  category: NotificationCategory;
  recurring?: {
    interval: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

/** Hook pour gérer les notifications push */
export const usePushNotifications = () => {
  /** Demande la permission pour les notifications */
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      logger.warn('Notifications not supported', undefined, 'SYSTEM');
      return false;
    }

    const permission = await Notification.requestPermission();
    logger.info('Push notification permission', { permission }, 'SYSTEM');
    return permission === 'granted';
  };

  /** Obtient l'état actuel des notifications */
  const getState = async (): Promise<PushNotificationState> => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    let subscription: PushSubscription | null = null;

    if (isSupported) {
      const registration = await navigator.serviceWorker.ready;
      subscription = await registration.pushManager.getSubscription();
    }

    return {
      permission: isSupported ? Notification.permission : 'denied',
      isSupported,
      subscription,
      isSubscribed: !!subscription
    };
  };

  /** S'abonne aux notifications push */
  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const registration = await navigator.serviceWorker.ready;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Enregistrer l'abonnement côté serveur
      await saveSubscription(subscription);
      logger.info('Push subscription created', undefined, 'SYSTEM');

      return subscription;
    } catch (error) {
      logger.error('Failed to subscribe to push notifications', error as Error, 'SYSTEM');
      throw error;
    }
  };

  /** Se désabonne des notifications push */
  const unsubscribe = async (): Promise<boolean> => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscription(subscription);
      logger.info('Push subscription removed', undefined, 'SYSTEM');
      return true;
    }

    return false;
  };

  /** Affiche une notification locale */
  const showNotification = async (config: NotificationConfig): Promise<void> => {
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    // Vérifier les heures calmes
    if (await isQuietHours()) {
      logger.info('Notification suppressed (quiet hours)', undefined, 'SYSTEM');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(config.title, {
      body: config.body,
      icon: config.icon || '/icons/notification-icon.png',
      badge: config.badge || '/icons/badge-icon.png',
      image: config.image,
      tag: config.tag,
      data: config.data,
      actions: config.actions,
      requireInteraction: config.requireInteraction,
      silent: config.silent,
      vibrate: config.vibrate || [200, 100, 200],
      renotify: config.renotify
    });

    logger.info('Notification displayed', { title: config.title }, 'SYSTEM');
  };

  /** Planifie une notification */
  const scheduleNotification = async (
    config: NotificationConfig,
    scheduledAt: Date,
    category: NotificationCategory = 'reminders'
  ): Promise<string> => {
    const id = crypto.randomUUID();
    const scheduled: ScheduledNotification = {
      id,
      config,
      scheduledAt,
      category
    };

    // Stocker la notification planifiée
    const stored = getStoredScheduledNotifications();
    stored.push(scheduled);
    localStorage.setItem('scheduled_notifications', JSON.stringify(stored));

    logger.info('Notification scheduled', { id, scheduledAt }, 'SYSTEM');
    return id;
  };

  /** Annule une notification planifiée */
  const cancelScheduledNotification = async (id: string): Promise<boolean> => {
    const stored = getStoredScheduledNotifications();
    const filtered = stored.filter(n => n.id !== id);

    if (filtered.length !== stored.length) {
      localStorage.setItem('scheduled_notifications', JSON.stringify(filtered));
      logger.info('Scheduled notification cancelled', { id }, 'SYSTEM');
      return true;
    }

    return false;
  };

  /** Obtient les préférences de notification */
  const getPreferences = async (): Promise<NotificationPreferences> => {
    const stored = localStorage.getItem('notification_preferences');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      enabled: true,
      categories: {
        reminders: true,
        achievements: true,
        social: true,
        wellness: true,
        updates: true
      },
      frequency: 'immediate'
    };
  };

  /** Met à jour les préférences de notification */
  const updatePreferences = async (preferences: Partial<NotificationPreferences>): Promise<void> => {
    const current = await getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem('notification_preferences', JSON.stringify(updated));
    logger.info('Notification preferences updated', undefined, 'SYSTEM');
  };

  /** Envoie une notification par catégorie */
  const notifyByCategory = async (
    category: NotificationCategory,
    config: NotificationConfig
  ): Promise<void> => {
    const prefs = await getPreferences();

    if (!prefs.enabled) return;
    if (category !== 'system' && !prefs.categories[category as keyof typeof prefs.categories]) return;

    await showNotification({ ...config, tag: category });
  };

  /** Obtient le nombre de notifications non lues */
  const getUnreadCount = async (): Promise<number> => {
    const { data } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('read', false);

    return data?.length || 0;
  };

  /** Marque toutes les notifications comme lues */
  const markAllAsRead = async (): Promise<void> => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
  };

  return {
    requestPermission,
    getState,
    subscribe,
    unsubscribe,
    showNotification,
    scheduleNotification,
    cancelScheduledNotification,
    getPreferences,
    updatePreferences,
    notifyByCategory,
    getUnreadCount,
    markAllAsRead
  };
};

/** Convertit une clé VAPID base64 en Uint8Array */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/** Enregistre l'abonnement côté serveur */
async function saveSubscription(subscription: PushSubscription): Promise<void> {
  await supabase.functions.invoke('save-push-subscription', {
    body: { subscription: subscription.toJSON() }
  });
}

/** Supprime l'abonnement côté serveur */
async function removeSubscription(subscription: PushSubscription): Promise<void> {
  await supabase.functions.invoke('remove-push-subscription', {
    body: { endpoint: subscription.endpoint }
  });
}

/** Vérifie si on est dans les heures calmes */
async function isQuietHours(): Promise<boolean> {
  const prefs = JSON.parse(localStorage.getItem('notification_preferences') || '{}');
  if (!prefs.quietHoursStart || !prefs.quietHoursEnd) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = prefs.quietHoursStart.split(':').map(Number);
  const [endH, endM] = prefs.quietHoursEnd.split(':').map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  if (start <= end) {
    return currentTime >= start && currentTime <= end;
  } else {
    return currentTime >= start || currentTime <= end;
  }
}

/** Obtient les notifications planifiées stockées */
function getStoredScheduledNotifications(): ScheduledNotification[] {
  const stored = localStorage.getItem('scheduled_notifications');
  return stored ? JSON.parse(stored) : [];
}

export default usePushNotifications;
