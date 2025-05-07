
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { emotionPlaylists } from './playlist-data';

// API configuration
const API_KEY = '1e4228c100304c658ab1eab4333f54be'; // This should be stored securely
const API_BASE_URL = 'https://api.topmusicai.com/v1';
const API_TIMEOUT = 5000; // 5 seconds timeout

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
    
    console.log(`Attempting to fetch ${targetEmotion} playlist`);
    
    // First try to fetch from our local/static data since API is failing
    const staticPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name: `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
      emotion: targetEmotion,
      tracks: emotionPlaylists[targetEmotion] || []
    };

    // If no static data or if we're in development mode, try the API
    if (staticPlaylist.tracks.length === 0 || process.env.NODE_ENV === 'development') {
      try {
        console.log(`Fetching ${targetEmotion} playlist from TopMedia API...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${API_BASE_URL}/playlists/emotion/${targetEmotion}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        
        // Transform API response to our MusicPlaylist format
        if (apiData && apiData.tracks && apiData.tracks.length > 0) {
          const apiPlaylist: MusicPlaylist = {
            id: apiData.id || `playlist-${Date.now()}`,
            name: apiData.name || `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
            emotion: targetEmotion,
            tracks: apiData.tracks.map((track: any) => ({
              id: track.id || `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              title: track.title,
              artist: track.artist,
              duration: track.duration || 180,
              audioUrl: track.audio_url,
              coverUrl: track.cover_url || '',
              emotion: track.mood || targetEmotion
            }))
          };
          
          console.log(`Successfully fetched playlist from API with ${apiPlaylist.tracks.length} tracks`);
          return apiPlaylist;
        }
        
        console.log('API returned empty playlist, using fallback data');
        return staticPlaylist;
      } 
      catch (apiError) {
        console.error('Error fetching from TopMedia API:', apiError);
        console.log('Using static playlist data');
        return staticPlaylist;
      }
    }
    
    return staticPlaylist;
  } catch (error) {
    console.error('Error in playlist service:', error);
    
    // Return a minimal emergency playlist as last resort
    const emergencyPlaylist: MusicPlaylist = {
      id: `emergency-playlist-${Date.now()}`,
      name: `Playlist de secours`,
      emotion: 'neutral',
      tracks: [
        {
          id: 'emergency-track-1',
          title: 'Morceau calme',
          artist: 'Système',
          duration: 180,
          audioUrl: '/audio/emergency-track.mp3',
          coverUrl: '/images/default-cover.jpg',
          emotion: 'neutral'
        }
      ]
    };
    
    return emergencyPlaylist;
  }
}
