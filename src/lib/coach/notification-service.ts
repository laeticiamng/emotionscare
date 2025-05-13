
import { supabase } from '@/integrations/supabase/client';
import { CoachNotification } from './types';

/**
 * Service for managing coach notifications
 */
export class NotificationService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  // Add a new notification
  async addNotification(notification: Omit<CoachNotification, 'id'>): Promise<CoachNotification> {
    const id = `notification-${Date.now()}`;
    
    const newNotification: CoachNotification = {
      ...notification,
      id,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false
    };
    
    // In a real implementation, this would save to Supabase
    console.log("Adding notification:", newNotification, "for user:", this.userId);
    
    return newNotification;
  }
  
  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    // In a real implementation, this would update in Supabase
    console.log("Marking notification as read:", notificationId);
    return true;
  }
  
  // Get user's unread notifications
  async getUnreadNotifications(): Promise<CoachNotification[]> {
    if (!this.userId) {
      console.error("No user ID set for notification service");
      return [];
    }
    
    // In a real implementation, this would fetch from Supabase
    return [
      {
        id: "notif-1",
        title: "Rappel d'exercice",
        message: "N'oubliez pas votre exercice de respiration quotidien",
        type: "info",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }
}

const notificationService = new NotificationService();
export default notificationService;

// Helper function to add a notification
export const addNotification = (
  userId: string,
  notification: Omit<CoachNotification, 'id'>
): Promise<CoachNotification> => {
  notificationService.setUserId(userId);
  return notificationService.addNotification(notification);
};
