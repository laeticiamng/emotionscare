/**
 * Push Notifications Service - PWA complet avec Service Worker
 * Gère permissions, tokens, envoi et réception de notifications push
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

class PushNotificationsService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private vapidPublicKey: string = '';

  /**
   * Initialise le service de notifications
   */
  async initialize(): Promise<boolean> {
    try {
      // Vérifier le support
      if (!this.isSupported()) {
        logger.warn('[Push] Not supported in this browser', undefined, 'PUSH');
        return false;
      }

      // Enregistrer le Service Worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      await navigator.serviceWorker.ready;
      logger.info('[Push] Service Worker registered', {}, 'PUSH');

      // Récupérer la clé VAPID depuis le backend
      await this.fetchVapidKey();

      // Vérifier si déjà abonné
      this.subscription = await this.registration.pushManager.getSubscription();
      if (this.subscription) {
        logger.info('[Push] Existing subscription found', {}, 'PUSH');
      }

      return true;
    } catch (error) {
      logger.error('[Push] Initialization failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * Vérifie si les notifications push sont supportées
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Récupère l'état actuel de la permission
   */
  getPermissionState(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Demande la permission de notifications
   */
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      logger.info('[Push] Permission result', { permission }, 'PUSH');
      return permission === 'granted';
    } catch (error) {
      logger.error('[Push] Permission request failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * S'abonne aux notifications push
   */
  async subscribe(userId: string): Promise<PushSubscriptionData | null> {
    try {
      if (!this.registration) {
        await this.initialize();
      }

      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }

      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) return null;
      }

      // Créer l'abonnement push
      const subscribeOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
      };
      
      if (this.vapidPublicKey) {
        const vapidKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
        subscribeOptions.applicationServerKey = vapidKey.buffer as ArrayBuffer;
      }
      
      this.subscription = await this.registration.pushManager.subscribe(subscribeOptions);

      const subscriptionData = this.subscription.toJSON();
      
      // Sauvegarder en base
      await this.saveSubscription(userId, {
        endpoint: subscriptionData.endpoint!,
        keys: {
          p256dh: subscriptionData.keys!.p256dh,
          auth: subscriptionData.keys!.auth
        }
      });

      logger.info('[Push] Subscribed successfully', {}, 'PUSH');
      return {
        endpoint: subscriptionData.endpoint!,
        keys: {
          p256dh: subscriptionData.keys!.p256dh,
          auth: subscriptionData.keys!.auth
        }
      };
    } catch (error) {
      logger.error('[Push] Subscription failed', error as Error, 'PUSH');
      return null;
    }
  }

  /**
   * Se désabonne des notifications
   */
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
      }

      // Supprimer de la base
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);

      logger.info('[Push] Unsubscribed', {}, 'PUSH');
      return true;
    } catch (error) {
      logger.error('[Push] Unsubscribe failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * Envoie une notification locale (sans passer par le serveur)
   */
  async showLocalNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      if (Notification.permission !== 'granted') {
        return false;
      }

      if (this.registration) {
        await this.registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          badge: payload.badge || '/badge-72x72.png',
          tag: payload.tag,
          data: payload.data,
          requireInteraction: payload.requireInteraction,
          silent: payload.silent
        });
        return true;
      }

      // Fallback: Notification API standard
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        tag: payload.tag,
        data: payload.data
      });
      return true;
    } catch (error) {
      logger.error('[Push] Local notification failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * Planifie une notification pour plus tard
   */
  async scheduleNotification(
    userId: string,
    payload: NotificationPayload,
    scheduledAt: Date
  ): Promise<boolean> {
    try {
      await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: userId,
          title: payload.title,
          body: payload.body,
          data: payload.data,
          scheduled_at: scheduledAt.toISOString(),
          status: 'pending'
        });

      logger.info('[Push] Notification scheduled', { scheduledAt }, 'PUSH');
      return true;
    } catch (error) {
      logger.error('[Push] Schedule failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * Envoie une notification via le backend
   */
  async sendPushNotification(
    userId: string,
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: { userId, ...payload }
      });

      if (error) throw error;
      
      logger.info('[Push] Remote notification sent', { userId }, 'PUSH');
      return true;
    } catch (error) {
      logger.error('[Push] Remote send failed', error as Error, 'PUSH');
      return false;
    }
  }

  /**
   * Vérifie si l'utilisateur est abonné
   */
  async isSubscribed(userId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  }

  // Méthodes privées

  private async fetchVapidKey(): Promise<void> {
    try {
      const { data } = await supabase.functions.invoke('web-push', {
        body: { action: 'getVapidKey' }
      });
      this.vapidPublicKey = data?.vapidPublicKey || '';
    } catch (error) {
      // Utiliser une clé par défaut en dev
      this.vapidPublicKey = '';
      logger.warn('[Push] Could not fetch VAPID key', error, 'PUSH');
    }
  }

  private async saveSubscription(userId: string, data: PushSubscriptionData): Promise<void> {
    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: data.endpoint,
        p256dh_key: data.keys.p256dh,
        auth_key: data.keys.auth,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    if (!base64String) return new Uint8Array();
    
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

export const pushNotificationsService = new PushNotificationsService();

// Hook React pour utiliser le service
export const usePushNotifications = () => {
  const initialize = async () => pushNotificationsService.initialize();
  const requestPermission = async () => pushNotificationsService.requestPermission();
  const subscribe = async (userId: string) => pushNotificationsService.subscribe(userId);
  const unsubscribe = async (userId: string) => pushNotificationsService.unsubscribe(userId);
  const showNotification = async (payload: NotificationPayload) => 
    pushNotificationsService.showLocalNotification(payload);
  const isSubscribed = async (userId: string) => pushNotificationsService.isSubscribed(userId);
  const getPermissionState = () => pushNotificationsService.getPermissionState();

  return {
    initialize,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    isSubscribed,
    getPermissionState,
    isSupported: pushNotificationsService.isSupported(),
  };
};

export default pushNotificationsService;
