
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { emotionPlaylists } from './playlist-data';

// TopMedia API key
const API_KEY = '1e4228c100304c658ab1eab4333f54be';
const API_BASE_URL = 'https://api.topmusicai.com/v1';

/**
 * Get a playlist based on an emotion
 * @param emotion The emotion to get a playlist for (e.g. "happy", "calm", "energetic")
 * @returns A playlist with tracks matching the emotion
 */
export async function getPlaylist(emotion: string): Promise<MusicPlaylist> {
  try {
    // Normalize emotion to lowercase and ensure we have a matching playlist
    const normalizedEmotion = emotion.toLowerCase();
    const availableEmotions = Object.keys(emotionPlaylists);
    
    const targetEmotion = availableEmotions.includes(normalizedEmotion)
      ? normalizedEmotion
      : 'neutral'; // Default to neutral if emotion not found
    
    // First try to fetch from TopMedia API
    try {
      console.log(`Fetching ${targetEmotion} playlist from TopMedia API...`);
      
      const response = await fetch(`${API_BASE_URL}/playlists/emotion/${targetEmotion}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const apiData = await response.json();
      
      // Transform API response to our MusicPlaylist format
      const playlist: MusicPlaylist = {
        id: apiData.id || `playlist-${Date.now()}`,
        name: apiData.name || `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
        emotion: targetEmotion,
        tracks: apiData.tracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration || 180,
          audioUrl: track.audio_url,
          coverUrl: track.cover_url || '',
          emotion: track.mood || targetEmotion
        }))
      };
      
      console.log(`Successfully fetched playlist from API with ${playlist.tracks.length} tracks`);
      return playlist;
    } catch (apiError) {
      console.error('Error fetching from TopMedia API:', apiError);
      console.log('Falling back to static playlist data');
      
      // Fallback to static data if API fails
      const playlist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
        emotion: targetEmotion,
        tracks: emotionPlaylists[targetEmotion]
      };
      
      return playlist;
    }
  } catch (error) {
    console.error('Error in playlist service:', error);
    throw error;
  }
}

