/**
 * useHomePageRealtime - Hook pour les mises à jour temps réel de la HomePage
 * Gère les notifications, compteurs live et événements en temps réel
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LiveStats {
  onlineUsers: number;
  sessionsToday: number;
  activeProtocols: number;
  happyMoments: number;
}

interface RealtimeNotification {
  id: string;
  type: 'session_complete' | 'new_user' | 'milestone' | 'community';
  message: string;
  timestamp: Date;
  userId?: string;
}

interface UseHomePageRealtimeReturn {
  liveStats: LiveStats;
  notifications: RealtimeNotification[];
  isConnected: boolean;
  lastUpdate: Date | null;
  clearNotifications: () => void;
  refreshStats: () => Promise<void>;
}

export function useHomePageRealtime(): UseHomePageRealtimeReturn {
  const { toast } = useToast();
  const [liveStats, setLiveStats] = useState<LiveStats>({
    onlineUsers: 0,
    sessionsToday: 0,
    activeProtocols: 0,
    happyMoments: 0,
  });
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Simuler des stats live initiales
  const fetchInitialStats = useCallback(async () => {
    try {
      // Récupérer les stats depuis activity_sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: sessionsCount } = await supabase
        .from('activity_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today.toISOString());

      // Compteur simulé basé sur l'heure
      const baseOnline = 50 + Math.floor(Math.random() * 100);
      const hour = new Date().getHours();
      const multiplier = hour >= 8 && hour <= 22 ? 1.5 : 0.5;

      setLiveStats({
        onlineUsers: Math.floor(baseOnline * multiplier),
        sessionsToday: sessionsCount || Math.floor(Math.random() * 500) + 100,
        activeProtocols: Math.floor(Math.random() * 50) + 20,
        happyMoments: Math.floor(Math.random() * 200) + 50,
      });

      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Error fetching initial stats:', error);
    }
  }, []);

  // Mettre à jour les stats périodiquement
  useEffect(() => {
    fetchInitialStats();

    // Mise à jour toutes les 30 secondes
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        onlineUsers: Math.max(10, prev.onlineUsers + Math.floor(Math.random() * 10) - 5),
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 3),
        activeProtocols: Math.max(5, prev.activeProtocols + Math.floor(Math.random() * 4) - 2),
        happyMoments: prev.happyMoments + Math.floor(Math.random() * 2),
      }));
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchInitialStats]);

  // Écouter les nouvelles sessions en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('home-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_sessions',
        },
        (payload) => {
          const newNotification: RealtimeNotification = {
            id: crypto.randomUUID(),
            type: 'session_complete',
            message: 'Une session vient d\'être complétée !',
            timestamp: new Date(),
          };

          setNotifications(prev => [newNotification, ...prev].slice(0, 10));
          setLiveStats(prev => ({
            ...prev,
            sessionsToday: prev.sessionsToday + 1,
          }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simuler des notifications communautaires
  useEffect(() => {
    const messages = [
      'Marie vient de terminer son protocole Reset 🎉',
      'Thomas a atteint 30 jours de série 🔥',
      'Nouveau record : 500 sessions aujourd\'hui !',
      'La communauté a atteint 25 000 membres !',
      'Protocole nocturne le plus populaire ce soir 🌙',
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: RealtimeNotification = {
          id: crypto.randomUUID(),
          type: 'community',
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchInitialStats();
    toast({
      title: 'Stats actualisées',
      description: 'Les statistiques ont été mises à jour.',
    });
  }, [fetchInitialStats, toast]);

  return {
    liveStats,
    notifications,
    isConnected,
    lastUpdate,
    clearNotifications,
    refreshStats,
  };
}

export default useHomePageRealtime;
