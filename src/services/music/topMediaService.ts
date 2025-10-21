// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { logger } from '@/lib/logger';

// TopMedia AI API configuration
const API_KEY = '1e4228c100304c658ab1eab4333f54be'; // This should come from environment variables in production
const API_BASE_URL = 'https://api.topmusicai.com/v1';
const API_BASE_URL_V2 = 'https://api.topmusicai.com/v2';

/**
 * Service for interacting with TopMedia AI music generation API
 */
export class TopMediaMusicService {
  /**
   * Generate lyrics based on a theme or mood
   */
  async generateLyrics(prompt: string): Promise<string> {
    try {
      logger.debug(`Generating lyrics with prompt: ${prompt}`, undefined, 'MUSIC');
      
      const response = await fetch(`${API_BASE_URL}/lyrics`, {
        method: 'POST',
        headers: {
          'x-api': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.lyrics || '';
    } catch (error) {
      logger.error('Error generating lyrics', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Generate music based on parameters
   */
  async generateMusic(params: {
    is_auto: number;
    prompt: string;
    lyrics?: string;
    title: string;
    instrumental: number;
  }): Promise<{ song_id: string }> {
    try {
      logger.debug(`Generating music with parameters`, params, 'MUSIC');
      
      const response = await fetch(`${API_BASE_URL}/music`, {
        method: 'POST',
        headers: {
          'x-api': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { song_id: data.song_id || '' };
    } catch (error) {
      logger.error('Error generating music', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Submit a music generation task with advanced parameters (V2 API)
   */
  async submitMusicGenerationTask(params: {
    is_auto: number;
    prompt: string;
    lyrics?: string;
    title: string;
    instrumental: number;
    model_version?: string;
    continue_at?: number;
    continue_song_id?: string;
    mood?: string;
  }): Promise<{ song_id: string; task_id: string }> {
    try {
      logger.debug(`Submitting advanced music generation task`, params, 'MUSIC');
      
      // Add mood to description if available
      const enhancedPrompt = params.mood 
        ? `${params.prompt} avec une ambiance ${params.mood}` 
        : params.prompt;
      
      const requestParams = {
        ...params,
        prompt: enhancedPrompt
      };
      
      const response = await fetch(`${API_BASE_URL_V2}/submit`, {
        method: 'POST',
        headers: {
          'x-api': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestParams)
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        song_id: data.song_id || '',
        task_id: data.task_id || ''
      };
    } catch (error) {
      logger.error('Error submitting music generation task', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Check the status of a music generation task
   */
  async checkGenerationStatus(songId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    url?: string;
    error?: string;
    progress?: number;
  }> {
    try {
      logger.debug(`Checking status for song_id: ${songId}`, undefined, 'MUSIC');
      
      const response = await fetch(`${API_BASE_URL_V2}/query?song_id=${songId}`, {
        method: 'GET',
        headers: {
          'x-api': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        status: data.status || 'pending',
        url: data.url,
        error: data.error,
        progress: data.progress
      };
    } catch (error) {
      logger.error('Error checking generation status', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Combine multiple music pieces into one
   */
  async concatenateSongs(songIds: string[]): Promise<{ 
    combined_id: string;
    status: string;
  }> {
    try {
      logger.debug(`Combining songs`, { songIds: songIds.join(', ') }, 'MUSIC');
      
      const response = await fetch(`${API_BASE_URL_V2}/concat`, {
        method: 'POST',
        headers: {
          'x-api': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song_ids: songIds })
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        combined_id: data.combined_id || '',
        status: data.status || 'pending'
      };
    } catch (error) {
      logger.error('Error concatenating songs', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Convert generated song to a music track object
   */
  convertToMusicTrack(songId: string, title: string, details: any): MusicTrack {
    return {
      id: songId,
      title: title,
      artist: 'TopMedia AI',
      duration: details.duration || 180,
      url: details.url || '',
      coverUrl: details.cover_url || '/images/ai-music-cover.jpg',
      emotion: details.emotion || 'neutral'
    };
  }

  /**
   * Get music generation suggestions based on mood
   */
  getMoodSuggestions(mood: string): {
    title: string;
    prompt: string;
    instrumental: boolean;
    lyrics?: string;
  } {
    // These would ideally come from an API or database
    const suggestions: Record<string, {
      title: string;
      prompt: string;
      instrumental: boolean;
      lyrics?: string;
    }> = {
      happy: {
        title: "Mélodie Joyeuse",
        prompt: "Une chanson pop entraînante avec des accords majeurs, une mélodie positive et des rythmes dynamiques",
        instrumental: false,
        lyrics: "La vie est belle sous le soleil\nChaque jour est une nouvelle chance\nDe sourire et d'être heureux\nEmbrasse le moment présent"
      },
      calm: {
        title: "Tranquillité Sonore",
        prompt: "Une composition ambient avec des nappes de synthé relaxantes, des mélodies douces et une ambiance zen",
        instrumental: true
      },
      focused: {
        title: "Concentration Profonde",
        prompt: "Une musique électronique minimaliste avec des rythmes subtils et des sonorités cristallines propices à la concentration",
        instrumental: true
      },
      energetic: {
        title: "Boost d'Énergie",
        prompt: "Un morceau électronique rythmé avec des percussions énergiques, des montées et des drops dynamiques",
        instrumental: true
      },
      melancholic: {
        title: "Mélancolie Poétique",
        prompt: "Une ballade piano-voix mélancolique avec des harmonies mineurs et une ambiance intime",
        instrumental: false,
        lyrics: "Les souvenirs s'effacent comme des traces dans le sable\nMais ton image reste gravée dans mon cœur\nLe temps passe mais certaines choses demeurent\nComme cette douce mélancolie qui m'habite"
      },
      neutral: {
        title: "Équilibre Sonore",
        prompt: "Une composition équilibrée avec des éléments acoustiques et électroniques, créant une ambiance ni trop énergique ni trop calme",
        instrumental: true
      }
    };

    return suggestions[mood] || suggestions.neutral;
  }

  /**
   * Save music to user's library
   */
  async saveToUserLibrary(userId: string, track: MusicTrack): Promise<boolean> {
    try {
      // Use edge function to save to user library
      const { error } = await supabase.functions.invoke('save-music', {
        body: {
          user_id: userId,
          track_id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          url: track.url,
          cover_url: track.coverUrl,
          emotion: track.emotion
        }
      });
        
      if (error) {
        logger.error('Error saving track to library', error as Error, 'MUSIC');
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Error in saveToUserLibrary', error as Error, 'MUSIC');
      return false;
    }
  }

  /**
   * Get user's music library
   */
  async getUserLibrary(userId: string): Promise<MusicTrack[]> {
    try {
      // Use edge function to get user library
      const { data, error } = await supabase.functions.invoke('get-music-library', {
        body: { user_id: userId }
      });
        
      if (error) {
        logger.error('Error fetching user library', error as Error, 'MUSIC');
        return [];
      }
      
      return (data || []).map((item: any) => ({
        id: item.track_id,
        title: item.title,
        artist: item.artist,
        duration: item.duration,
        url: item.url,
        coverUrl: item.cover_url,
        emotion: item.emotion
      }));
    } catch (error) {
      logger.error('Error in getUserLibrary', error as Error, 'MUSIC');
      return [];
    }
  }
}

export const topMediaMusicService = new TopMediaMusicService();
export default topMediaMusicService;
