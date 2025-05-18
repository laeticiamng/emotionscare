
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock tracks
export const mockMusicTracks: MusicTrack[] = [
  {
    id: 'calm1',
    title: 'Méditation profonde',
    artist: 'Zen Masters',
    duration: 320,
    audioUrl: '/audio/meditation.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    emotion: 'calm',
    genre: 'ambient'
  },
  {
    id: 'happy1',
    title: 'Joie de vivre',
    artist: 'Positive Vibes',
    duration: 240,
    audioUrl: '/audio/happy.mp3',
    coverUrl: '/images/covers/happy.jpg',
    emotion: 'happy',
    genre: 'pop'
  },
  {
    id: 'focus1',
    title: 'Concentration optimale',
    artist: 'Deep Focus',
    duration: 420,
    audioUrl: '/audio/focus.mp3',
    coverUrl: '/images/covers/focus.jpg',
    emotion: 'focus',
    genre: 'instrumental'
  }
];

// Mock playlists
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Calme et sérénité',
    description: 'Pour se détendre et méditer',
    emotion: 'calm',
    tracks: mockMusicTracks.filter(track => track.emotion === 'calm')
  },
  {
    id: 'happy-playlist',
    name: 'Boost de bonheur',
    description: 'Pour rester positif toute la journée',
    emotion: 'happy',
    tracks: mockMusicTracks.filter(track => track.emotion === 'happy')
  },
  {
    id: 'focus-playlist',
    name: 'Concentration maximale',
    description: 'Pour rester concentré pendant le travail',
    emotion: 'focus',
    tracks: mockMusicTracks.filter(track => track.emotion === 'focus')
  }
];

export function getMockMusicData() {
  return {
    tracks: mockMusicTracks,
    playlists: mockPlaylists
  };
}
