// @ts-nocheck
/**
 * Hook pour les notifications B2B
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import type { B2BNotification } from '@/features/b2b/types';

export interface B2BNotificationsData {
  notifications: B2BNotification[];
  unreadCount: number;
  hasNew: boolean;
}

const DEFAULT_DATA: B2BNotificationsData = {
  notifications: [],
  unreadCount: 0,
  hasNew: false,
};

async function fetchNotifications(orgId: string, userId: string): Promise<B2BNotificationsData> {
  try {
    const { data, error } = await supabase
      .from('b2b_notifications')
      .select('*')
      .eq('org_id', orgId)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.warn('Notifications fetch error', error.message);
      return DEFAULT_DATA;
    }

    const notifications: B2BNotification[] = (data || []).map(n => ({
      id: n.id,
      orgId: n.org_id,
      type: n.type || 'system',
      title: n.title,
      message: n.message,
      read: n.read ?? false,
      priority: n.priority || 'medium',
      link: n.link,
      createdAt: n.created_at,
    }));

    const unreadCount = notifications.filter(n => !n.read).length;
    const hasNew = notifications.some(n => {
      const createdAt = new Date(n.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return createdAt > fiveMinutesAgo && !n.read;
    });

    return { notifications, unreadCount, hasNew };
  } catch (error) {
    logger.error('Error fetching notifications', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

export function useB2BNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = user?.user_metadata?.org_id as string | undefined;
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['b2b-notifications', orgId, userId],
    queryFn: () => fetchNotifications(orgId!, userId!),
    enabled: !!orgId && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000, // Poll every minute
    refetchOnWindowFocus: true,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('b2b_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-notifications'] });
    },
    onError: (error) => {
      logger.error('Mark read error', error as Error, 'B2B');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!orgId || !userId) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('b2b_notifications')
        .update({ read: true })
        .eq('org_id', orgId)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-notifications'] });
      toast({ title: 'Notifications marquées comme lues' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible de marquer les notifications', variant: 'destructive' });
      logger.error('Mark all read error', error as Error, 'B2B');
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('b2b_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-notifications'] });
    },
    onError: (error) => {
      logger.error('Dismiss notification error', error as Error, 'B2B');
    },
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    dismiss: dismissMutation.mutate,
    isUpdating: markReadMutation.isPending || markAllReadMutation.isPending,
  };
}
