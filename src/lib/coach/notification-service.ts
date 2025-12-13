// @ts-nocheck
/**
 * Coach Notification Service - Service de notifications pour le coach
 * Gestion complète des notifications avec priorités, groupes et planification
 */

import { Notification } from "@/types/notification";
import { logger } from '@/lib/logger';

/** Type de notification */
export type NotificationType =
  | 'reminder'
  | 'achievement'
  | 'milestone'
  | 'session'
  | 'message'
  | 'alert'
  | 'tip'
  | 'challenge'
  | 'streak'
  | 'social'
  | 'system';

/** Priorité de notification */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/** Statut de notification */
export type NotificationStatus = 'pending' | 'sent' | 'read' | 'dismissed' | 'scheduled';

/** Canal de notification */
export type NotificationChannel = 'push' | 'email' | 'in_app' | 'sms';

/** Configuration de notification étendue */
export interface ExtendedNotification extends Partial<Notification> {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  createdAt: number;
  scheduledAt?: number;
  sentAt?: number;
  readAt?: number;
  dismissedAt?: number;
  expiresAt?: number;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  groupId?: string;
  badge?: number;
  sound?: string;
  icon?: string;
  image?: string;
  persistent?: boolean;
  requireInteraction?: boolean;
}

/** Action de notification */
export interface NotificationAction {
  id: string;
  label: string;
  icon?: string;
  action: string;
  data?: Record<string, unknown>;
}

/** Groupe de notifications */
export interface NotificationGroup {
  id: string;
  name: string;
  notifications: ExtendedNotification[];
  collapsed: boolean;
  count: number;
}

/** Préférences de notification */
export interface NotificationPreferences {
  enabled: boolean;
  channels: Record<NotificationChannel, boolean>;
  types: Record<NotificationType, boolean>;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string;
  maxPerHour?: number;
  groupSimilar: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

/** Stats de notifications */
export interface NotificationStats {
  total: number;
  pending: number;
  sent: number;
  read: number;
  dismissed: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  deliveryRate: number;
  readRate: number;
  avgTimeToRead: number;
}

/** Options de création */
export interface CreateNotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  scheduledAt?: number;
  expiresAt?: number;
  actions?: NotificationAction[];
  groupId?: string;
  badge?: number;
  sound?: string;
  icon?: string;
  image?: string;
  persistent?: boolean;
  data?: Record<string, unknown>;
}

/** Filtres de notification */
export interface NotificationFilters {
  type?: NotificationType[];
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  channel?: NotificationChannel[];
  startDate?: number;
  endDate?: number;
  unreadOnly?: boolean;
  groupId?: string;
}

// Storage keys
const NOTIFICATIONS_KEY = 'ec_coach_notifications';
const PREFERENCES_KEY = 'ec_notification_prefs';
const STATS_KEY = 'ec_notification_stats';

// Préférences par défaut
const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  channels: {
    push: true,
    email: true,
    in_app: true,
    sms: false
  },
  types: {
    reminder: true,
    achievement: true,
    milestone: true,
    session: true,
    message: true,
    alert: true,
    tip: true,
    challenge: true,
    streak: true,
    social: true,
    system: true
  },
  quietHoursEnabled: false,
  maxPerHour: 10,
  groupSimilar: true,
  soundEnabled: true,
  vibrationEnabled: true
};

// État interne
let notifications: ExtendedNotification[] = [];
const listeners: Array<(notifications: ExtendedNotification[]) => void> = [];
let scheduledTimers: Map<string, NodeJS.Timeout> = new Map();

/** Générer un ID unique */
function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Charger les notifications depuis le storage */
function loadNotifications(): ExtendedNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/** Sauvegarder les notifications */
function saveNotifications(): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    logger.error('Failed to save notifications', error as Error, 'NOTIF');
  }
}

/** Notifier les listeners */
function notifyListeners(): void {
  listeners.forEach(listener => listener([...notifications]));
}

/** Vérifier si on est dans les heures silencieuses */
function isQuietHours(): boolean {
  const prefs = loadPreferences();
  if (!prefs.quietHoursEnabled || !prefs.quietHoursStart || !prefs.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (prefs.quietHoursStart <= prefs.quietHoursEnd) {
    return currentTime >= prefs.quietHoursStart && currentTime <= prefs.quietHoursEnd;
  } else {
    // Gère le cas où les heures silencieuses passent minuit
    return currentTime >= prefs.quietHoursStart || currentTime <= prefs.quietHoursEnd;
  }
}

/** Charger les préférences */
export function loadPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : { ...DEFAULT_PREFERENCES };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/** Sauvegarder les préférences */
export function savePreferences(prefs: Partial<NotificationPreferences>): NotificationPreferences {
  const current = loadPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  logger.info('Notification preferences updated', { prefs }, 'NOTIF');
  return updated;
}

/** Créer une notification */
export const createNotification = async (
  notification: Partial<Notification>,
  options: CreateNotificationOptions = {}
): Promise<ExtendedNotification> => {
  const prefs = loadPreferences();

  // Vérifier si les notifications sont activées
  if (!prefs.enabled) {
    logger.debug('Notifications disabled', {}, 'NOTIF');
    throw new Error('Notifications are disabled');
  }

  const now = Date.now();
  const type = options.type || 'message';

  // Vérifier si ce type est activé
  if (!prefs.types[type]) {
    logger.debug('Notification type disabled', { type }, 'NOTIF');
    throw new Error(`Notification type "${type}" is disabled`);
  }

  const id = generateId();
  const extendedNotif: ExtendedNotification = {
    id,
    userId: notification.userId || 'unknown',
    type,
    title: notification.title || 'Notification',
    body: notification.body || '',
    priority: options.priority || 'normal',
    status: options.scheduledAt ? 'scheduled' : 'pending',
    channels: options.channels || ['in_app'],
    createdAt: now,
    scheduledAt: options.scheduledAt,
    expiresAt: options.expiresAt,
    data: { ...notification, ...options.data },
    actions: options.actions,
    groupId: options.groupId,
    badge: options.badge,
    sound: options.sound,
    icon: options.icon,
    image: options.image,
    persistent: options.persistent
  };

  notifications.push(extendedNotif);
  saveNotifications();
  notifyListeners();

  // Planifier si nécessaire
  if (options.scheduledAt && options.scheduledAt > now) {
    scheduleNotification(extendedNotif);
  } else {
    await sendNotification(extendedNotif);
  }

  logger.info("Notification created", { id, type, priority: extendedNotif.priority }, 'NOTIF');
  return extendedNotif;
};

/** Envoyer une notification */
async function sendNotification(notification: ExtendedNotification): Promise<void> {
  const prefs = loadPreferences();

  // Vérifier les heures silencieuses pour les non-urgentes
  if (isQuietHours() && notification.priority !== 'urgent') {
    logger.debug('Notification delayed due to quiet hours', { id: notification.id }, 'NOTIF');
    notification.scheduledAt = getNextAvailableTime();
    scheduleNotification(notification);
    return;
  }

  notification.status = 'sent';
  notification.sentAt = Date.now();
  saveNotifications();
  notifyListeners();

  // Envoyer via les différents canaux
  for (const channel of notification.channels) {
    if (prefs.channels[channel]) {
      await sendViaChannel(notification, channel);
    }
  }

  logger.info('Notification sent', { id: notification.id, channels: notification.channels }, 'NOTIF');
}

/** Obtenir le prochain moment disponible après les heures silencieuses */
function getNextAvailableTime(): number {
  const prefs = loadPreferences();
  if (!prefs.quietHoursEnd) return Date.now();

  const now = new Date();
  const [hours, minutes] = prefs.quietHoursEnd.split(':').map(Number);
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime();
}

/** Envoyer via un canal spécifique */
async function sendViaChannel(notification: ExtendedNotification, channel: NotificationChannel): Promise<void> {
  switch (channel) {
    case 'push':
      await sendPushNotification(notification);
      break;
    case 'in_app':
      // Déjà géré par le système de notifications in-app
      break;
    case 'email':
      // TODO: Intégrer avec le service email
      logger.debug('Email notification would be sent', { id: notification.id }, 'NOTIF');
      break;
    case 'sms':
      // TODO: Intégrer avec le service SMS
      logger.debug('SMS notification would be sent', { id: notification.id }, 'NOTIF');
      break;
  }
}

/** Envoyer une notification push */
async function sendPushNotification(notification: ExtendedNotification): Promise<void> {
  if (!('Notification' in window)) {
    logger.warn('Push notifications not supported', {}, 'NOTIF');
    return;
  }

  if (Notification.permission !== 'granted') {
    logger.debug('Push notifications not permitted', {}, 'NOTIF');
    return;
  }

  const prefs = loadPreferences();

  try {
    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon,
      image: notification.image,
      badge: notification.badge?.toString(),
      tag: notification.groupId || notification.id,
      requireInteraction: notification.requireInteraction,
      silent: !prefs.soundEnabled,
      data: notification.data
    };

    if (notification.actions?.length) {
      options.actions = notification.actions.map(a => ({
        action: a.action,
        title: a.label,
        icon: a.icon
      }));
    }

    new Notification(notification.title, options);

    if (prefs.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    logger.debug('Push notification displayed', { id: notification.id }, 'NOTIF');
  } catch (error) {
    logger.error('Failed to send push notification', error as Error, 'NOTIF');
  }
}

/** Planifier une notification */
function scheduleNotification(notification: ExtendedNotification): void {
  if (!notification.scheduledAt) return;

  const delay = notification.scheduledAt - Date.now();
  if (delay <= 0) {
    sendNotification(notification);
    return;
  }

  const timer = setTimeout(() => {
    sendNotification(notification);
    scheduledTimers.delete(notification.id);
  }, delay);

  scheduledTimers.set(notification.id, timer);
  logger.debug('Notification scheduled', { id: notification.id, delay }, 'NOTIF');
}

/** Annuler une notification planifiée */
export function cancelScheduledNotification(id: string): boolean {
  const timer = scheduledTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    scheduledTimers.delete(id);

    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.status = 'dismissed';
      notif.dismissedAt = Date.now();
      saveNotifications();
      notifyListeners();
    }

    logger.info('Scheduled notification cancelled', { id }, 'NOTIF');
    return true;
  }
  return false;
}

/** Marquer une notification comme lue */
export const markNotificationAsRead = async (id: string): Promise<{ success: boolean }> => {
  const notif = notifications.find(n => n.id === id);
  if (!notif) {
    logger.warn('Notification not found', { id }, 'NOTIF');
    return { success: false };
  }

  notif.status = 'read';
  notif.readAt = Date.now();
  saveNotifications();
  notifyListeners();

  logger.info('Notification marked as read', { id }, 'NOTIF');
  return { success: true };
};

/** Marquer plusieurs notifications comme lues */
export async function markMultipleAsRead(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const result = await markNotificationAsRead(id);
    if (result.success) count++;
  }
  return count;
}

/** Marquer toutes comme lues */
export async function markAllAsRead(userId: string): Promise<number> {
  const userNotifs = notifications.filter(n => n.userId === userId && n.status === 'sent');
  let count = 0;

  for (const notif of userNotifs) {
    notif.status = 'read';
    notif.readAt = Date.now();
    count++;
  }

  if (count > 0) {
    saveNotifications();
    notifyListeners();
    logger.info('All notifications marked as read', { userId, count }, 'NOTIF');
  }

  return count;
}

/** Rejeter une notification */
export async function dismissNotification(id: string): Promise<boolean> {
  const notif = notifications.find(n => n.id === id);
  if (!notif) return false;

  notif.status = 'dismissed';
  notif.dismissedAt = Date.now();
  saveNotifications();
  notifyListeners();

  logger.info('Notification dismissed', { id }, 'NOTIF');
  return true;
}

/** Supprimer une notification */
export async function deleteNotification(id: string): Promise<boolean> {
  const index = notifications.findIndex(n => n.id === id);
  if (index === -1) return false;

  notifications.splice(index, 1);
  saveNotifications();
  notifyListeners();

  // Annuler si planifiée
  cancelScheduledNotification(id);

  logger.info('Notification deleted', { id }, 'NOTIF');
  return true;
}

/** Obtenir les notifications d'un utilisateur */
export const getUserNotifications = async (
  userId: string,
  filters?: NotificationFilters
): Promise<ExtendedNotification[]> => {
  if (notifications.length === 0) {
    notifications = loadNotifications();
  }

  let result = notifications.filter(n => n.userId === userId);

  if (filters) {
    if (filters.type?.length) {
      result = result.filter(n => filters.type!.includes(n.type));
    }
    if (filters.priority?.length) {
      result = result.filter(n => filters.priority!.includes(n.priority));
    }
    if (filters.status?.length) {
      result = result.filter(n => filters.status!.includes(n.status));
    }
    if (filters.channel?.length) {
      result = result.filter(n => n.channels.some(c => filters.channel!.includes(c)));
    }
    if (filters.startDate) {
      result = result.filter(n => n.createdAt >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter(n => n.createdAt <= filters.endDate!);
    }
    if (filters.unreadOnly) {
      result = result.filter(n => n.status === 'sent');
    }
    if (filters.groupId) {
      result = result.filter(n => n.groupId === filters.groupId);
    }
  }

  // Filtrer les expirées
  const now = Date.now();
  result = result.filter(n => !n.expiresAt || n.expiresAt > now);

  logger.info('Retrieved user notifications', { userId, count: result.length }, 'NOTIF');
  return result;
};

/** Obtenir le nombre de non-lues */
export async function getUnreadCount(userId: string): Promise<number> {
  const notifs = await getUserNotifications(userId, { unreadOnly: true });
  return notifs.length;
}

/** Grouper les notifications */
export function groupNotifications(notifs: ExtendedNotification[]): NotificationGroup[] {
  const groups = new Map<string, NotificationGroup>();

  for (const notif of notifs) {
    const groupId = notif.groupId || notif.type;

    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        name: notif.groupId || notif.type,
        notifications: [],
        collapsed: false,
        count: 0
      });
    }

    const group = groups.get(groupId)!;
    group.notifications.push(notif);
    group.count++;
  }

  return Array.from(groups.values());
}

/** Obtenir les stats */
export function getStats(userId?: string): NotificationStats {
  let notifs = userId
    ? notifications.filter(n => n.userId === userId)
    : notifications;

  const stats: NotificationStats = {
    total: notifs.length,
    pending: 0,
    sent: 0,
    read: 0,
    dismissed: 0,
    byType: {} as Record<NotificationType, number>,
    byPriority: {} as Record<NotificationPriority, number>,
    deliveryRate: 0,
    readRate: 0,
    avgTimeToRead: 0
  };

  // Initialiser les compteurs
  const types: NotificationType[] = ['reminder', 'achievement', 'milestone', 'session', 'message', 'alert', 'tip', 'challenge', 'streak', 'social', 'system'];
  const priorities: NotificationPriority[] = ['low', 'normal', 'high', 'urgent'];
  types.forEach(t => stats.byType[t] = 0);
  priorities.forEach(p => stats.byPriority[p] = 0);

  let totalTimeToRead = 0;
  let readCount = 0;

  for (const notif of notifs) {
    // Par statut
    switch (notif.status) {
      case 'pending': stats.pending++; break;
      case 'sent': stats.sent++; break;
      case 'read': stats.read++; break;
      case 'dismissed': stats.dismissed++; break;
    }

    // Par type et priorité
    stats.byType[notif.type]++;
    stats.byPriority[notif.priority]++;

    // Temps de lecture
    if (notif.readAt && notif.sentAt) {
      totalTimeToRead += notif.readAt - notif.sentAt;
      readCount++;
    }
  }

  // Calculs
  const delivered = stats.sent + stats.read + stats.dismissed;
  stats.deliveryRate = stats.total > 0 ? (delivered / stats.total) * 100 : 0;
  stats.readRate = delivered > 0 ? (stats.read / delivered) * 100 : 0;
  stats.avgTimeToRead = readCount > 0 ? totalTimeToRead / readCount : 0;

  return stats;
}

/** S'abonner aux changements */
export function subscribeNotifications(
  listener: (notifications: ExtendedNotification[]) => void
): () => void {
  listeners.push(listener);

  // Charger les notifications si pas encore fait
  if (notifications.length === 0) {
    notifications = loadNotifications();
  }

  listener([...notifications]);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Demander la permission pour les push */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    logger.warn('Notifications not supported', {}, 'NOTIF');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  logger.info('Push permission result', { permission }, 'NOTIF');
  return permission;
}

/** Créer des notifications prédéfinies */
export const createReminderNotification = (
  userId: string,
  title: string,
  body: string,
  scheduledAt?: number
) => createNotification(
  { userId, title, body },
  { type: 'reminder', priority: 'normal', scheduledAt }
);

export const createAchievementNotification = (
  userId: string,
  achievement: string,
  points?: number
) => createNotification(
  { userId, title: 'Nouveau badge !', body: achievement },
  { type: 'achievement', priority: 'high', data: { achievement, points }, sound: 'achievement' }
);

export const createSessionReminderNotification = (
  userId: string,
  sessionType: string,
  scheduledAt: number
) => createNotification(
  { userId, title: 'Session à venir', body: `Votre session ${sessionType} commence bientôt` },
  { type: 'session', priority: 'high', scheduledAt }
);

export const createStreakNotification = (
  userId: string,
  streakDays: number
) => createNotification(
  { userId, title: `${streakDays} jours de suite !`, body: 'Continuez votre série !' },
  { type: 'streak', priority: 'normal', data: { streakDays } }
);

export const createTipNotification = (
  userId: string,
  tip: string
) => createNotification(
  { userId, title: 'Conseil du jour', body: tip },
  { type: 'tip', priority: 'low' }
);

/** Nettoyer les anciennes notifications */
export function cleanupOldNotifications(daysToKeep: number = 30): number {
  const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  const initialCount = notifications.length;

  notifications = notifications.filter(n =>
    n.createdAt >= cutoff || n.status === 'pending' || n.status === 'scheduled'
  );

  const removed = initialCount - notifications.length;
  if (removed > 0) {
    saveNotifications();
    logger.info('Old notifications cleaned up', { removed }, 'NOTIF');
  }

  return removed;
}

/** Exporter les notifications */
export function exportNotifications(userId: string): string {
  const userNotifs = notifications.filter(n => n.userId === userId);
  return JSON.stringify({
    notifications: userNotifs,
    stats: getStats(userId),
    preferences: loadPreferences(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

// Initialiser au chargement
if (typeof window !== 'undefined') {
  notifications = loadNotifications();

  // Replanifier les notifications en attente
  for (const notif of notifications) {
    if (notif.status === 'scheduled' && notif.scheduledAt) {
      scheduleNotification(notif);
    }
  }
}

export default {
  createNotification,
  markNotificationAsRead,
  markMultipleAsRead,
  markAllAsRead,
  dismissNotification,
  deleteNotification,
  getUserNotifications,
  getUnreadCount,
  groupNotifications,
  getStats,
  subscribeNotifications,
  loadPreferences,
  savePreferences,
  requestPushPermission,
  cancelScheduledNotification,
  cleanupOldNotifications,
  exportNotifications,
  createReminderNotification,
  createAchievementNotification,
  createSessionReminderNotification,
  createStreakNotification,
  createTipNotification
};
