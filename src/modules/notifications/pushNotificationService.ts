/**
 * Push Notification Service
 * Service complet pour les notifications push (Web Push API)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const LOG_CONTEXT = 'PushNotificationService';

// VAPID public key (à configurer via env)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export interface PushSubscription {
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

class PushNotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Vérifier si les push notifications sont supportées
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Demander la permission pour les notifications push
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      logger.warn('Push notifications not supported', LOG_CONTEXT);
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      logger.info(`Push permission: ${permission}`, LOG_CONTEXT);
      return permission;
    } catch (error) {
      logger.error('Failed to request permission', error as Error, LOG_CONTEXT);
      return 'denied';
    }
  }

  /**
   * Obtenir le statut de permission actuel
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) return 'denied';
    return Notification.permission;
  }

  /**
   * Enregistrer le service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) return null;

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      logger.info('Service worker registered', LOG_CONTEXT);
      return this.swRegistration;
    } catch (error) {
      logger.error('Service worker registration failed', error as Error, LOG_CONTEXT);
      return null;
    }
  }

  /**
   * S'abonner aux notifications push
   */
  async subscribe(userId: string): Promise<boolean> {
    if (!this.isSupported || !this.swRegistration) {
      await this.registerServiceWorker();
    }

    if (!this.swRegistration) {
      logger.error('No service worker registration', LOG_CONTEXT);
      return false;
    }

    try {
      // Obtenir ou créer l'abonnement
      let subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (!subscription && VAPID_PUBLIC_KEY) {
        const applicationServerKey = this.urlB64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey.buffer as ArrayBuffer
        });
      }

      if (!subscription) {
        logger.warn('Could not create push subscription', LOG_CONTEXT);
        return false;
      }

      // Sauvegarder l'abonnement côté serveur
      const keys = subscription.toJSON().keys;
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          endpoint: subscription.endpoint,
          p256dh: keys?.p256dh || '',
          auth: keys?.auth || '',
        }, { onConflict: 'user_id' });

      if (error) {
        logger.error('Failed to save subscription', error, LOG_CONTEXT);
        return false;
      }

      logger.info('Push subscription saved', LOG_CONTEXT);
      return true;
    } catch (error) {
      logger.error('Failed to subscribe', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Se désabonner des notifications push
   */
  async unsubscribe(userId: string): Promise<boolean> {
    if (!this.swRegistration) return true;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Supprimer l'abonnement côté serveur
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to remove subscription', error, LOG_CONTEXT);
        return false;
      }

      logger.info('Push subscription removed', LOG_CONTEXT);
      return true;
    } catch (error) {
      logger.error('Failed to unsubscribe', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Afficher une notification locale (pour test)
   */
  async showLocalNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    if (!this.isSupported) return false;

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return false;
    }

    try {
      if (this.swRegistration) {
        await this.swRegistration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          ...options
        });
      } else {
        new Notification(title, {
          icon: '/icon-192.png',
          ...options
        });
      }
      return true;
    } catch (error) {
      logger.error('Failed to show notification', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Vérifier si l'utilisateur est abonné
   */
  async isSubscribed(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Convertir la clé VAPID en Uint8Array
   */
  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
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

export const pushNotificationService = new PushNotificationService();
