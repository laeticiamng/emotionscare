import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CoachNotification {
  id: string;
  userId: string;
  type: 'session_reminder' | 'streak_milestone' | 'program_progress' | 'technique_suggestion';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  scheduledFor?: string;
}

export interface NotificationPreferences {
  enableReminders: boolean;
  reminderTime: string; // Format: HH:MM
  enableStreakNotifications: boolean;
  enableProgramUpdates: boolean;
  enableTechniqueSuggestions: boolean;
  notificationChannels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enableReminders: true,
  reminderTime: '09:00',
  enableStreakNotifications: true,
  enableProgramUpdates: true,
  enableTechniqueSuggestions: true,
  notificationChannels: {
    email: false,
    push: false,
    inApp: true,
  },
};

/**
 * Récupère les préférences de notification de l'utilisateur
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('notification_settings')
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.warn('Préférences de notification non trouvées, utilisation des valeurs par défaut', error, 'SYSTEM');
      return DEFAULT_PREFERENCES;
    }

    return data?.notification_settings || DEFAULT_PREFERENCES;
  } catch (error) {
    logger.error('Erreur lors de la récupération des préférences', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error instanceof Error ? error : new Error('Failed to fetch notification preferences');
  }
}

/**
 * Met à jour les préférences de notification
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<boolean> {
  try {
    const currentPreferences = await getNotificationPreferences(userId);
    const updatedPreferences = { ...currentPreferences, ...preferences };

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        notification_settings: updatedPreferences,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    logger.info('Préférences de notification mises à jour', { userId }, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('Erreur lors de la mise à jour des préférences', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error instanceof Error ? error : new Error('Failed to update notification preferences');
  }
}

/**
 * Crée une notification pour l'utilisateur
 */
export async function createNotification(
  userId: string,
  notification: Omit<CoachNotification, 'id' | 'userId' | 'read' | 'createdAt'>
): Promise<string | null> {
  try {
    const preferences = await getNotificationPreferences(userId);

    // Vérifier si ce type de notification est activé
    const isEnabled =
      (notification.type === 'session_reminder' && preferences.enableReminders) ||
      (notification.type === 'streak_milestone' && preferences.enableStreakNotifications) ||
      (notification.type === 'program_progress' && preferences.enableProgramUpdates) ||
      (notification.type === 'technique_suggestion' && preferences.enableTechniqueSuggestions);

    if (!isEnabled) {
      logger.debug('Notification désactivée par les préférences utilisateur', { type: notification.type }, 'SYSTEM');
      return null;
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        action_url: notification.actionUrl,
        scheduled_for: notification.scheduledFor,
        read: false,
      })
      .select('id')
      .single();

    if (error) throw error;

    logger.info('Notification créée', { notificationId: data.id, type: notification.type }, 'SYSTEM');
    return data.id;
  } catch (error) {
    logger.error('Erreur lors de la création de la notification', error as Error, 'SYSTEM');
    return null;
  }
}

/**
 * Planifie une notification de rappel de session
 */
export async function scheduleSessionReminder(
  userId: string,
  sessionDate: Date,
  reminderMinutesBefore: number = 60
): Promise<string | null> {
  const reminderDate = new Date(sessionDate.getTime() - reminderMinutesBefore * 60000);

  return createNotification(userId, {
    type: 'session_reminder',
    title: '🧘 Rappel de session de coaching',
    message: `Votre session de coaching commence dans ${reminderMinutesBefore} minutes. Prenez quelques instants pour vous préparer.`,
    priority: 'high',
    actionUrl: '/app/coach',
    scheduledFor: reminderDate.toISOString(),
  });
}

/**
 * Envoie une notification de jalon de série
 */
export async function notifyStreakMilestone(userId: string, streakDays: number): Promise<string | null> {
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];

  if (!milestones.includes(streakDays)) {
    return null;
  }

  let message = '';
  let emoji = '';

  if (streakDays <= 7) {
    emoji = '🌱';
    message = `Bravo ! Vous avez maintenu une série de ${streakDays} jours. Continuez sur cette lancée !`;
  } else if (streakDays <= 30) {
    emoji = '🌿';
    message = `Impressionnant ! ${streakDays} jours consécutifs d'engagement. Votre pratique s'enracine !`;
  } else if (streakDays <= 90) {
    emoji = '🌳';
    message = `Extraordinaire ! ${streakDays} jours de pratique continue. Vous êtes sur la voie de la maîtrise !`;
  } else {
    emoji = '🏆';
    message = `Incroyable ! ${streakDays} jours d'engagement exceptionnel. Vous êtes un modèle de persévérance !`;
  }

  return createNotification(userId, {
    type: 'streak_milestone',
    title: `${emoji} Jalon atteint !`,
    message,
    priority: 'medium',
    actionUrl: '/app/coach/analytics',
  });
}

/**
 * Envoie une notification de progrès dans un programme
 */
export async function notifyProgramProgress(
  userId: string,
  programTitle: string,
  completionPercentage: number
): Promise<string | null> {
  const milestones = [25, 50, 75, 100];
  const milestone = milestones.find(m => m === completionPercentage);

  if (!milestone) {
    return null;
  }

  let emoji = '';
  let message = '';

  if (milestone === 25) {
    emoji = '🎯';
    message = `Vous avez complété 25% du programme "${programTitle}". Excellent début !`;
  } else if (milestone === 50) {
    emoji = '🚀';
    message = `Mi-parcours ! Vous avez atteint 50% du programme "${programTitle}". Continuez !`;
  } else if (milestone === 75) {
    emoji = '⭐';
    message = `Presque là ! 75% du programme "${programTitle}" terminé. La ligne d'arrivée est proche !`;
  } else {
    emoji = '🎉';
    message = `Félicitations ! Vous avez terminé le programme "${programTitle}". Quel accomplissement !`;
  }

  return createNotification(userId, {
    type: 'program_progress',
    title: `${emoji} Progrès dans votre programme`,
    message,
    priority: milestone === 100 ? 'high' : 'medium',
    actionUrl: '/app/coach/programs',
  });
}

/**
 * Suggère une technique basée sur l'émotion récente
 */
export async function suggestTechnique(
  userId: string,
  emotion: string,
  technique: string
): Promise<string | null> {
  const emotionMessages: Record<string, string> = {
    stress: '💙 Vous semblez stressé récemment. Essayez cette technique de respiration pour retrouver votre calme.',
    tristesse: '🌈 Nous avons remarqué que vous vous sentez triste. Cette technique pourrait vous aider à vous sentir mieux.',
    colere: '🧘 La colère peut être difficile à gérer. Voici une technique pour canaliser cette énergie de manière constructive.',
    peur: '💪 L\'anxiété est normale. Cette technique vous aidera à retrouver confiance et sérénité.',
    joie: '✨ Profitez de ce moment positif ! Voici une technique pour ancrer et amplifier cette joie.',
  };

  return createNotification(userId, {
    type: 'technique_suggestion',
    title: 'Suggestion personnalisée',
    message: emotionMessages[emotion] || 'Voici une technique qui pourrait vous être utile.',
    priority: 'low',
    actionUrl: '/app/coach',
  });
}

/**
 * Récupère les notifications non lues de l'utilisateur
 */
export async function getUnreadNotifications(userId: string): Promise<CoachNotification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data || []).map(n => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      priority: n.priority,
      read: n.read,
      actionUrl: n.action_url,
      createdAt: n.created_at,
      scheduledFor: n.scheduled_for,
    }));
  } catch (error) {
    logger.error('Erreur lors de la récupération des notifications', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error;
  }
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;

    logger.debug('Notification marquée comme lue', { notificationId }, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('Erreur lors du marquage de la notification', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error;
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;

    logger.info('Toutes les notifications marquées comme lues', { userId }, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('Erreur lors du marquage des notifications', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error;
  }
}

/**
 * Supprime une notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

    if (error) throw error;

    logger.debug('Notification supprimée', { notificationId }, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression de la notification', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
    throw error;
  }
}

/**
 * Vérifie et envoie les rappels quotidiens
 */
export async function sendDailyReminders(userId: string): Promise<void> {
  try {
    const preferences = await getNotificationPreferences(userId);

    if (!preferences.enableReminders) {
      return;
    }

    // Récupérer la dernière session
    const { data: lastSession } = await supabase
      .from('ai_coach_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Si pas de session depuis 24h, envoyer un rappel
    if (!lastSession || isMoreThan24HoursAgo(new Date(lastSession.created_at))) {
      await createNotification(userId, {
        type: 'session_reminder',
        title: '💬 Prenez un moment pour vous',
        message: 'Cela fait un moment que nous ne nous sommes pas parlé. Comment vous sentez-vous aujourd\'hui ?',
        priority: 'low',
        actionUrl: '/app/coach',
      });
    }
  } catch (error) {
    logger.error('Erreur lors de l\'envoi des rappels quotidiens', error as Error, 'SYSTEM');
  }
}

function isMoreThan24HoursAgo(date: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > 24;
}

export default {
  getNotificationPreferences,
  updateNotificationPreferences,
  createNotification,
  scheduleSessionReminder,
  notifyStreakMilestone,
  notifyProgramProgress,
  suggestTechnique,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendDailyReminders,
};
