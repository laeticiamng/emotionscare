/**
 * Hook Web Push API native - Architecture minimale
 * Utilise l'API Notification native + localStorage pour persistance
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  data?: unknown;
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

const WEB_PUSH_STORAGE_KEY = 'web_push_subscription';

export const useWebPush = () => {
  const { user } = useAuth();
  const [state, setState] = useState<PushState>({
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
    permission: 'default',
    isSubscribed: false,
    subscription: null,
    error: null
  });

  // Vérifier permission actuelle
  const checkPermission = useCallback(async () => {
    if (!state.isSupported) return 'denied';
    
    const permission = Notification.permission;
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
  const subscribe = useCallback(async (_vapidPublicKey?: string): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      throw new Error('Push notifications non supportées');
    }

    try {
      // Request permission first
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission non accordée');
      }

      // Create a mock subscription (native Notification API doesn't use VAPID)
      const pushSubscription: PushSubscription = {
        endpoint: `local://${crypto.randomUUID()}`,
        keys: {
          p256dh: btoa(crypto.randomUUID()),
          auth: btoa(crypto.randomUUID().slice(0, 16))
        }
      };

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription: pushSubscription,
        permission: 'granted'
      }));

      // Store locally
      localStorage.setItem(WEB_PUSH_STORAGE_KEY, JSON.stringify(pushSubscription));

      // Persist to Supabase if user is logged in
      if (user) {
        try {
          await supabase.from('user_settings').upsert({
            user_id: user.id,
            key: 'web_push_subscription',
            value: JSON.stringify(pushSubscription),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });
        } catch (err) {
          logger.warn('Failed to save web push subscription to Supabase', err as Error, 'WEB_PUSH');
        }
      }

      return pushSubscription;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur d\'abonnement'
      }));
      throw error;
    }
  }, [state.isSupported, user]);

  // Se désabonner
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) return true;

    try {
      // Remove from localStorage
      localStorage.removeItem(WEB_PUSH_STORAGE_KEY);

      // Remove from Supabase if user is logged in
      if (user) {
        try {
          await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', user.id)
            .eq('key', 'web_push_subscription');
        } catch (err) {
          logger.warn('Failed to remove web push subscription from Supabase', err as Error, 'WEB_PUSH');
        }
      }

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
  }, [state.subscription, user]);

  // Vérifier si déjà abonné
  const checkExistingSubscription = useCallback(async () => {
    if (!state.isSupported) return;

    try {
      const stored = localStorage.getItem(WEB_PUSH_STORAGE_KEY);
      if (stored) {
        const pushSubscription = JSON.parse(stored) as PushSubscription;
        setState(prev => ({
          ...prev,
          isSubscribed: true,
          subscription: pushSubscription
        }));
      }
    } catch (error) {
      logger.warn('Erreur lors de la vérification d\'abonnement', error as Error, 'WEB_PUSH');
    }
  }, [state.isSupported]);

  // Afficher notification locale
  const showLocalNotification = useCallback(async (notification: PushNotification) => {
    if (state.permission !== 'granted') {
      throw new Error('Permission non accordée');
    }

    const notif = new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/favicon.ico',
      badge: notification.badge,
      tag: notification.tag,
      data: notification.data
    });

    // Auto-fermer après 5 secondes
    setTimeout(() => notif.close(), 5000);

    return notif;
  }, [state.permission]);

  // Envoyer notification de test
  const sendTestNotification = useCallback(async () => {
    if (state.permission !== 'granted') {
      throw new Error('Permission non accordée');
    }

    try {
      await showLocalNotification({
        title: '🌟 EmotionsCare',
        body: 'Notification de test réussie !',
        icon: '/favicon.ico'
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'envoi de test'
      }));
      throw error;
    }
  }, [state.permission, showLocalNotification]);

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
  const { user } = useAuth();
  const { sendTestNotification, isSubscribed, isSupported, permission } = useWebPush();
  
  const setupReminders = useCallback(async (
    preferences: {
      morningCheck: boolean;
      lunchBreak: boolean;
      eveningReflection: boolean;
      customTimes?: string[];
    }
  ) => {
    if (!isSupported || permission !== 'granted') {
      // Fallback vers calendrier ICS
      return generateICSReminders(preferences);
    }

    // Store preferences in Supabase
    if (user) {
      try {
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          key: 'wellness_reminders',
          value: JSON.stringify(preferences),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });
      } catch (err) {
        logger.warn('Failed to save wellness reminders', err as Error, 'WEB_PUSH');
      }
    }

    // Store locally too
    localStorage.setItem('wellness_reminders', JSON.stringify(preferences));
  }, [isSupported, permission, user]);

  const generateICSReminders = useCallback((preferences: {
    morningCheck: boolean;
    lunchBreak: boolean;
    eveningReflection: boolean;
    customTimes?: string[];
  }) => {
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
function generateICSContent(preferences: {
  morningCheck: boolean;
  lunchBreak: boolean;
  eveningReflection: boolean;
  customTimes?: string[];
}): string {
  const now = new Date();
  const events: string[] = [];

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

  if (preferences.lunchBreak) {
    events.push(`
BEGIN:VEVENT
DTSTART:${formatICSDate(setTime(now, 12, 30))}
DTEND:${formatICSDate(setTime(now, 12, 45))}
SUMMARY:Pause midi - EmotionsCare
DESCRIPTION:Une pause bien-être pour recharger vos batteries
RRULE:FREQ=DAILY
END:VEVENT`);
  }

  if (preferences.eveningReflection) {
    events.push(`
BEGIN:VEVENT
DTSTART:${formatICSDate(setTime(now, 21, 0))}
DTEND:${formatICSDate(setTime(now, 21, 15))}
SUMMARY:Réflexion du soir - EmotionsCare
DESCRIPTION:Moment de gratitude et de relâchement avant de dormir
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
