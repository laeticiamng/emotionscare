
import { CoachNotification } from './types';

export class NotificationService {
  private notifications: CoachNotification[] = [];
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
    this.loadNotifications();
  }
  
  setUserId(userId: string) {
    this.userId = userId;
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
  
  async markAllAsRead(): Promise<boolean> {
    this.notifications.forEach(notif => {
      notif.read = true;
    });
    
    return true;
  }
  
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
