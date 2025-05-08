
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';

// Enregistre la piste en cours d'écoute pour un utilisateur
export const saveUserCurrentTrack = async (userId: string, track: MusicTrack): Promise<void> => {
  try {
    // Simulation d'un appel API
    console.log(`Enregistrement de la piste pour l'utilisateur ${userId}:`, track.title);
    
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
    console.error('Error saving user current track:', error);
  }
};

// Récupère l'historique d'écoute d'un utilisateur
export const getUserListeningHistory = async (userId: string): Promise<MusicTrack[]> => {
  try {
    console.log(`Récupération de l'historique d'écoute pour l'utilisateur: ${userId}`);
    
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
    console.error('Error fetching user listening history:', error);
    return [];
  }
};
