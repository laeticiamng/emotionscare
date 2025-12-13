import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Configuration des notifications */
export interface PushNotificationConfig {
  enabled: boolean;
  channels: string[];
  dailyReminder: boolean;
  dailyReminderTime: string;
  newReleaseAlerts: boolean;
  moodSuggestions: boolean;
  weeklyDigest: boolean;
}

/** Canal de notification */
export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_CONFIG: PushNotificationConfig = {
  enabled: true,
  channels: ['daily_reminder', 'achievement'],
  dailyReminder: true,
  dailyReminderTime: '20:00',
  newReleaseAlerts: true,
  moodSuggestions: true,
  weeklyDigest: true
};

const CHANNELS: NotificationChannel[] = [
  { id: 'daily_reminder', name: 'Rappel quotidien', description: 'Session de musicothérapie', enabled: true },
  { id: 'new_release', name: 'Nouvelles sorties', description: 'Nouvelles musiques', enabled: true },
  { id: 'mood_suggestion', name: 'Suggestions', description: 'Recommandations personnalisées', enabled: true },
  { id: 'achievement', name: 'Récompenses', description: 'Accomplissements', enabled: true },
  { id: 'streak', name: 'Séries', description: 'Rappels de série', enabled: true }
];

/** Récupère la configuration */
export const getPushNotificationConfig = async (): Promise<PushNotificationConfig> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return DEFAULT_CONFIG;

    const { data } = await supabase
      .from('music_notification_config')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (!data) return DEFAULT_CONFIG;

    return {
      enabled: data.enabled,
      channels: data.channels || [],
      dailyReminder: data.daily_reminder,
      dailyReminderTime: data.daily_reminder_time || '20:00',
      newReleaseAlerts: data.new_release_alerts,
      moodSuggestions: data.mood_suggestions,
      weeklyDigest: data.weekly_digest
    };
  } catch (error) {
    logger.error('Error fetching config', error as Error, 'MUSIC');
    return DEFAULT_CONFIG;
  }
};

/** Met à jour la configuration */
export const updatePushNotificationConfig = async (
  config: Partial<PushNotificationConfig>
): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabase.from('music_notification_config').upsert({
      user_id: userData.user.id,
      enabled: config.enabled,
      channels: config.channels,
      daily_reminder: config.dailyReminder,
      daily_reminder_time: config.dailyReminderTime,
      new_release_alerts: config.newReleaseAlerts,
      mood_suggestions: config.moodSuggestions,
      weekly_digest: config.weeklyDigest,
      updated_at: new Date().toISOString()
    });

    logger.info('Config updated', undefined, 'MUSIC');
  } catch (error) {
    logger.error('Error updating config', error as Error, 'MUSIC');
    throw error;
  }
};

/** Récupère les canaux disponibles */
export const getNotificationChannels = (): NotificationChannel[] => CHANNELS;

/** Active/désactive un canal */
export const toggleChannel = async (channelId: string, enabled: boolean): Promise<void> => {
  const config = await getPushNotificationConfig();
  const channels = enabled
    ? [...new Set([...config.channels, channelId])]
    : config.channels.filter(c => c !== channelId);
  await updatePushNotificationConfig({ channels });
};

/** Envoie une notification musicale */
export const sendNotification = async (
  type: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> => {
  try {
    const config = await getPushNotificationConfig();
    if (!config.enabled || !config.channels.includes(type)) return;

    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: '/icons/music-notification.png',
        badge: '/icons/badge.png',
        data,
        tag: type
      });
    }

    logger.info('Notification sent', { type }, 'MUSIC');
  } catch (error) {
    logger.error('Error sending notification', error as Error, 'MUSIC');
  }
};

/** Récupère les notifications non lues */
export const getUnreadNotifications = async (): Promise<unknown[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data } = await supabase
      .from('music_notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  } catch (error) {
    return [];
  }
};

/** Marque une notification comme lue */
export const markAsRead = async (id: string): Promise<void> => {
  await supabase.from('music_notifications').update({ read: true }).eq('id', id);
};

/** Marque toutes comme lues */
export const markAllAsRead = async (): Promise<void> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.id) return;

  await supabase
    .from('music_notifications')
    .update({ read: true })
    .eq('user_id', userData.user.id)
    .eq('read', false);
};

/** Programme un rappel quotidien */
export const scheduleDailyReminder = async (time: string): Promise<void> => {
  await updatePushNotificationConfig({ dailyReminder: true, dailyReminderTime: time });
};

/** Annule le rappel quotidien */
export const cancelDailyReminder = async (): Promise<void> => {
  await updatePushNotificationConfig({ dailyReminder: false });
};
