// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

// Enregistre la piste en cours d'écoute pour un utilisateur
export const saveUserCurrentTrack = async (userId: string, track: MusicTrack): Promise<void> => {
  try {
    // Simulation d'un appel API
    logger.info('Enregistrement de la piste', { userId, trackTitle: track.title }, 'MUSIC');
    
    // Dans une implémentation réelle, on ferait:
    // const { data, error } = await supabase
    //   .from('user_listening_history')
    //   .insert({
    //     user_id: userId,
    //     track_id: track.id,
    //     timestamp: new Date()
    //   });
    
    // if (error) throw error;
  } catch (error) {
    logger.error('Error saving user current track', error as Error, 'MUSIC');
  }
};

// Récupère l'historique d'écoute d'un utilisateur
export const getUserListeningHistory = async (userId: string): Promise<MusicTrack[]> => {
  try {
    logger.info('Récupération de l\'historique d\'écoute', { userId }, 'MUSIC');
    
    // Simulation, dans un cas réel on utiliserait Supabase
    return [
      {
        id: 'track-1',
        title: 'Morning Meditation',
        artist: 'Zen Masters',
        duration: 240,
        audioUrl: 'https://example.com/track1.mp3',
        url: 'https://example.com/track1.mp3',
        coverUrl: 'https://example.com/cover1.jpg'
      },
      {
        id: 'track-2',
        title: 'Evening Relaxation',
        artist: 'Sleep Well',
        duration: 300,
        audioUrl: 'https://example.com/track2.mp3',
        url: 'https://example.com/track2.mp3',
        coverUrl: 'https://example.com/cover2.jpg'
      }
    ];
  } catch (error) {
    logger.error('Error fetching user listening history', error as Error, 'MUSIC');
    return [];
  }
};
