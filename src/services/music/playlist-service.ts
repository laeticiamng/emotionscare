
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { emotionPlaylists } from './playlist-data';

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
    
    // Normalize emotion to lowercase and ensure we have a matching playlist
    const normalizedEmotion = emotion.toLowerCase();
    const availableEmotions = Object.keys(emotionPlaylists);
    
    const targetEmotion = availableEmotions.includes(normalizedEmotion)
      ? normalizedEmotion
      : 'neutral'; // Default to neutral if emotion not found
    
    // Create a playlist
    const playlist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name: `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
      emotion: targetEmotion,
      tracks: emotionPlaylists[targetEmotion]
    };
    
    return playlist;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
}
