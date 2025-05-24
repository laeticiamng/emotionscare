
/**
 * Push Notifications Service
 */

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationManager {
  private vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // À remplacer par votre clé VAPID

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  async subscribe(): Promise<PushSubscriptionData | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push messaging not supported');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };

      console.log('Push subscription created:', subscriptionData);
      return subscriptionData;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription removed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  // Local notifications (pour les cas où push n'est pas disponible)
  async showLocalNotification(config: NotificationConfig): Promise<void> {
    if (Notification.permission !== 'granted') {
      await this.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icons/icon-192x192.png',
        badge: config.badge || '/icons/badge-72x72.png',
        tag: config.tag || 'emotionscare',
        requireInteraction: config.requireInteraction || false,
        data: config.data || {}
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        if (config.data?.url) {
          window.location.href = config.data.url;
        }
      };

      // Auto close after 5 seconds if not requiring interaction
      if (!config.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }
    }
  }

  // Notifications prédéfinies pour l'app
  async notifyEmotionScanReminder(): Promise<void> {
    await this.showLocalNotification({
      title: 'EmotionsCare',
      body: 'N\'oubliez pas votre scan émotionnel quotidien 😊',
      tag: 'emotion-reminder',
      data: { url: '/scan' }
    });
  }

  async notifyMusicRecommendation(mood: string): Promise<void> {
    await this.showLocalNotification({
      title: 'Nouvelle recommandation musicale',
      body: `Musique adaptée à votre humeur ${mood} disponible`,
      tag: 'music-recommendation',
      data: { url: '/music' }
    });
  }

  async notifyCoachMessage(): Promise<void> {
    await this.showLocalNotification({
      title: 'Message de votre coach',
      body: 'Votre coach IA a de nouveaux conseils pour vous',
      tag: 'coach-message',
      requireInteraction: true,
      data: { url: '/coach' }
    });
  }

  // Helper methods
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

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chars = Array.from(bytes, byte => String.fromCharCode(byte));
    return btoa(chars.join(''));
  }
}

export const pushNotificationManager = new PushNotificationManager();

// Hook pour React
export const usePushNotifications = () => {
  const [permission, setPermission] = React.useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  React.useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const subscription = await pushNotificationManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const requestPermission = async () => {
    const newPermission = await pushNotificationManager.requestPermission();
    setPermission(newPermission);
    return newPermission;
  };

  const subscribe = async () => {
    try {
      const subscription = await pushNotificationManager.subscribe();
      if (subscription) {
        setIsSubscribed(true);
        // Ici vous pourriez envoyer la subscription à votre backend
        console.log('Subscription ready to be sent to backend:', subscription);
      }
      return subscription;
    } catch (error) {
      console.error('Subscription failed:', error);
      return null;
    }
  };

  const unsubscribe = async () => {
    const success = await pushNotificationManager.unsubscribe();
    if (success) {
      setIsSubscribed(false);
    }
    return success;
  };

  return {
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification: pushNotificationManager.showLocalNotification.bind(pushNotificationManager),
    notifyEmotionScanReminder: pushNotificationManager.notifyEmotionScanReminder.bind(pushNotificationManager),
    notifyMusicRecommendation: pushNotificationManager.notifyMusicRecommendation.bind(pushNotificationManager),
    notifyCoachMessage: pushNotificationManager.notifyCoachMessage.bind(pushNotificationManager)
  };
};

