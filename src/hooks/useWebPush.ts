// @ts-nocheck
/**
 * Hook Web Push API native - Architecture minimale
 * Remplace FCM pour notifications/rappels via VAPID
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface PushState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  error: string | null;
}

export const useWebPush = () => {
  const [state, setState] = useState<PushState>({
    isSupported: 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window,
    permission: 'default',
    isSubscribed: false,
    subscription: null,
    error: null
  });

  // Vérifier permission actuelle
  const checkPermission = useCallback(async () => {
    if (!state.isSupported) return 'denied';
    
    const permission = await Notification.requestPermission();
    setState(prev => ({ ...prev, permission }));
    return permission;
  }, [state.isSupported]);

  // Demander permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Notifications non supportées' }));
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      return permission === 'granted';
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors de la demande de permission'
      }));
      return false;
    }
  }, [state.isSupported]);

  // S'abonner aux notifications push
  const subscribe = useCallback(async (vapidPublicKey: string): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      throw new Error('Push notifications non supportées');
    }

    try {
      // Enregistrer le service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Attendre que le SW soit prêt
      await navigator.serviceWorker.ready;

      // S'abonner avec la clé VAPID
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      const pushSubscription: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription: pushSubscription
      }));

      // Envoyer l'abonnement au serveur
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pushSubscription)
      });

      return pushSubscription;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur d\'abonnement'
      }));
      throw error;
    }
  }, [state.isSupported]);

  // Se désabonner
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) return true;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      // Notifier le serveur
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: state.subscription.endpoint })
      });

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur lors du désabonnement'
      }));
      return false;
    }
  }, [state.subscription]);

  // Vérifier si déjà abonné
  const checkExistingSubscription = useCallback(async () => {
    if (!state.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          const pushSubscription: PushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: arrayBufferToBase64(subscription.getKey('auth')!)
            }
          };

          setState(prev => ({
            ...prev,
            isSubscribed: true,
            subscription: pushSubscription
          }));
        }
      }
    } catch (error) {
      logger.warn('Erreur lors de la vérification d\'abonnement', error as Error, 'SYSTEM');
    }
  }, [state.isSupported]);

  // Afficher notification locale (test)
  const showLocalNotification = useCallback(async (notification: PushNotification) => {
    if (state.permission !== 'granted') {
      throw new Error('Permission non accordée');
    }

    const notif = new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icon-192x192.png',
      badge: notification.badge || '/badge-72x72.png',
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions
    });

    // Auto-fermer après 5 secondes
    setTimeout(() => notif.close(), 5000);

    return notif;
  }, [state.permission]);

  // Envoyer notification de test via serveur
  const sendTestNotification = useCallback(async () => {
    if (!state.subscription) {
      throw new Error('Pas d\'abonnement actif');
    }

    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: state.subscription,
          notification: {
            title: '🌟 EmotionsCare',
            body: 'Notification de test réussie !',
            icon: '/icon-192x192.png'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erreur serveur lors de l\'envoi');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'envoi de test'
      }));
      throw error;
    }
  }, [state.subscription]);

  // Initialisation
  useEffect(() => {
    if (state.isSupported) {
      checkPermission();
      checkExistingSubscription();
    }
  }, [state.isSupported, checkPermission, checkExistingSubscription]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
    sendTestNotification,
    checkPermission
  };
};

// Hook pour rappels de bien-être
export const useWellnessReminders = () => {
  const { subscribe, sendTestNotification, isSubscribed, isSupported } = useWebPush();
  
  const setupReminders = useCallback(async (
    preferences: {
      morningCheck: boolean;
      lunchBreak: boolean;
      eveningReflection: boolean;
      customTimes?: string[];
    }
  ) => {
    if (!isSupported) {
      // Fallback vers calendrier ICS
      return generateICSReminders(preferences);
    }

    // Configuration push pour rappels
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
    await subscribe(vapidKey);
    
    // Configurer les rappels côté serveur
    await fetch('/api/reminders/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
  }, [isSupported, subscribe]);

  const generateICSReminders = useCallback((preferences: any) => {
    // Génération fichier .ics pour import dans calendrier
    const icsContent = generateICSContent(preferences);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emotionscare-reminders.ics';
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  return {
    isSupported,
    isSubscribed,
    setupReminders,
    sendTestNotification
  };
};

// Utilitaires
function urlBase64ToUint8Array(base64String: string): Uint8Array {
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function generateICSContent(preferences: any): string {
  const now = new Date();
  const events = [];

  if (preferences.morningCheck) {
    events.push(`
BEGIN:VEVENT
DTSTART:${formatICSDate(setTime(now, 9, 0))}
DTEND:${formatICSDate(setTime(now, 9, 15))}
SUMMARY:Check-in matinal - EmotionsCare
DESCRIPTION:Prenez un moment pour évaluer votre état émotionnel
RRULE:FREQ=DAILY
END:VEVENT`);
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EmotionsCare//Reminders//FR
${events.join('')}
END:VCALENDAR`;
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
}

function setTime(date: Date, hours: number, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}