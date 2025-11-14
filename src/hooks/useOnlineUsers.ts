/**
 * Hook pour suivre le nombre d'utilisateurs en ligne en temps réel
 * Utilise Supabase Realtime Presence
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface UserPresence {
  user_id: string;
  online_at: string;
}

export function useOnlineUsers() {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  useEffect(() => {
    // Canal pour la présence des utilisateurs
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user?.id || 'anonymous'
        }
      }
    });

    // Écouter les événements de sync pour compter les utilisateurs
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<UserPresence>();
        const count = Object.keys(state).length;
        setOnlineCount(count);
        logger.debug('Online users synced', { count }, 'REALTIME');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        logger.debug('User joined', { key, count: newPresences.length }, 'REALTIME');
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        logger.debug('User left', { key, count: leftPresences.length }, 'REALTIME');
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Enregistrer la présence de l'utilisateur actuel
          const presenceData: UserPresence = {
            user_id: user?.id || 'anonymous',
            online_at: new Date().toISOString()
          };

          const trackStatus = await channel.track(presenceData);
          setIsTracking(trackStatus === 'ok');
          
          if (trackStatus === 'ok') {
            logger.debug('User presence tracked', presenceData, 'REALTIME');
          } else {
            logger.warn('Failed to track user presence', { status: trackStatus }, 'REALTIME');
          }
        }
      });

    // Mettre à jour la présence toutes les 30 secondes pour maintenir la connexion
    const heartbeatInterval = setInterval(async () => {
      if (isTracking) {
        await channel.track({
          user_id: user?.id || 'anonymous',
          online_at: new Date().toISOString()
        });
      }
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      channel.untrack();
      supabase.removeChannel(channel);
      logger.debug('User presence untracked', {}, 'REALTIME');
    };
  }, [user?.id]);

  return {
    onlineCount,
    isTracking
  };
}
