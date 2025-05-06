
import { CoachNotification } from './types';

class NotificationService {
  private notifications: Map<string, CoachNotification[]> = new Map();

  /**
   * Add a notification for a user
   */
  addNotification(userId: string, notification: Omit<CoachNotification, 'user_id'>): void {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    const notifications = this.notifications.get(userId);
    if (notifications) {
      notifications.push({
        ...notification,
        user_id: userId
      });
    }
  }

  /**
   * Get all notifications for a user
   */
  getNotifications(userId: string): CoachNotification[] {
    return this.notifications.get(userId) || [];
  }

  /**
   * Mark a notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;

    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(userId: string): number {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    return notifications.filter(n => !n.read).length;
  }

  /**
   * Delete a notification
   */
  deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;

    const index = notifications.findIndex(n => n.id === notificationId);
    if (index >= 0) {
      notifications.splice(index, 1);
    }
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();
