
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { emotionPlaylists } from './playlist-data';

// API configuration
const API_KEY = '1e4228c100304c658ab1eab4333f54be'; // This should be stored securely
const API_BASE_URL = 'https://api.topmediai.com/v1';
const API_TIMEOUT = 8000; // 8 seconds timeout
const ENABLE_API_CALLS = true; // Toggle to disable API calls during development if needed
const USE_X_API_KEY_HEADER = true; // Use x-api-key header format instead of Bearer

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
    
    // First, prepare the static/local fallback playlist
    const staticPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name: `${targetEmotion.charAt(0).toUpperCase() + targetEmotion.slice(1)} Soundtrack`,
      emotion: targetEmotion,
      tracks: emotionPlaylists[targetEmotion] || []
    };

    // If API calls are disabled or we're in a test environment, return static data immediately
    if (!ENABLE_API_CALLS || process.env.NODE_ENV === 'test') {
      console.log('API calls disabled or test environment, using static data');
      return staticPlaylist;
    }

    // Try the API call with proper error handling
    try {
      console.log(`Fetching ${targetEmotion} playlist from TopMediai API...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      // Prepare headers based on API requirements (x-api-key vs Bearer)
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (USE_X_API_KEY_HEADER) {
        headers['x-api-key'] = API_KEY;
      } else {
        headers['Authorization'] = `Bearer ${API_KEY}`;
      }
      
      // Make the API call to fetch playlists based on emotion
      const response = await fetch(`${API_BASE_URL}/playlists/emotion/${targetEmotion}`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const apiData = await response.json();
      console.log('API response received:', apiData);
      
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
      
      console.log('API returned empty or invalid playlist data, using fallback data');
      return staticPlaylist;
    } 
    catch (apiError) {
      console.error('Error fetching from TopMediai API:', apiError);
      
      // Check for specific network errors that might indicate API configuration issues
      if (apiError.name === 'AbortError') {
        console.log('Request timed out, please check API endpoint and connectivity');
      } else if (apiError.message?.includes('Failed to fetch')) {
        console.log('Network error: API endpoint might be unavailable or CORS issues');
      } else if (apiError.status === 401 || apiError.status === 403) {
        console.log('Authentication error: Please check your API key');
      }
      
      console.log('Using static playlist data as fallback');
      return staticPlaylist;
    }
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

/**
 * Check API key validity and quota information
 * @returns Information about the API key
 */
export async function checkAPIKeyInfo(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_api_key_info`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const apiKeyInfo = await response.json();
    console.log('API key info retrieved successfully:', apiKeyInfo);
    return apiKeyInfo;
  } catch (error) {
    console.error('Error checking API key info:', error);
    throw error;
  }
}
