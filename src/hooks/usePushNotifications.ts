// @ts-nocheck
/**
 * usePushNotifications - Gestion des notifications push Web
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

// Clé VAPID depuis l'environnement, avec fallback pour dev
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SxZ8-SU0YnM6rV6cPLiCyChJxnvQWYCfN9Qb1gP1aY4XH3N1bm1iPUY';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!subscription);

      if (subscription) {
        const { data } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint)
          .eq('is_active', true)
          .single();

        if (!data) {
          await saveSubscription(subscription);
        }
      }
    } catch (error) {
      logger.error('❌ Subscription check failed', error as Error, 'PUSH');
    }
  }, [user]);

  const subscribe = useCallback(async () => {
    if (!isSupported || !user) {
      toast.error('Notifications non supportées');
      return false;
    }

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        toast.error('Permission refusée');
        return false;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      await saveSubscription(subscription);

      setIsSubscribed(true);
      toast.success('Notifications activées !');
      logger.info('✅ Push subscription created', {}, 'PUSH');

      return true;

    } catch (error) {
      logger.error('❌ Subscription failed', error as Error, 'PUSH');
      toast.error('Erreur lors de l\'activation');
      return false;
    }
  }, [isSupported, user]);

  const unsubscribe = useCallback(async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint);

        setIsSubscribed(false);
        toast.success('Notifications désactivées');
        logger.info('✅ Push subscription removed', {}, 'PUSH');
      }
    } catch (error) {
      logger.error('❌ Unsubscribe failed', error as Error, 'PUSH');
      toast.error('Erreur lors de la désactivation');
    }
  }, [user]);

  const saveSubscription = async (subscription: PushSubscription) => {
    if (!user) return;

    try {
      const subscriptionData = JSON.parse(JSON.stringify(subscription));

      await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_data: subscriptionData,
          endpoint: subscription.endpoint,
          is_active: true,
          updated_at: new Date().toISOString()
        });

    } catch (error) {
      logger.error('❌ Failed to save subscription', error as Error, 'PUSH');
    }
  };

  const sendTestNotification = useCallback(async () => {
    if (!user || !isSubscribed) return;

    try {
      await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: user.id,
          title: '🎵 Test EmotionsCare',
          body: 'Les notifications fonctionnent parfaitement !',
          data: { type: 'test' }
        }
      });

      toast.success('Notification envoyée');
    } catch (error) {
      logger.error('❌ Test notification failed', error as Error, 'PUSH');
      toast.error('Erreur lors de l\'envoi');
    }
  }, [user, isSubscribed]);

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification
  };
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
