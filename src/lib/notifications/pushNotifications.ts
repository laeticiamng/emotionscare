// @ts-nocheck
/**
 * PushNotificationService - Service complet de notifications push
 * Supporte les notifications natives + Service Worker pour PWA
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private isSupported: boolean;
  private isPermissionGranted: boolean;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private pushSubscription: PushSubscription | null = null;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.isPermissionGranted = this.isSupported && Notification.permission === 'granted';
    
    // Initialiser le service worker
    this.initServiceWorker();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialiser le Service Worker pour les notifications en arrière-plan
   */
  private async initServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      logger.warn('[PushNotification] Service Worker non supporté', undefined, 'SYSTEM');
      return;
    }

    try {
      // Vérifier si un SW est déjà enregistré
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        this.serviceWorkerRegistration = registration;
        logger.info('[PushNotification] Service Worker déjà enregistré', {}, 'SYSTEM');
      } else {
        // Enregistrer le SW
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        logger.info('[PushNotification] Service Worker enregistré', {}, 'SYSTEM');
      }

      // Attendre que le SW soit actif
      await navigator.serviceWorker.ready;
      
      // Récupérer l'abonnement push existant
      this.pushSubscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      
    } catch (error) {
      logger.error('[PushNotification] Erreur initialisation SW', error as Error, 'SYSTEM');
    }
  }

  /**
   * Demander la permission pour les notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      logger.warn('Les notifications push ne sont pas supportées sur ce navigateur', undefined, 'SYSTEM');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.isPermissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      logger.warn('L\'utilisateur a refusé les notifications push', undefined, 'SYSTEM');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.isPermissionGranted = permission === 'granted';
      
      // Si permission accordée, s'abonner aux push
      if (this.isPermissionGranted) {
        await this.subscribeToPush();
      }
      
      return this.isPermissionGranted;
    } catch (error) {
      logger.error('Erreur lors de la demande de permission', error as Error, 'SYSTEM');
      return false;
    }
  }

  /**
   * S'abonner aux notifications push via Service Worker
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      logger.warn('[PushNotification] Pas de Service Worker', undefined, 'SYSTEM');
      return null;
    }

    try {
      // Vérifier si déjà abonné
      if (this.pushSubscription) {
        return this.pushSubscription;
      }

      // VAPID public key (à configurer dans les secrets Supabase)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      
      this.pushSubscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      // Sauvegarder l'abonnement en base
      await this.savePushSubscription(this.pushSubscription);

      logger.info('[PushNotification] Abonné aux notifications push', {}, 'SYSTEM');
      return this.pushSubscription;

    } catch (error) {
      logger.error('[PushNotification] Erreur abonnement push', error as Error, 'SYSTEM');
      return null;
    }
  }

  /**
   * Sauvegarder l'abonnement push en base de données
   */
  private async savePushSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscriptionData = subscription.toJSON();

      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subscriptionData.endpoint,
        keys: subscriptionData.keys,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,endpoint'
      });

    } catch (error) {
      logger.error('[PushNotification] Erreur sauvegarde subscription', error as Error, 'SYSTEM');
    }
  }

  /**
   * Afficher une notification (native ou via SW)
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isPermissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      // Utiliser le Service Worker si disponible (meilleur pour PWA)
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          ...options,
        });
      } else {
        // Fallback notification native
        const notification = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });

        // Auto-fermer après 5 secondes
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

    } catch (error) {
      logger.error('Erreur lors de l\'affichage de la notification', error as Error, 'SYSTEM');
    }
  }

  /**
   * Envoyer une notification push via l'edge function
   */
  async sendPushNotification(
    userId: string,
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('push-notification', {
        body: {
          userId,
          notification: payload
        }
      });

      if (error) {
        logger.error('[PushNotification] Erreur envoi push', error, 'SYSTEM');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('[PushNotification] Erreur envoi push', error as Error, 'SYSTEM');
      return false;
    }
  }

  /**
   * Se désabonner des notifications push
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.pushSubscription) return true;

    try {
      await this.pushSubscription.unsubscribe();
      
      // Supprimer de la base
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', this.pushSubscription.endpoint);
      }

      this.pushSubscription = null;
      logger.info('[PushNotification] Désabonné', {}, 'SYSTEM');
      return true;

    } catch (error) {
      logger.error('[PushNotification] Erreur désabonnement', error as Error, 'SYSTEM');
      return false;
    }
  }

  /**
   * Statut de la permission
   */
  getPermissionStatus(): NotificationPermission {
    return this.isSupported ? Notification.permission : 'denied';
  }

  /**
   * Vérifier si les notifications sont supportées
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Vérifier si l'utilisateur est abonné aux push
   */
  isPushSubscribed(): boolean {
    return this.pushSubscription !== null;
  }

  /**
   * Utilitaire pour convertir VAPID key
   */
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

export const pushNotificationService = PushNotificationService.getInstance();
