
import { supabase } from '@/integrations/supabase/client';

// TopMedia AI API configuration
const API_KEY = '1e4228c100304c658ab1eab4333f54be';
const API_BASE_URL = 'https://api.topmusicai.com/v1';
const API_BASE_URL_V2 = 'https://api.topmusicai.com/v2';

/**
 * Generate lyrics based on a theme or mood
 */
export async function generateLyrics(prompt: string): Promise<string> {
  try {
    console.log(`Generating lyrics with prompt: ${prompt}`);
    
    const response = await fetch(`${API_BASE_URL}/lyrics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
    console.error('Error generating lyrics:', error);
    throw error;
  }
}

/**
 * Generate music based on parameters
 * @param params Generation parameters
 */
export async function generateMusic(params: {
  is_auto: number;
  prompt: string;
  lyrics?: string;
  title: string;
  instrumental: number;
}): Promise<{ song_id: string }> {
  try {
    console.log(`Generating music with parameters:`, params);
    
    const response = await fetch(`${API_BASE_URL}/music`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
    console.error('Error generating music:', error);
    throw error;
  }
}

/**
 * Submit a music generation task with advanced parameters
 */
export async function submitMusicGenerationTask(params: {
  is_auto: number;
  prompt: string;
  lyrics?: string;
  title: string;
  instrumental: number;
  model_version?: string;
  continue_at?: number;
  continue_song_id?: string;
}): Promise<{ song_id: string; task_id: string }> {
  try {
    console.log(`Submitting advanced music generation task:`, params);
    
    const response = await fetch(`${API_BASE_URL_V2}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
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
    console.error('Error submitting music generation task:', error);
    throw error;
  }
}

/**
 * Check the status of a music generation task
 */
export async function checkGenerationStatus(songId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
  progress?: number;
}> {
  try {
    console.log(`Checking status for song_id: ${songId}`);
    
    const response = await fetch(`${API_BASE_URL_V2}/query?song_id=${songId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
    console.error('Error checking generation status:', error);
    throw error;
  }
}

/**
 * Combine multiple music pieces into one
 */
export async function concatenateSongs(songIds: string[]): Promise<{ 
  combined_id: string;
  status: string;
}> {
  try {
    console.log(`Combining songs: ${songIds.join(', ')}`);
    
    const response = await fetch(`${API_BASE_URL_V2}/concat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
    console.error('Error concatenating songs:', error);
    throw error;
  }
}

// Types for user music creations
export interface MusicCreation {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  lyrics?: string;
  audioUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  instrumental: boolean;
}

/**
 * Save a new music creation to user's library
 */
export async function saveUserMusicCreation(creation: Omit<MusicCreation, 'createdAt'>): Promise<MusicCreation> {
  try {
    // In a real implementation, this would save to Supabase
    // For now, we'll simulate saving by returning the object with a timestamp
    const newCreation: MusicCreation = {
      ...creation,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saved user music creation:', newCreation);
    return newCreation;
  } catch (error) {
    console.error('Error saving user music creation:', error);
    throw error;
  }
}

/**
 * Get all music creations for a user
 */
export async function getUserMusicCreations(userId: string): Promise<MusicCreation[]> {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, we'll return a mock array
    return [
      {
        id: 'mock-1',
        userId,
        title: 'Mon premier morceau relaxant',
        prompt: 'musique relaxante avec sons de nature',
        lyrics: undefined,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6435fe5.mp3',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        instrumental: true
      },
      {
        id: 'mock-2',
        userId,
        title: 'Méditation guidée',
        prompt: 'musique ambient pour méditation profonde',
        lyrics: 'Respirez profondément...',
        audioUrl: 'https://cdn.pixabay.com/audio/2021/08/09/audio_dc39bede44.mp3',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        instrumental: false
      }
    ];
  } catch (error) {
    console.error('Error fetching user music creations:', error);
    throw error;
  }
}
