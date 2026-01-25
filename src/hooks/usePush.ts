/**
 * usePush - Hook de gestion des notifications push
 * Utilise l'API native Notification + localStorage pour la persistance
 */

import { useState, useEffect, useCallback } from 'react';
import { useNotifyStore } from '@/store/notify.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const PUSH_STORAGE_KEY = 'push_subscription_data';

export const usePush = () => {
  const { user } = useAuth();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  
  const {
    hasPermission,
    subscriptionId,
    setPermission: setStorePermission,
    setSubscriptionId,
    setError
  } = useNotifyStore();

  // Check if push is supported
  useEffect(() => {
    const checkSupport = () => {
      const isSupported = 
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      
      setSupported(isSupported);
      
      if (isSupported) {
        setPermission(Notification.permission);
        setStorePermission(Notification.permission === 'granted');
      }
    };

    checkSupport();
  }, [setStorePermission]);

  // Register service worker
  const _registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      logger.error('SW registration failed', error as Error, 'PUSH');
      return null;
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!supported) {
      toast({
        title: "Notifications non supportées",
        description: "Votre navigateur ne supporte pas les notifications push.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    
    try {
      // Request permission first
      const perm = await Notification.requestPermission();
      setPermission(perm);
      setStorePermission(perm === 'granted');

      if (perm !== 'granted') {
        toast({
          title: "Permission refusée",
          description: "Les notifications push ont été refusées.",
          variant: "destructive"
        });
        return false;
      }

      // Generate a subscription ID
      const newSubscriptionId = crypto.randomUUID();
      
      // Store subscription locally
      const subscriptionData = {
        id: newSubscriptionId,
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      localStorage.setItem(PUSH_STORAGE_KEY, JSON.stringify(subscriptionData));
      
      // Persist to Supabase if user is logged in
      if (user) {
        try {
          await supabase.from('user_settings').upsert({
            user_id: user.id,
            key: 'push_subscription',
            value: JSON.stringify(subscriptionData),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });
        } catch (err) {
          logger.warn('Failed to save push subscription to Supabase', err as Error, 'PUSH');
        }
      }

      setSubscriptionId(newSubscriptionId);

      toast({
        title: "Notifications activées ✨",
        description: "Vous recevrez des rappels personnalisés.",
      });

      return true;

    } catch (error) {
      logger.error('Push subscription failed', error as Error, 'PUSH');
      setError((error as Error).message);
      
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications push.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported, user, setStorePermission, setSubscriptionId, setError]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscriptionId) return true;

    setLoading(true);
    
    try {
      // Remove from localStorage
      localStorage.removeItem(PUSH_STORAGE_KEY);
      
      // Remove from Supabase if user is logged in
      if (user) {
        try {
          await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', user.id)
            .eq('key', 'push_subscription');
        } catch (err) {
          logger.warn('Failed to remove push subscription from Supabase', err as Error, 'PUSH');
        }
      }

      setSubscriptionId(null);
      setStorePermission(false);

      toast({
        title: "Notifications désactivées",
        description: "Les notifications push ont été désactivées.",
      });

      return true;

    } catch (error) {
      logger.error('Push unsubscription failed', error as Error, 'PUSH');
      setError((error as Error).message);
      
      toast({
        title: "Erreur",
        description: "Impossible de désactiver les notifications.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [subscriptionId, user, setSubscriptionId, setStorePermission, setError]);

  // Test push notification (local)
  const testPush = useCallback(async () => {
    if (permission !== 'granted') {
      toast({
        title: "Notifications désactivées",
        description: "Activez d'abord les notifications push.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Show local notification
      const notification = new Notification('🌟 EmotionsCare', {
        body: 'Notification de test réussie ! Vous recevrez des rappels personnalisés.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      toast({
        title: "Notification test envoyée ✨",
        description: "Vous devriez la voir dans quelques secondes.",
      });

    } catch (error) {
      logger.error('Test push failed', error as Error, 'PUSH');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification test.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [permission]);

  // Load existing subscription on mount
  useEffect(() => {
    const loadExistingSubscription = () => {
      const stored = localStorage.getItem(PUSH_STORAGE_KEY);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setSubscriptionId(data.id);
        } catch (err) {
          logger.warn('Failed to parse stored push subscription', err as Error, 'PUSH');
        }
      }
    };

    loadExistingSubscription();
  }, [setSubscriptionId]);

  return {
    supported,
    permission,
    hasPermission,
    loading,
    subscribe,
    unsubscribe,
    testPush
  };
};
