
import { MusicPlaylist, MusicTrack } from '@/types/music';

// Mock tracks
export const mockTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Calm Waters',
    artist: 'Nature Sounds',
    duration: 180,
    audioUrl: 'https://example.com/tracks/calm-waters.mp3',
    url: 'https://example.com/tracks/calm-waters.mp3',
    coverUrl: 'https://example.com/images/calm-waters.jpg',
    mood: 'calm'
  },
  {
    id: 'track-2',
    title: 'Happy Days',
    artist: 'Positive Vibes',
    duration: 210,
    audioUrl: 'https://example.com/tracks/happy-days.mp3',
    url: 'https://example.com/tracks/happy-days.mp3',
    coverUrl: 'https://example.com/images/happy-days.jpg',
    mood: 'happy'
  },
  {
    id: 'track-3',
    title: 'Focus Energy',
    artist: 'Mind Control',
    duration: 240,
    audioUrl: 'https://example.com/tracks/focus-energy.mp3',
    url: 'https://example.com/tracks/focus-energy.mp3',
    coverUrl: 'https://example.com/images/focus-energy.jpg',
    mood: 'focus'
  }
];

// Mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    title: 'Calm Collection',
    tracks: mockTracks.filter(track => track.mood === 'calm'),
    coverUrl: 'https://example.com/playlists/calm-collection.jpg',
    mood: 'calm'
  },
  {
    id: 'playlist-2',
    title: 'Happy Vibes',
    tracks: mockTracks.filter(track => track.mood === 'happy'),
    coverUrl: 'https://example.com/playlists/happy-vibes.jpg',
    mood: 'happy'
  },
  {
    id: 'playlist-3',
    title: 'Focus Mode',
    tracks: mockTracks.filter(track => track.mood === 'focus'),
    coverUrl: 'https://example.com/playlists/focus-mode.jpg',
    mood: 'focus'
  }
];
