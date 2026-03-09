import { supabase } from '@/integrations/supabase/client';
import { NotificationSettings, NotificationCategory } from '@/types/notification';
import { logger } from '@/lib/logger';

function toError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

/**
 * Service for managing notifications using Supabase
 */
export const notificationService = {
  async getUserNotifications(userId: string): Promise<{ notifications: NotificationSettings[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { notifications: data || [], error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error fetching notifications', err, 'SYSTEM');
      return { notifications: [], error: err };
    }
  },

  async createNotification(notification: Omit<NotificationSettings, 'id' | 'created_at'>): Promise<{ notification: NotificationSettings | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();
      if (error) throw error;
      return { notification: data, error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error creating notification', err, 'SYSTEM');
      return { notification: null, error: err };
    }
  },

  async markAsRead(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error marking notification as read', err, 'SYSTEM');
      return { success: false, error: err };
    }
  },

  async markAllAsRead(userId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error marking all notifications as read', err, 'SYSTEM');
      return { success: false, error: err };
    }
  },

  async deleteNotification(notificationId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error deleting notification', err, 'SYSTEM');
      return { success: false, error: err };
    }
  },

  async getUnreadCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error getting unread count', err, 'SYSTEM');
      return { count: 0, error: err };
    }
  },

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

      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter === 'read') {
        query = query.eq('read', true);
      } else if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { notifications: data || [], error: null, total: count || 0 };
    } catch (error: unknown) {
      const err = toError(error);
      logger.error('Error fetching filtered notifications', err, 'SYSTEM');
      return { notifications: [], error: err, total: 0 };
    }
  }
};

export default notificationService;
