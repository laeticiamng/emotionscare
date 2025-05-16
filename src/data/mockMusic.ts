
import { MusicPlaylist, MusicTrack } from '@/types/music';

// Helper function to ensure all tracks have required properties
const createTrack = (track: Partial<MusicTrack>): MusicTrack => {
  return {
    id: track.id || `track-${Math.random().toString(36).substr(2, 9)}`,
    title: track.title || 'Unknown Title',
    artist: track.artist || 'Unknown Artist',
    duration: track.duration || 180,
    url: track.url || track.audioUrl || '',
    audioUrl: track.audioUrl || track.url || '',
    coverUrl: track.coverUrl || track.cover_url || 'https://via.placeholder.com/100',
    cover_url: track.cover_url || track.coverUrl || 'https://via.placeholder.com/100'
  };
};

// Sample calm tracks
const calmTracks: MusicTrack[] = [
  createTrack({
    id: 'calm1',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    duration: 240,
    url: 'https://example.com/audio/ocean-waves.mp3',
    coverUrl: 'https://via.placeholder.com/100?text=Ocean',
    emotionalTone: 'calming'
  }),
  createTrack({
    id: 'calm2',
    title: 'Gentle Rain',
    artist: 'Relaxing Sounds',
    duration: 300,
    url: 'https://example.com/audio/gentle-rain.mp3',
    coverUrl: 'https://via.placeholder.com/100?text=Rain',
    emotionalTone: 'peaceful'
  })
];

// Sample happy tracks
const happyTracks: MusicTrack[] = [
  createTrack({
    id: 'happy1',
    title: 'Sunny Day',
    artist: 'Happy Vibes',
    duration: 180,
    url: 'https://example.com/audio/sunny-day.mp3',
    coverUrl: 'https://via.placeholder.com/100?text=Sunny',
    emotionalTone: 'joyful'
  }),
  createTrack({
    id: 'happy2',
    title: 'Good Times',
    artist: 'Positive Energy',
    duration: 210,
    url: 'https://example.com/audio/good-times.mp3',
    coverUrl: 'https://via.placeholder.com/100?text=Good',
    emotionalTone: 'upbeat'
  })
];

// Mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    title: 'Calm & Relaxing',
    coverUrl: 'https://via.placeholder.com/200?text=Calm',
    tracks: calmTracks,
    mood: 'calm',
    category: 'relaxation'
  },
  {
    id: 'playlist-happy',
    title: 'Happy & Uplifting',
    coverUrl: 'https://via.placeholder.com/200?text=Happy',
    tracks: happyTracks,
    mood: 'happy',
    category: 'energizing'
  }
];

// Ensure we always return a non-empty array
export default mockPlaylists;
