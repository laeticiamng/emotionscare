/**
 * Hook pour les notifications du buddy system
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BuddyNotification {
  id: string;
  type: 'new_request' | 'request_accepted' | 'new_message' | 'activity_invite' | 'activity_reminder';
  title: string;
  message: string;
  fromUserId?: string;
  fromUserName?: string;
  matchId?: string;
  activityId?: string;
  read: boolean;
  createdAt: string;
}

export function useBuddyNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<BuddyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les notifications initiales
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Récupérer les demandes en attente
      const { data: requests } = await supabase
        .from('buddy_requests')
        .select('id, from_user_id, message, created_at')
        .eq('to_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      // Récupérer les messages non lus
      const { data: messages } = await supabase
        .from('buddy_messages')
        .select('id, sender_id, content, created_at, match_id')
        .eq('receiver_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      const notifs: BuddyNotification[] = [];

      // Convertir les demandes en notifications
      (requests || []).forEach(req => {
        notifs.push({
          id: `req-${req.id}`,
          type: 'new_request',
          title: 'Nouvelle demande de buddy',
          message: req.message || 'Quelqu\'un veut devenir votre buddy !',
          fromUserId: req.from_user_id,
          read: false,
          createdAt: req.created_at
        });
      });

      // Convertir les messages en notifications
      (messages || []).forEach(msg => {
        notifs.push({
          id: `msg-${msg.id}`,
          type: 'new_message',
          title: 'Nouveau message',
          message: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
          fromUserId: msg.sender_id,
          matchId: msg.match_id,
          read: false,
          createdAt: msg.created_at
        });
      });

      // Trier par date
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error loading buddy notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('buddy-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buddy_requests',
          filter: `to_user_id=eq.${user.id}`
        },
        (_payload) => {
          toast.info('Nouvelle demande de buddy ! 💝');
          loadNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buddy_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (_payload) => {
          toast.info('Nouveau message de votre buddy ! 💬');
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notif = notifications.find(n => n.id === notificationId);
      return notif && !notif.read ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification
  };
}
