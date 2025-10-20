// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { NotificationSettings, NotificationCategory } from '@/types/notification';
import { logger } from '@/lib/logger';

/**
 * Service for managing notifications using Supabase
 */
export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  async getUserNotifications(userId: string): Promise<{ notifications: NotificationSettings[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return { notifications: data || [], error: null };
    } catch (error: any) {
      logger.error('Error fetching notifications', error as Error, 'SYSTEM');
      return { notifications: [], error };
    }
  },
  
  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<NotificationSettings, 'id' | 'created_at'>): Promise<{ notification: NotificationSettings | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();
        
      if (error) throw error;
      
      return { notification: data, error: null };
    } catch (error: any) {
      logger.error('Error creating notification', error as Error, 'SYSTEM');
      return { notification: null, error };
    }
  },
  
  /**
   * Mark a notification as read
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
      logger.error('Error marking notification as read', error as Error, 'SYSTEM');
      return { success: false, error };
    }
  },
  
  /**
   * Mark all notifications as read for a user
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
      logger.error('Error marking all notifications as read', error as Error, 'SYSTEM');
      return { success: false, error };
    }
  },
  
  /**
   * Delete a notification
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
      logger.error('Error deleting notification', error as Error, 'SYSTEM');
      return { success: false, error };
    }
  },
  
  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
        
      if (error) throw error;
      
      return { count: count || 0, error: null };
    } catch (error: any) {
      logger.error('Error getting unread count', error as Error, 'SYSTEM');
      return { count: 0, error };
    }
  },
  
  /**
   * Get filtered notifications
   */
  async getFilteredNotifications(
    userId: string,
    filter: string = 'all',
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ notifications: NotificationSettings[]; error: Error | null; total: number }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
        
      // Apply filters
      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter === 'read') {
        query = query.eq('read', true);
      } else if (filter !== 'all') {
        // Filter by notification type
        query = query.eq('type', filter);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      return { 
        notifications: data || [], 
        error: null,
        total: count || 0
      };
    } catch (error: any) {
      logger.error('Error fetching filtered notifications', error as Error, 'SYSTEM');
      return { 
        notifications: [], 
        error,
        total: 0
      };
    }
  }
};

export default notificationService;
