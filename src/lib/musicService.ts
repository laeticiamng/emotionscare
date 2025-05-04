
import { supabase } from '@/integrations/supabase/client';

// Define types for music tracks and playlists
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion: string;
  tracks: Track[];
}

// TopMedia API key
const API_KEY = '1e4228c100304c658ab1eab4333f54be';

/**
 * Get a playlist based on an emotion
 * @param emotion The emotion to get a playlist for (e.g. "happy", "calm", "energetic")
 * @returns A playlist with tracks matching the emotion
 */
export async function getPlaylist(emotion: string): Promise<Playlist> {
  try {
    // For now, we'll mock this with static data since we're just setting up the UI
    // In a real implementation, this would call the TopMedia API
    
    // Sample playlists based on emotions
    const playlists: Record<string, Track[]> = {
      happy: [
        { id: '1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: 238, audioUrl: 'https://example.com/audio1.mp3', coverUrl: 'https://example.com/cover1.jpg' },
        { id: '2', title: 'Good Vibrations', artist: 'The Beach Boys', duration: 218, audioUrl: 'https://example.com/audio2.mp3', coverUrl: 'https://example.com/cover2.jpg' },
        { id: '3', title: 'Happy', artist: 'Pharrell Williams', duration: 232, audioUrl: 'https://example.com/audio3.mp3', coverUrl: 'https://example.com/cover3.jpg' },
        { id: '4', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', duration: 236, audioUrl: 'https://example.com/audio4.mp3', coverUrl: 'https://example.com/cover4.jpg' },
        { id: '5', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: 270, audioUrl: 'https://example.com/audio5.mp3', coverUrl: 'https://example.com/cover5.jpg' },
      ],
      calm: [
        { id: '6', title: 'Weightless', artist: 'Marconi Union', duration: 480, audioUrl: 'https://example.com/audio6.mp3', coverUrl: 'https://example.com/cover6.jpg' },
        { id: '7', title: 'Clair de Lune', artist: 'Claude Debussy', duration: 300, audioUrl: 'https://example.com/audio7.mp3', coverUrl: 'https://example.com/cover7.jpg' },
        { id: '8', title: 'Sleeping At Last', artist: 'Saturn', duration: 325, audioUrl: 'https://example.com/audio8.mp3', coverUrl: 'https://example.com/cover8.jpg' },
        { id: '9', title: 'Experience', artist: 'Ludovico Einaudi', duration: 315, audioUrl: 'https://example.com/audio9.mp3', coverUrl: 'https://example.com/cover9.jpg' },
        { id: '10', title: 'Gymnopédie No. 1', artist: 'Erik Satie', duration: 200, audioUrl: 'https://example.com/audio10.mp3', coverUrl: 'https://example.com/cover10.jpg' },
      ],
      focused: [
        { id: '11', title: 'Time', artist: 'Hans Zimmer', duration: 275, audioUrl: 'https://example.com/audio11.mp3', coverUrl: 'https://example.com/cover11.jpg' },
        { id: '12', title: 'Experience', artist: 'Ludovico Einaudi', duration: 315, audioUrl: 'https://example.com/audio12.mp3', coverUrl: 'https://example.com/cover12.jpg' },
        { id: '13', title: 'Divenire', artist: 'Ludovico Einaudi', duration: 385, audioUrl: 'https://example.com/audio13.mp3', coverUrl: 'https://example.com/cover13.jpg' },
        { id: '14', title: 'Strobe', artist: 'deadmau5', duration: 421, audioUrl: 'https://example.com/audio14.mp3', coverUrl: 'https://example.com/cover14.jpg' },
        { id: '15', title: 'November', artist: 'Max Richter', duration: 318, audioUrl: 'https://example.com/audio15.mp3', coverUrl: 'https://example.com/cover15.jpg' },
      ],
      stressed: [
        { id: '16', title: 'Breathe Me', artist: 'Sia', duration: 272, audioUrl: 'https://example.com/audio16.mp3', coverUrl: 'https://example.com/cover16.jpg' },
        { id: '17', title: 'Weightless', artist: 'Marconi Union', duration: 480, audioUrl: 'https://example.com/audio17.mp3', coverUrl: 'https://example.com/cover17.jpg' },
        { id: '18', title: 'Adagio for Strings', artist: 'Samuel Barber', duration: 489, audioUrl: 'https://example.com/audio18.mp3', coverUrl: 'https://example.com/cover18.jpg' },
        { id: '19', title: 'Bloom', artist: 'Odesza', duration: 245, audioUrl: 'https://example.com/audio19.mp3', coverUrl: 'https://example.com/cover19.jpg' },
        { id: '20', title: 'Sea of Voices', artist: 'Porter Robinson', duration: 402, audioUrl: 'https://example.com/audio20.mp3', coverUrl: 'https://example.com/cover20.jpg' },
      ],
      neutral: [
        { id: '21', title: 'Comptine d\'un autre été', artist: 'Yann Tiersen', duration: 124, audioUrl: 'https://example.com/audio21.mp3', coverUrl: 'https://example.com/cover21.jpg' },
        { id: '22', title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra', duration: 320, audioUrl: 'https://example.com/audio22.mp3', coverUrl: 'https://example.com/cover22.jpg' },
        { id: '23', title: 'River Flows In You', artist: 'Yiruma', duration: 185, audioUrl: 'https://example.com/audio23.mp3', coverUrl: 'https://example.com/cover23.jpg' },
        { id: '24', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', duration: 355, audioUrl: 'https://example.com/audio24.mp3', coverUrl: 'https://example.com/cover24.jpg' },
        { id: '25', title: 'Intro', artist: 'The xx', duration: 128, audioUrl: 'https://example.com/audio25.mp3', coverUrl: 'https://example.com/cover25.jpg' },
      ]
    };

    // Normalize emotion to lowercase and ensure we have a matching playlist
    const normalizedEmotion = emotion.toLowerCase();
    const availableEmotions = Object.keys(playlists);
    
    const targetEmotion = availableEmotions.includes(normalizedEmotion)
      ? normalizedEmotion
      : 'neutral'; // Default to neutral if emotion not found
    
    // Create a playlist
    const playlist: Playlist = {
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
export async function getUserListeningHistory(userId: string): Promise<Track[]> {
  try {
    // In a real implementation, this would query the database
    return [];
  } catch (error) {
    console.error('Error fetching user listening history:', error);
    throw error;
  }
}
