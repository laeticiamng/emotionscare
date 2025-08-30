/**
 * Hook pour les notifications push PWA
 */

import { useState, useEffect } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  error?: string;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default',
    isLoading: false,
  });

  useEffect(() => {
    // Vérifier le support des notifications
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    
    setState(prev => ({
      ...prev,
      isSupported,
      permission: Notification.permission,
    }));
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Notifications non supportées' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission, isLoading: false }));
      
      return permission === 'granted';
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de la demande de permission',
        isLoading: false 
      }));
      return false;
    }
  };

  const sendTestNotification = (): boolean => {
    if (!state.isSupported || state.permission !== 'granted') {
      setState(prev => ({ 
        ...prev, 
        error: 'Permission requise pour les notifications' 
      }));
      return false;
    }

    try {
      // Créer une notification de test
      new Notification('EmotionsCare - Test', {
        body: 'Notification de test réussie ! 🎉',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: false,
      });
      
      console.log('[Push] Notification de test envoyée');
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de l\'envoi de la notification' 
      }));
      return false;
    }
  };

  const getFallbackMessage = (): string => {
    if (!state.isSupported) {
      return 'Notifications non supportées par ce navigateur';
    }
    if (state.permission === 'denied') {
      return 'Notifications bloquées - veuillez autoriser dans les paramètres du navigateur';
    }
    if (state.permission === 'default') {
      return 'Permission de notification requise';
    }
    return 'Notifications disponibles';
  };

  return {
    ...state,
    requestPermission,
    sendTestNotification,
    getFallbackMessage,
  };
};