/**
 * useNotificationSender - Hook pour envoyer des notifications
 * Corrige le problème de 0 notifications envoyées
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'reminder' 
  | 'challenge' 
  | 'social' 
  | 'system'
  | 'wellness';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  priority?: 'low' | 'normal' | 'high';
  expires_at?: string;
  metadata?: Record<string, unknown>;
}

export function useNotificationSender() {
  const { user, isAuthenticated } = useAuth();

  /**
   * Envoie une notification à l'utilisateur courant
   */
  const sendNotification = useCallback(async (
    payload: NotificationPayload
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot send notification: user not authenticated', 'NOTIFICATION');
      return false;
    }

    return sendToUser(user.id, payload);
  }, [isAuthenticated, user?.id]);

  /**
   * Envoie une notification à un utilisateur spécifique
   */
  const sendToUser = useCallback(async (
    userId: string,
    payload: NotificationPayload
  ): Promise<boolean> => {
    try {
      const notification = {
        user_id: userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        icon: payload.icon || getDefaultIcon(payload.type),
        action_url: payload.action_url,
        priority: payload.priority || 'normal',
        read: false,
        expires_at: payload.expires_at,
        metadata: payload.metadata || {},
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('notifications')
        .insert(notification);

      if (error) {
        logger.error(`Failed to send notification: ${error.message}`, 'NOTIFICATION');
        return false;
      }

      // Optionally trigger push notification via Edge Function
      try {
        await supabase.functions.invoke('send-push-notification', {
          body: {
            user_id: userId,
            title: payload.title,
            body: payload.message,
            icon: notification.icon,
            url: payload.action_url,
          },
        });
      } catch (pushErr) {
        // Push notification is optional, log but don't fail
        logger.debug(`Push notification skipped: ${pushErr}`, 'NOTIFICATION');
      }

      logger.info(`Notification sent to ${userId}: ${payload.title}`, 'NOTIFICATION');
      return true;
    } catch (err) {
      logger.error(`Notification error: ${err}`, 'NOTIFICATION');
      return false;
    }
  }, []);

  /**
   * Envoie une notification de badge débloqué
   */
  const notifyAchievement = useCallback(async (
    achievementName: string,
    achievementDescription: string
  ): Promise<boolean> => {
    return sendNotification({
      type: 'achievement',
      title: '🏆 Badge débloqué !',
      message: `${achievementName} - ${achievementDescription}`,
      icon: '🏆',
      action_url: '/gamification',
      priority: 'high',
    });
  }, [sendNotification]);

  /**
   * Envoie une notification de streak
   */
  const notifyStreak = useCallback(async (
    streakDays: number
  ): Promise<boolean> => {
    const messages: Record<number, string> = {
      3: '3 jours consécutifs ! Continuez comme ça ! 🔥',
      7: 'Une semaine complète ! Vous êtes en feu ! 🌟',
      14: 'Deux semaines de suite ! Incroyable ! 💪',
      30: 'Un mois de pratique ! Vous êtes un champion ! 🏆',
      100: '100 jours ! Vous êtes légendaire ! 👑',
    };

    const message = messages[streakDays] || `${streakDays} jours consécutifs ! 🔥`;

    return sendNotification({
      type: 'streak',
      title: '🔥 Streak maintenue !',
      message,
      icon: '🔥',
      action_url: '/gamification',
    });
  }, [sendNotification]);

  /**
   * Envoie un rappel de bien-être
   */
  const notifyWellnessReminder = useCallback(async (
    reminderType: 'breath' | 'journal' | 'scan' | 'meditation'
  ): Promise<boolean> => {
    const reminders = {
      breath: {
        title: '🌬️ Pause respiration',
        message: 'Un moment de calme vous attend. Prenez 2 minutes pour respirer.',
        url: '/app/breath',
      },
      journal: {
        title: '📓 Moment journal',
        message: 'Comment vous sentez-vous ? Prenez un instant pour écrire.',
        url: '/app/journal',
      },
      scan: {
        title: '🔬 Check-in émotionnel',
        message: 'Un scan rapide pour comprendre vos émotions du moment.',
        url: '/app/scan',
      },
      meditation: {
        title: '🧘 Temps de méditation',
        message: 'Une session guidée vous attend pour vous recentrer.',
        url: '/app/meditation',
      },
    };

    const reminder = reminders[reminderType];

    return sendNotification({
      type: 'wellness',
      title: reminder.title,
      message: reminder.message,
      icon: reminder.title.split(' ')[0],
      action_url: reminder.url,
      priority: 'normal',
    });
  }, [sendNotification]);

  /**
   * Marque une notification comme lue
   */
  const markAsRead = useCallback(async (
    notificationId: string
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      return !error;
    } catch (err) {
      logger.error(`Failed to mark notification as read: ${err}`, 'NOTIFICATION');
      return false;
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Récupère les notifications non lues
   */
  const getUnreadCount = useCallback(async (): Promise<number> => {
    if (!isAuthenticated || !user?.id) return 0;

    try {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      return count || 0;
    } catch (err) {
      logger.error(`Failed to get unread count: ${err}`, 'NOTIFICATION');
      return 0;
    }
  }, [isAuthenticated, user?.id]);

  return {
    sendNotification,
    sendToUser,
    notifyAchievement,
    notifyStreak,
    notifyWellnessReminder,
    markAsRead,
    getUnreadCount,
  };
}

// Helper
function getDefaultIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    achievement: '🏆',
    streak: '🔥',
    reminder: '⏰',
    challenge: '🎯',
    social: '👥',
    system: '⚙️',
    wellness: '💚',
  };
  return icons[type] || '📬';
}

export default useNotificationSender;
