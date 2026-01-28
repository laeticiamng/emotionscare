/**
 * Hook usePushNotifications
 * Interface React pour les notifications push
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pushNotificationService } from './pushNotificationService';
import { toast } from 'sonner';

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
  showTestNotification: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);

  const isSupported = pushNotificationService.isAvailable();

  // Initialisation
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      if (!isSupported) {
        setIsLoading(false);
        return;
      }

      setPermission(pushNotificationService.getPermissionStatus());

      if (user?.id) {
        const subscribed = await pushNotificationService.isSubscribed(user.id);
        setIsSubscribed(subscribed);
      }

      setIsLoading(false);
    };

    init();
  }, [user?.id, isSupported]);

  // Demander la permission
  const requestPermission = useCallback(async () => {
    const newPermission = await pushNotificationService.requestPermission();
    setPermission(newPermission);
    
    if (newPermission === 'granted') {
      toast.success('Notifications activées !');
    } else if (newPermission === 'denied') {
      toast.error('Notifications refusées. Vous pouvez les activer dans les paramètres de votre navigateur.');
    }
    
    return newPermission;
  }, []);

  // S'abonner
  const subscribe = useCallback(async () => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour activer les notifications');
      return false;
    }

    setIsLoading(true);
    
    // Demander la permission si nécessaire
    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        setIsLoading(false);
        return false;
      }
    }

    const success = await pushNotificationService.subscribe(user.id);
    
    if (success) {
      setIsSubscribed(true);
      toast.success('Vous recevrez désormais des notifications push');
    } else {
      toast.error('Impossible d\'activer les notifications');
    }

    setIsLoading(false);
    return success;
  }, [user?.id, permission, requestPermission]);

  // Se désabonner
  const unsubscribe = useCallback(async () => {
    if (!user?.id) return false;

    setIsLoading(true);
    const success = await pushNotificationService.unsubscribe(user.id);
    
    if (success) {
      setIsSubscribed(false);
      toast.success('Notifications désactivées');
    } else {
      toast.error('Impossible de désactiver les notifications');
    }

    setIsLoading(false);
    return success;
  }, [user?.id]);

  // Notification de test
  const showTestNotification = useCallback(async () => {
    const success = await pushNotificationService.showLocalNotification(
      'EmotionsCare',
      {
        body: 'Les notifications push fonctionnent correctement ! 🎉',
        tag: 'test-notification',
        requireInteraction: false
      }
    );

    if (!success) {
      toast.error('Impossible d\'afficher la notification');
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    requestPermission,
    showTestNotification
  };
}
