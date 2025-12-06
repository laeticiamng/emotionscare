
// Notification Service implementation
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'reminder' | 'wellness' | 'tip' | 'recommendation';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  userId?: string;
}

// Simplified notification service
export class NotificationService {
  /**
   * Add a notification to the system
   */
  static async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<string> {
    try {
      // Implement with edge function or mock for development
      const notificationWithDefaults = {
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Using the edge function
      const { data, error } = await supabase.functions.invoke('add-notification', { 
        body: notificationWithDefaults 
      });
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getNotifications(userId?: string): Promise<Notification[]> {
    try {
      // Implement with edge function or mock for development
      const { data, error } = await supabase.functions.invoke('get-notifications', { 
        body: { userId } 
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Get count of unread notifications
   */
  static async getUnreadCount(userId?: string): Promise<number> {
    try {
      // Implement with edge function or mock for development
      const { data, error } = await supabase.functions.invoke('get-unread-count', { 
        body: { userId } 
      });
      
      if (error) throw error;
      return data?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      // Implement with edge function or mock for development
      const { error } = await supabase.functions.invoke('mark-notification-read', { 
        body: { notificationId } 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId?: string): Promise<void> {
    try {
      // Implement with edge function or mock for development
      const { error } = await supabase.functions.invoke('mark-all-notifications-read', { 
        body: { userId } 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  
  /**
   * Subscribe to notification changes
   * Optional method for real-time updates
   */
  static subscribeToNotifications(callback: () => void): (() => void) | undefined {
    // Return unsubscribe function if real-time is implemented
    return () => {};
  }
}
