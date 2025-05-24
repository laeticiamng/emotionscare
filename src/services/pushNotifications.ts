
import React from 'react';

/**
 * Push Notifications service for PWA
 */

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    // Use Vite's environment variable instead of process.env
    if (import.meta.env.MODE === 'development') {
      console.log('[PushNotifications] Service initialized in development mode');
    }
  }

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      // Get service worker registration
      this.registration = await navigator.serviceWorker.ready;
      console.log('Push notification service initialized');
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    
    if (import.meta.env.MODE === 'development') {
      console.log(`Notification permission: ${permission}`);
    }

    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // You would need to add your VAPID public key here
          'YOUR_VAPID_PUBLIC_KEY'
        )
      });

      if (import.meta.env.MODE === 'development') {
        console.log('Push subscription successful:', subscription);
      }

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
        const result = await subscription.unsubscribe();
        if (import.meta.env.MODE === 'development') {
          console.log('Unsubscribed from push notifications');
        }
        return result;
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      await this.registration.showNotification(title, {
        badge: '/icons/icon-96x96.png',
        icon: '/icons/icon-192x192.png',
        ...options
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationManager = new PushNotificationManager();

// React hook for push notifications
export const usePushNotifications = () => {
  const [permission, setPermission] = React.useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  React.useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = React.useCallback(async () => {
    try {
      const newPermission = await pushNotificationManager.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied' as NotificationPermission;
    }
  }, []);

  const subscribe = React.useCallback(async () => {
    try {
      const subscription = await pushNotificationManager.subscribe();
      setIsSubscribed(!!subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }, []);

  const unsubscribe = React.useCallback(async () => {
    try {
      const result = await pushNotificationManager.unsubscribe();
      if (result) {
        setIsSubscribed(false);
      }
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }, []);

  const showNotification = React.useCallback(async (title: string, options?: NotificationOptions) => {
    try {
      await pushNotificationManager.showNotification(title, options);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }, []);

  return {
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification
  };
};
