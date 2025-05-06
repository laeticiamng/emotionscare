
import { CoachNotification } from './types';

class NotificationService {
  private notifications: Map<string, CoachNotification[]> = new Map();
  private listeners: Map<string, ((count: number) => void)[]> = new Map();

  /**
   * Add a notification for a user
   */
  addNotification(userId: string, notification: Omit<CoachNotification, 'user_id'>): void {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    const notifications = this.notifications.get(userId);
    if (notifications) {
      const notificationWithUserId = {
        ...notification,
        user_id: userId
      } as CoachNotification;
      
      notifications.push(notificationWithUserId);
      
      // Notify listeners
      this.notifyListeners(userId);
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
      
      // Notify listeners
      this.notifyListeners(userId);
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
      
      // Notify listeners
      this.notifyListeners(userId);
    }
  }
  
  /**
   * Subscribe to unread count changes
   */
  subscribeToUnreadCount(userId: string, callback: (count: number) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, []);
    }
    
    const userListeners = this.listeners.get(userId)!;
    userListeners.push(callback);
    
    // Initial notification
    callback(this.getUnreadCount(userId));
    
    // Return unsubscribe function
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        const index = userListeners.indexOf(callback);
        if (index >= 0) {
          userListeners.splice(index, 1);
        }
      }
    };
  }
  
  /**
   * Notify all listeners for a user
   */
  private notifyListeners(userId: string): void {
    const userListeners = this.listeners.get(userId);
    if (!userListeners) return;
    
    const count = this.getUnreadCount(userId);
    userListeners.forEach(listener => listener(count));
  }
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead(userId: string): void {
    const notifications = this.notifications.get(userId);
    if (!notifications) return;
    
    notifications.forEach(notification => {
      notification.read = true;
    });
    
    // Notify listeners
    this.notifyListeners(userId);
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();
