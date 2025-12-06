/**
 * Gestionnaire Web Push avec VAPID et heures calmes
 */

import { supabase } from '@/integrations/supabase/client';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushPreferences {
  enabled: boolean;
  quietHoursStart: number; // 0-23
  quietHoursEnd: number;   // 0-23
  enabledTypes: string[];  // ['reminders', 'nudges', 'achievements']
}

class WebPushManager {
  private vapidPublicKey = 'BMJ5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5Q5J5'; // À remplacer par la vraie clé
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Initialiser le service worker et vérifier les permissions
   */
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Demander permission et s'abonner
   */
  async requestPermissionAndSubscribe(): Promise<{ success: boolean; subscription?: PushSubscriptionData; error?: string }> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return { success: false, error: 'Service Worker not available' };
    }

    try {
      // Demander permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, error: 'Permission denied' };
      }

      // S'abonner aux push
      const subscription = await this.registration.pushManager.subscribe({
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

      // Sauvegarder en base
      await this.saveSubscriptionToDatabase(subscriptionData);

      return { success: true, subscription: subscriptionData };
    } catch (error) {
      console.error('Push subscription failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Sauvegarder l'abonnement en base
   */
  private async saveSubscriptionToDatabase(subscription: PushSubscriptionData): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.user.id,
        endpoint: subscription.endpoint,
        p256dh_key: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
        user_agent: navigator.userAgent,
        is_active: true
      }, {
        onConflict: 'user_id,endpoint'
      });
  }

  /**
   * Tester l'envoi d'une notification
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      // Appel à l'edge function pour envoyer le push
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: user.user.id,
          notification: {
            title: 'Test EmotionsCare',
            body: 'Votre notification fonctionne parfaitement !',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'test'
          }
        }
      });

      if (error) {
        console.error('Test notification failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Test notification error:', error);
      return false;
    }
  }

  /**
   * Mettre à jour les préférences push
   */
  async updatePreferences(preferences: PushPreferences): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      await supabase
        .from('push_subscriptions')
        .update({
          is_active: preferences.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.user.id);

      // Sauvegarder les préférences détaillées en profiles
      await supabase
        .from('profiles')
        .update({
          push_preferences: preferences
        })
        .eq('id', user.user.id);

      return true;
    } catch (error) {
      console.error('Failed to update push preferences:', error);
      return false;
    }
  }

  /**
   * Vérifier si on est en heures calmes
   */
  isQuietTime(preferences: PushPreferences): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    
    const { quietHoursStart, quietHoursEnd } = preferences;
    
    // Gestion cas où les heures calmes traversent minuit
    if (quietHoursStart > quietHoursEnd) {
      return currentHour >= quietHoursStart || currentHour < quietHoursEnd;
    }
    
    return currentHour >= quietHoursStart && currentHour < quietHoursEnd;
  }

  /**
   * Désactiver les notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.registration) return true;

      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Désactiver en base
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('user_id', user.user.id);
      }

      return true;
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      return false;
    }
  }

  /**
   * Utilitaires de conversion
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

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export const webPushManager = new WebPushManager();

/**
 * Hook pour gérer les notifications push
 */
export const useWebPush = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await webPushManager.initialize();
      setIsSupported(supported);

      if (supported && 'serviceWorker' in navigator) {
        // Vérifier si déjà abonné
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    };

    checkSupport();
  }, []);

  const subscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await webPushManager.requestPermissionAndSubscribe();
      if (result.success) {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await webPushManager.unsubscribe();
      if (success) {
        setIsSubscribed(false);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTest = async (): Promise<boolean> => {
    return await webPushManager.sendTestNotification();
  };

  const updatePreferences = async (preferences: PushPreferences): Promise<boolean> => {
    return await webPushManager.updatePreferences(preferences);
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    sendTest,
    updatePreferences
  };
};

// Nécessaire pour le hook
import { useState, useEffect } from 'react';