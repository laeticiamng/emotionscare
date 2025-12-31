// @ts-nocheck
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MoodMixerNotification {
  id: string;
  type: 'session_reminder' | 'streak_warning' | 'achievement' | 'tip';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UseMoodMixerRealtimeReturn {
  notifications: MoodMixerNotification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const TIPS = [
  "Essayez le preset 'Focus' avant une tâche importante",
  "Une session de 5 minutes peut transformer votre journée",
  "Combinez 'Calme' élevé avec 'Focus' pour la méditation",
  "Exportez vos presets préférés pour les partager",
  "Le matin, privilégiez un mix énergisant",
];

export function useMoodMixerRealtime(userId?: string): UseMoodMixerRealtimeReturn {
  const [notifications, setNotifications] = useState<MoodMixerNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize with stored notifications
  useEffect(() => {
    const stored = localStorage.getItem(`mood-mixer-notifications-${userId}`);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, [userId]);

  // Save notifications to localStorage
  useEffect(() => {
    if (userId && notifications.length > 0) {
      localStorage.setItem(
        `mood-mixer-notifications-${userId}`,
        JSON.stringify(notifications.slice(0, 20)) // Keep only last 20
      );
    }
  }, [notifications, userId]);

  // Real-time subscription for session updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`mood-mixer-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_mixer_sessions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // New session created - could trigger achievements check
          console.log('New session detected:', payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Daily tip notification
  useEffect(() => {
    if (!userId) return;

    const lastTipDate = localStorage.getItem(`mood-mixer-last-tip-${userId}`);
    const today = new Date().toISOString().split('T')[0];

    if (lastTipDate !== today) {
      const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
      
      const tipNotification: MoodMixerNotification = {
        id: `tip-${Date.now()}`,
        type: 'tip',
        title: 'Astuce du jour',
        message: randomTip,
        read: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications(prev => [tipNotification, ...prev]);
      localStorage.setItem(`mood-mixer-last-tip-${userId}`, today);
    }
  }, [userId]);

  // Streak warning check
  useEffect(() => {
    if (!userId) return;

    const checkStreak = async () => {
      const { data: sessions } = await supabase
        .from('mood_mixer_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessions && sessions.length > 0) {
        const lastSession = new Date(sessions[0].created_at);
        const now = new Date();
        const hoursSinceLastSession = (now.getTime() - lastSession.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastSession > 20 && hoursSinceLastSession < 24) {
          const existingWarning = notifications.find(
            n => n.type === 'streak_warning' && 
            new Date(n.createdAt).toISOString().split('T')[0] === now.toISOString().split('T')[0]
          );

          if (!existingWarning) {
            const warningNotification: MoodMixerNotification = {
              id: `streak-${Date.now()}`,
              type: 'streak_warning',
              title: 'Protégez votre streak !',
              message: 'Faites une session aujourd\'hui pour maintenir votre série',
              read: false,
              createdAt: new Date().toISOString(),
            };

            setNotifications(prev => [warningNotification, ...prev]);
            toast.info('N\'oubliez pas votre session Mood Mixer !', {
              description: 'Maintenez votre streak actif',
            });
          }
        }
      }
    };

    checkStreak();
  }, [userId, notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (userId) {
      localStorage.removeItem(`mood-mixer-notifications-${userId}`);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
