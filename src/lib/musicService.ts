import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// TopMedia API key
const API_KEY = '1e4228c100304c658ab1eab4333f54be';

/**
 * Get a playlist based on an emotion
 * @param emotion The emotion to get a playlist for (e.g. "happy", "calm", "energetic")
 * @returns A playlist with tracks matching the emotion
 */
export async function getPlaylist(emotion: string): Promise<MusicPlaylist> {
  try {
    // For now, we'll mock this with static data since we're just setting up the UI
    // In a real implementation, this would call the TopMedia API
    
    // Sample playlists based on emotions - using public domain music for demo
    const playlists: Record<string, MusicTrack[]> = {
      happy: [
        { 
          id: '1', 
          title: 'Walking on Sunshine', 
          artist: 'Katrina & The Waves', 
          duration: 238, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Katrina_and_the_Waves_Walking_on_Sunshine_Single_Cover.jpeg/220px-Katrina_and_the_Waves_Walking_on_Sunshine_Single_Cover.jpeg',
          emotion: 'happy'
        },
        { 
          id: '2', 
          title: 'Good Vibrations', 
          artist: 'The Beach Boys', 
          duration: 218, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Downfall.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Good_vibrations.jpg/220px-Good_vibrations.jpg',
          emotion: 'happy'
        },
      ],
      calm: [
        { 
          id: '6', 
          title: 'Weightless', 
          artist: 'Marconi Union', 
          duration: 480, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Podington_Bear/Solo_Instruments/Podington_Bear_-_Smooth_Piano.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Marconi_Union_-_Weightless_Part_1.jpg',
          emotion: 'calm'
        },
        { 
          id: '7', 
          title: 'Clair de Lune', 
          artist: 'Claude Debussy', 
          duration: 300, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Jared_C._Balogh/Improvisation/Jared_C_Balogh_-_01_-_The_Thought.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg/170px-Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg',
          emotion: 'calm'
        },
      ],
      neutral: [
        { 
          id: '21', 
          title: 'Arrival of the Birds', 
          artist: 'The Cinematic Orchestra', 
          duration: 320, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/The_Cinematic_Orchestra_-_The_Crimson_Wing_-_Mystery_of_the_Flamingos.jpg',
          emotion: 'neutral'
        },
        { 
          id: '22', 
          title: 'River Flows In You', 
          artist: 'Yiruma', 
          duration: 185, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/River_Flows_in_You_album_cover.jpg/220px-River_Flows_in_You_album_cover.jpg',
          emotion: 'neutral'
        },
        { 
          id: '23', 
          title: 'Nuvole Bianche', 
          artist: 'Ludovico Einaudi', 
          duration: 355, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Ludovico_Einaudi_-_Una_Mattina.png',
          emotion: 'neutral'
        },
      ],
      stressed: [
        { 
          id: '16', 
          title: 'Weightless', 
          artist: 'Marconi Union', 
          duration: 480, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Marconi_Union_-_Weightless_Part_1.jpg',
          emotion: 'stressed'
        },
      ],
      focused: [
        { 
          id: '11', 
          title: 'Time', 
          artist: 'Hans Zimmer', 
          duration: 275, 
          audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3', 
          coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_OST.jpg',
          emotion: 'focused'
        },
      ],
    };

    // Normalize emotion to lowercase and ensure we have a matching playlist
    const normalizedEmotion = emotion.toLowerCase();
    const availableEmotions = Object.keys(playlists);
    
    const targetEmotion = availableEmotions.includes(normalizedEmotion)
      ? normalizedEmotion
      : 'neutral'; // Default to neutral if emotion not found
    
    // Create a playlist
    const playlist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name: `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
      emotion: targetEmotion,
      tracks: playlists[targetEmotion]
    };
    
    return playlist;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
}

/**
 * Save a user's current track to the database
 * @param userId The ID of the user
 * @param trackId The ID of the track
 */
export async function saveUserCurrentTrack(userId: string, trackId: string): Promise<void> {
  try {
    // In a real implementation, this would save to the database
    console.log(`Saving track ${trackId} for user ${userId}`);
  } catch (error) {
    console.error('Error saving user track:', error);
    throw error;
  }
}

/**
 * Get a user's listening history
 * @param userId The ID of the user
 */
export async function getUserListeningHistory(userId: string): Promise<MusicTrack[]> {
  try {
    // In a real implementation, this would query the database
    return [];
  } catch (error) {
    console.error('Error fetching user listening history:', error);
    throw error;
  }
}

// Define the interfaces needed for the music service here
// These will be used internally by the service
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}

// Helper function to convert between MusicTrack and Track
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration,
    url: musicTrack.audioUrl,
    cover: musicTrack.coverUrl,
  };
};

// Helper function to convert between Track and MusicTrack
export const convertTrackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    audioUrl: track.url,
    coverUrl: track.cover || '',
  };
};
