// @ts-nocheck
/**
 * Hook pour les notifications push PWA
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

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
      logger.warn('[Push] Notifications non supportées', {}, 'SYSTEM');
      return false;
    }

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        logger.warn('[Push] Permission refusée', {}, 'SYSTEM');
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
      
      logger.info('[Push] Notification de test envoyée', {}, 'SYSTEM');
      return true;
    } catch (error) {
      logger.error('[Push] Erreur lors de l\'envoi', error as Error, 'SYSTEM');
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
    logger.info('[Push] Fallback alert affiché', { message }, 'SYSTEM');
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