
import { useCallback, useEffect, useState } from 'react';

/**
 * Push Notifications Service
 */

export interface PushNotificationConfig {
  vapidKey?: string;
  serviceWorkerPath?: string;
  onNotificationClick?: (event: NotificationEvent) => void;
  onNotificationClose?: (event: NotificationEvent) => void;
}

export interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
  subscribed: boolean;
}

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private config: PushNotificationConfig;

  constructor(config: PushNotificationConfig = {}) {
    this.config = {
      vapidKey: config.vapidKey || process.env.VITE_VAPID_PUBLIC_KEY,
      serviceWorkerPath: config.serviceWorkerPath || '/sw.js',
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        this.config.serviceWorkerPath!
      );
      console.log('Service Worker registered for push notifications');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration || !this.config.vapidKey) {
      console.error('Service Worker not registered or VAPID key missing');
      return null;
    }

    try {
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.config.vapidKey)
      });

      console.log('Push subscription successful');
      return this.subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const result = await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('Push unsubscription successful');
      return result;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }

    return await this.registration.pushManager.getSubscription();
  }

  async showNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (!this.registration) {
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }
      return;
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

  getPermissionState(): NotificationPermissionState {
    return {
      permission: 'Notification' in window ? Notification.permission : 'denied',
      supported: 'serviceWorker' in navigator && 'PushManager' in window,
      subscribed: this.subscription !== null
    };
  }
}

// Global instance
export const pushNotificationManager = new PushNotificationManager();

/**
 * React hook for push notifications
 */
export const usePushNotifications = () => {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: 'default',
    supported: false,
    subscribed: false
  });

  const updatePermissionState = useCallback(() => {
    setPermissionState(pushNotificationManager.getPermissionState());
  }, []);

  useEffect(() => {
    updatePermissionState();
    
    // Initialize push notification manager
    pushNotificationManager.initialize().then(() => {
      updatePermissionState();
    });
  }, [updatePermissionState]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const permission = await pushNotificationManager.requestPermission();
    updatePermissionState();
    return permission;
  }, [updatePermissionState]);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    const subscription = await pushNotificationManager.subscribe();
    updatePermissionState();
    return subscription;
  }, [updatePermissionState]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    const result = await pushNotificationManager.unsubscribe();
    updatePermissionState();
    return result;
  }, [updatePermissionState]);

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions): Promise<void> => {
      await pushNotificationManager.showNotification(title, options);
    },
    []
  );

  return {
    permissionState,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    isSupported: permissionState.supported,
    isSubscribed: permissionState.subscribed,
    hasPermission: permissionState.permission === 'granted'
  };
};

// Utility functions for notification management
export const sendNotification = async (
  title: string,
  options: NotificationOptions = {}
): Promise<void> => {
  await pushNotificationManager.showNotification(title, options);
};

export const initializePushNotifications = async (): Promise<void> => {
  await pushNotificationManager.initialize();
};
