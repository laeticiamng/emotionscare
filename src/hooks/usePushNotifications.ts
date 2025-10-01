// @ts-nocheck
/**
 * Hook pour les notifications push PWA
 */

import { useState, useEffect } from 'react';

interface PushNotificationState {
  supported: boolean;
  enabled: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  error?: string;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    supported: false,
    enabled: false,
    permission: 'default',
    isLoading: false,
  });

  useEffect(() => {
    // Vérifier le support des notifications
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    const permission = Notification.permission;
    const enabled = permission === 'granted';
    
    setState(prev => ({
      ...prev,
      supported,
      enabled,
      permission,
    }));
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!state.supported) {
      setState(prev => ({ ...prev, error: 'Notifications non supportées' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const permission = await Notification.requestPermission();
      const enabled = permission === 'granted';
      
      setState(prev => ({ 
        ...prev, 
        permission, 
        enabled,
        isLoading: false 
      }));
      
      return enabled;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de la demande de permission',
        isLoading: false 
      }));
      return false;
    }
  };

  const sendTestNotification = async (): Promise<boolean> => {
    if (!state.supported) {
      console.warn('[Push] Notifications non supportées');
      return false;
    }

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        console.warn('[Push] Permission refusée');
        return false;
      }
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
      console.error('[Push] Erreur lors de l\'envoi:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de l\'envoi de la notification' 
      }));
      return false;
    }
  };

  const fallbackAlert = (): void => {
    const message = state.supported 
      ? state.permission === 'denied'
        ? 'Notifications bloquées - veuillez autoriser dans les paramètres du navigateur'
        : 'Permission de notification requise'
      : 'Notifications non supportées par ce navigateur';
    
    alert(`📱 Fallback Notification:\n\n${message}\n\nEmotionsCare - Système de fallback activé`);
    console.log('[Push] Fallback alert affiché:', message);
  };

  return {
    supported: state.supported,
    enabled: state.enabled,
    permission: state.permission,
    isLoading: state.isLoading,
    error: state.error,
    requestPermission,
    sendTestNotification,
    fallbackAlert,
  };
};