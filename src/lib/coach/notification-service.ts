
import { CoachNotification } from './types';

export class NotificationService {
  private notifications: CoachNotification[] = [];
  private subscribers: Map<string, Function[]> = new Map();
  
  constructor() {
    this.loadNotifications();
  }
  
  private loadNotifications() {
    // In a real app, this would load from local storage or backend
    this.notifications = [];
  }
  
  async getNotifications(): Promise<CoachNotification[]> {
    return [...this.notifications];
  }
  
  async addNotification(userId: string, notification: Omit<CoachNotification, 'id' | 'timestamp' | 'read'>): Promise<CoachNotification> {
    const newNotification: CoachNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    this.notifications.unshift(newNotification);
    
    // Limit to 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    // Notify subscribers
    this.notifySubscribers(userId);
    
    // In a real app, save to backend or local storage
    return newNotification;
  }
  
  async markAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      return true;
    }
    
    return false;
  }
  
  async markAllAsRead(userId?: string): Promise<boolean> {
    this.notifications.forEach(notif => {
      notif.read = true;
    });
    
    // Notify subscribers if userId is provided
    if (userId) {
      this.notifySubscribers(userId);
    }
    
    return true;
  }
  
  getUnreadCount(userId?: string): number {
    return this.notifications.filter(n => !n.read).length;
  }
  
  // Add subscription functionality
  subscribeToNotifications(userId: string, callback: Function): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, []);
    }
    
    this.subscribers.get(userId)?.push(callback);
    
    // Return unsubscribe function
    return () => {
      const userSubscribers = this.subscribers.get(userId) || [];
      const index = userSubscribers.indexOf(callback);
      if (index !== -1) {
        userSubscribers.splice(index, 1);
      }
    };
  }
  
  private notifySubscribers(userId: string): void {
    const callbacks = this.subscribers.get(userId) || [];
    callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in notification subscriber callback:', error);
      }
    });
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
