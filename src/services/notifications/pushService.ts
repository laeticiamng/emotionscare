/**
 * Service de notifications push complet
 * Gère l'enregistrement, l'envoi et la gestion des notifications
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface PushSubscription {
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
  actions?: { action: string; title: string; icon?: string }[];
}

/**
 * Vérifier si les notifications push sont supportées
 */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Demander la permission de notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    logger.warn('Notifications not supported', undefined, 'PUSH');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    logger.info(`Notification permission: ${permission}`, undefined, 'PUSH');
    return permission;
  }

  return Notification.permission;
}

/**
 * Enregistrer le service worker pour les notifications push
 */
export async function registerPushSubscription(): Promise<PushSubscription | null> {
  try {
    if (!isPushSupported()) {
      logger.warn('Push notifications not supported', undefined, 'PUSH');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      logger.warn('Notification permission denied', undefined, 'PUSH');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Récupérer la clé VAPID publique depuis le backend
    const { data: vapidKey, error: vapidError } = await supabase.functions.invoke('web-push', {
      body: { action: 'getVapidKey' }
    });

    if (vapidError || !vapidKey?.publicKey) {
      logger.error('Failed to get VAPID key', vapidError, 'PUSH');
      return null;
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidKey.publicKey);
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    const subscriptionJson = subscription.toJSON();
    
    const pushSubscription: PushSubscription = {
      endpoint: subscriptionJson.endpoint!,
      keys: {
        p256dh: subscriptionJson.keys!.p256dh,
        auth: subscriptionJson.keys!.auth,
      },
    };

    // Enregistrer la souscription côté serveur
    await savePushSubscription(pushSubscription);

    logger.info('Push subscription registered', { endpoint: pushSubscription.endpoint.slice(0, 50) }, 'PUSH');
    return pushSubscription;
  } catch (error) {
    logger.error('Failed to register push subscription', error as Error, 'PUSH');
    return null;
  }
}

/**
 * Sauvegarder la souscription push en base de données
 */
async function savePushSubscription(subscription: PushSubscription): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh_key: subscription.keys.p256dh,
      auth_key: subscription.keys.auth,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,endpoint'
    });

  if (error) {
    logger.error('Failed to save push subscription', error, 'PUSH');
  }
}

/**
 * Afficher une notification locale
 */
export async function showLocalNotification(payload: NotificationPayload): Promise<void> {
  if (Notification.permission !== 'granted') {
    await requestNotificationPermission();
  }

  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge,
      tag: payload.tag,
      data: payload.data,
    };
    await registration.showNotification(payload.title, options);
  }
}

/**
 * Envoyer une notification via le backend
 */
export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        userId,
        notification: payload,
      },
    });

    if (error) {
      logger.error('Failed to send push notification', error, 'PUSH');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Push notification error', error as Error, 'PUSH');
    return false;
  }
}

/**
 * Se désabonner des notifications push
 */
export async function unsubscribePush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      
      // Supprimer de la base de données
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint);
      }

      logger.info('Push subscription removed', undefined, 'PUSH');
      return true;
    }

    return true;
  } catch (error) {
    logger.error('Failed to unsubscribe push', error as Error, 'PUSH');
    return false;
  }
}

/**
 * Vérifier si l'utilisateur est déjà abonné
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

// Utilitaire pour convertir la clé VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
