
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock tracks for development
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    duration: 180,
    url: '/sounds/ambient-calm.mp3',
    coverUrl: '/images/covers/calm-waters.jpg',
    emotion: 'calm',
    genre: 'ambient',
  },
  {
    id: '2',
    title: 'Morning Energy',
    artist: 'Rise Up',
    duration: 210,
    url: '/sounds/welcome.mp3',
    coverUrl: '/images/covers/morning-energy.jpg',
    emotion: 'joy',
    genre: 'upbeat',
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'Mind Flow',
    duration: 245,
    url: '/sounds/ambient-calm.mp3',
    coverUrl: '/images/covers/deep-focus.jpg',
    emotion: 'neutral',
    genre: 'concentration',
  },
  {
    id: '4',
    title: 'Evening Relaxation',
    artist: 'Twilight Dreams',
    duration: 320,
    url: '/sounds/ambient-calm.mp3',
    coverUrl: '/images/covers/evening-relax.jpg',
    emotion: 'calm',
    genre: 'relaxation',
  }
];

// Mock playlists for development
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    name: 'Calm Emotions',
    description: 'Perfect for relaxation and unwinding',
    emotion: 'calm',
    tracks: mockTracks.filter(track => track.emotion === 'calm'),
    coverUrl: '/images/covers/calm-playlist.jpg',
  },
  {
    id: 'playlist-2',
    name: 'Positive Energy',
    description: 'Boost your mood with these tracks',
    emotion: 'joy',
    tracks: mockTracks.filter(track => track.emotion === 'joy'),
    coverUrl: '/images/covers/joy-playlist.jpg',
  }
];

// Helper functions
export const getTrackById = (id: string): MusicTrack | undefined => {
  return mockTracks.find(track => track.id === id);
};

export const getPlaylistById = (id: string): MusicPlaylist | undefined => {
  return mockPlaylists.find(playlist => playlist.id === id);
};

export const getPlaylistsByEmotion = (emotion: string): MusicPlaylist[] => {
  return mockPlaylists.filter(playlist => playlist.emotion === emotion);
};
