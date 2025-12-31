/**
 * Hook pour gérer la présence en temps réel des buddies
 * Utilise Supabase Realtime Presence
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface BuddyPresence {
  odaL: string;
  display_name: string;
  avatar_url?: string;
  online_at: string;
  status: 'online' | 'away' | 'busy';
  current_activity?: string;
}

interface PresenceState {
  [key: string]: BuddyPresence[];
}

export function useBuddyPresence(buddyIds: string[] = []) {
  const { user } = useAuth();
  const [onlineBuddies, setOnlineBuddies] = useState<Map<string, BuddyPresence>>(new Map());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialiser la connexion presence
  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase.channel('buddy-presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Écouter les événements de présence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as PresenceState;
        const buddiesMap = new Map<string, BuddyPresence>();
        
        Object.entries(state).forEach(([key, presences]) => {
          if (presences.length > 0 && key !== user.id) {
            // Filtrer par buddyIds si fourni
            if (buddyIds.length === 0 || buddyIds.includes(key)) {
              buddiesMap.set(key, presences[0]);
            }
          }
        });
        
        setOnlineBuddies(buddiesMap);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key !== user.id && (buddyIds.length === 0 || buddyIds.includes(key))) {
          setOnlineBuddies(prev => {
            const updated = new Map(prev);
        if (newPresences.length > 0) {
              const presence = newPresences[0] as unknown as BuddyPresence;
              updated.set(key, presence);
            }
            return updated;
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== user.id) {
          setOnlineBuddies(prev => {
            const updated = new Map(prev);
            updated.delete(key);
            return updated;
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Tracker notre présence
          await presenceChannel.track({
            odaL: user.id,
            display_name: user.user_metadata?.display_name || 'Buddy',
            avatar_url: user.user_metadata?.avatar_url,
            online_at: new Date().toISOString(),
            status: 'online' as const
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [user, buddyIds.join(',')]);

  // Mettre à jour le statut
  const updateStatus = useCallback(async (status: 'online' | 'away' | 'busy', activity?: string) => {
    if (!channel || !user) return;

    await channel.track({
      odaL: user.id,
      display_name: user.user_metadata?.display_name || 'Buddy',
      avatar_url: user.user_metadata?.avatar_url,
      online_at: new Date().toISOString(),
      status,
      current_activity: activity
    });
  }, [channel, user]);

  // Vérifier si un buddy spécifique est en ligne
  const isBuddyOnline = useCallback((buddyId: string) => {
    return onlineBuddies.has(buddyId);
  }, [onlineBuddies]);

  // Obtenir le statut d'un buddy
  const getBuddyStatus = useCallback((buddyId: string) => {
    return onlineBuddies.get(buddyId);
  }, [onlineBuddies]);

  return {
    onlineBuddies: Array.from(onlineBuddies.values()),
    onlineBuddiesMap: onlineBuddies,
    onlineCount: onlineBuddies.size,
    isConnected,
    updateStatus,
    isBuddyOnline,
    getBuddyStatus
  };
}
