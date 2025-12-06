// @ts-nocheck

import { Notification, NotificationType, NotificationPriority } from '@/types/notifications';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';
import { logger } from '@/lib/logger';

class NotificationUiService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private storageKey = 'emotionscare-notifications';

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      logger.error('Error loading notifications', error as Error, 'SYSTEM');
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch (error) {
      logger.error('Error saving notifications', error as Error, 'SYSTEM');
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    listener([...this.notifications]);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Send push notification if allowed
    if (notification.priority === 'high' || notification.priority === 'critical') {
      await this.sendPushNotification(newNotification);
    }

    // Play notification sound
    this.playNotificationSound();

    return newNotification.id;
  }

  private async sendPushNotification(notification: Notification) {
    try {
      await pushNotificationService.showNotification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'critical',
      });
    } catch (error) {
      logger.error('Error sending push notification', error as Error, 'SYSTEM');
    }
  }

  private playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(error => {
        logger.debug('Unable to play notification sound', error, 'UI');
      });
    } catch (error) {
      logger.debug('Notification sound not available', error, 'UI');
    }
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    let hasChanges = false;
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  removeNotification(id: string) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  async sendWelcomeNotification() {
    return this.sendNotification({
      type: 'system',
      priority: 'medium',
      title: 'Bienvenue sur EmotionsCare',
      message: 'Commencez votre parcours de bien-être émotionnel.',
      actionUrl: '/scan',
      actionText: 'Faire un scan'
    });
  }

  async sendAchievementNotification(achievementName: string) {
    return this.sendNotification({
      type: 'achievement',
      priority: 'medium',
      title: 'Nouveau badge débloqué !',
      message: `Félicitations ! Vous avez obtenu le badge "${achievementName}".`,
      actionUrl: '/gamification',
      actionText: 'Voir mes badges'
    });
  }

  async sendReminderNotification(activity: string) {
    return this.sendNotification({
      type: 'reminder',
      priority: 'low',
      title: 'Rappel quotidien',
      message: `Il est temps de faire votre ${activity}.`,
      actionUrl: '/scan',
      actionText: 'Commencer'
    });
  }

  async sendEmotionInsight(insight: string) {
    return this.sendNotification({
      type: 'emotion',
      priority: 'medium',
      title: 'Nouvelle analyse émotionnelle',
      message: insight,
      actionUrl: '/journal',
      actionText: 'Voir détails'
    });
  }
}

export const notificationUiService = new NotificationUiService();
