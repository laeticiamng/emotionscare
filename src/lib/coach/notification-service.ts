
import { CoachNotification } from './types';

/**
 * Service for managing coach notifications
 */
export class NotificationService {
  // Stockage des notifications (dans une application réelle, cela serait persisté en base de données)
  private notifications: Map<string, CoachNotification[]> = new Map();

  /**
   * Adds a notification for a user
   */
  addNotification(userId: string, notification: CoachNotification): void {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    
    const userNotifications = this.notifications.get(userId)!;
    userNotifications.push(notification);
    
    // Limiter le nombre de notifications stockées
    if (userNotifications.length > 20) {
      userNotifications.shift();
    }
    
    console.log(`[NOTIFICATION for ${userId}] ${notification.message} (${notification.type})`);
  }
  
  /**
   * Gets notifications for a user
   */
  getNotifications(userId: string): CoachNotification[] {
    return this.notifications.get(userId) || [];
  }
}

export const notificationService = new NotificationService();
