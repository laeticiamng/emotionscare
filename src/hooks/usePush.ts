import { useState, useEffect, useCallback } from 'react';
import { useNotifyStore } from '@/store/notify.store';
import { toast } from '@/hooks/use-toast';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePush = () => {
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
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error('SW registration failed:', error);
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

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        throw new Error('Failed to register service worker');
      }

      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY || 'demo-key'
      });

      // Prepare subscription data
      const subscriptionData: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!)))
        }
      };

      // Send to backend
      const response = await fetch('/api/me/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...subscriptionData,
          ua: navigator.userAgent,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to register push subscription');
      }

      const result = await response.json();
      setSubscriptionId(result.subscription_id);

      toast({
        title: "Notifications activées ✨",
        description: "Vous recevrez des rappels personnalisés.",
      });

      return true;

    } catch (error: any) {
      console.error('Push subscription failed:', error);
      setError(error.message);
      
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications push.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported, setStorePermission, setSubscriptionId, setError, registerServiceWorker]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscriptionId) return true;

    setLoading(true);
    
    try {
      // Unregister from backend
      const response = await fetch(`/api/me/push/register/${subscriptionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to unregister push subscription');
      }

      // Unsubscribe from browser
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      setSubscriptionId(null);
      setStorePermission(false);

      toast({
        title: "Notifications désactivées",
        description: "Les notifications push ont été désactivées.",
      });

      return true;

    } catch (error: any) {
      console.error('Push unsubscription failed:', error);
      setError(error.message);
      
      toast({
        title: "Erreur",
        description: "Impossible de désactiver les notifications.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [subscriptionId, setSubscriptionId, setStorePermission, setError]);

  // Test push notification
  const testPush = useCallback(async () => {
    if (!hasPermission) {
      toast({
        title: "Notifications désactivées",
        description: "Activez d'abord les notifications push.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/me/notifications/test', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      toast({
        title: "Notification test envoyée ✨",
        description: "Vous devriez recevoir une notification dans quelques secondes.",
      });

    } catch (error: any) {
      console.error('Test push failed:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification test.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

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