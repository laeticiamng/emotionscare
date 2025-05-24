
import React, { useState, useCallback } from 'react';

/**
 * Push notifications service for offline support
 */

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private vapidKey: string = '';

  constructor() {
    // Use import.meta.env for Vite environment variables
    if (import.meta.env.MODE === 'development') {
      console.log('[PushNotifications] Development mode - notifications disabled');
    }
  }

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      console.log('Push notification manager initialized');
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidKey
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription cancelled');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options
      });
    }
  }
}

export const pushNotificationManager = new PushNotificationManager();

/**
 * Hook for push notifications management
 */
export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    // Initialize the push notification manager
    pushNotificationManager.initialize();
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const granted = await pushNotificationManager.requestPermission();
      setPermission(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const subscription = await pushNotificationManager.subscribe();
      setIsSubscribed(!!subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await pushNotificationManager.unsubscribe();
      setIsSubscribed(!success);
      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    await pushNotificationManager.sendNotification(title, options);
  }, []);

  return {
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification
  };
};
