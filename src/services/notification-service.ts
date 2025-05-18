
import { supabase } from '@/lib/supabase-client';
import { Notification, NotificationType } from '@/types/notification';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  icon?: string;
  image?: string;
}

/**
 * Service de gestion des notifications utilisant Supabase
 */
export const notificationService = {
  /**
   * Récupérer les notifications d'un utilisateur
   */
  async getUserNotifications(userId: string): Promise<{ notifications: Notification[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { notifications: data as Notification[], error: null };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], error };
    }
  },
  
  /**
   * Créer une notification pour un utilisateur
   */
  async createNotification(params: CreateNotificationParams): Promise<{ notification: Notification | null; error: Error | null }> {
    try {
      const { userId, type, title, message, actionLink, actionText, metadata, priority, icon, image } = params;
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          action_link: actionLink,
          action_text: actionText,
          metadata,
          priority: priority || 'medium',
          icon,
          image,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { notification: data as Notification, error: null };
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return { notification: null, error };
    }
  },
  
  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Supprimer toutes les notifications lues d'un utilisateur
   */
  async deleteReadNotifications(userId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error deleting read notifications:', error);
      return { success: false, error };
    }
  }
};

export default notificationService;
